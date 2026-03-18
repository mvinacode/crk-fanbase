import { supabase } from './app.js';

// Résout un chemin relatif selon la position de la page (sous-dossier /pages/ ou racine)
function resolveRelativePath(subfolderPath, rootPath) {
  return window.location.pathname.includes('/pages/') ? subfolderPath : rootPath;
}

// Utilitaire de sécurisation contre les failles XSS
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Vérifie si un utilisateur est connecté (session Supabase)
export async function isLoggedIn() {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

// Connexion utilisateur
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }

  // Initialiser le timer d'activité
  localStorage.setItem('crk_last_activity', Date.now().toString());

  return { success: true, user: data.user };
}

// Déconnexion
export async function logout() {
  localStorage.removeItem('crk_last_activity');
  await supabase.auth.signOut();
}

// Inscription utilisateur (optionnel)
export async function register(email, password) {
  if (!password || password.length < 6) {
    return { success: false, error: "Le mot de passe doit faire au moins 6 caractères." };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, user: data.user };
}

// Fonction centralisée pour initialiser les infos utilisateur dans le header
export async function initUserInfo() {
  const userInfo = document.getElementById('user-info');
  if (!userInfo) return;

  const { data } = await supabase.auth.getUser();
  const loginUrl = resolveRelativePath('login.html', 'pages/login.html');

  if (data.user) {
    userInfo.innerHTML = `
      <a href="#" id="logout-btn" class="nav-icon-link">
        <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773164562/deconnexion_u529fl.webp" alt="Déconnexion">
      </a>`;
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = async (e) => {
        e.preventDefault();
        await logout();
        window.location.reload();
      };
    }
  } else {
    userInfo.innerHTML = `
      <a href="${loginUrl}" class="nav-icon-link">
        <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773164563/connexion_p2ilhv.webp" alt="Connexion">
      </a>`;
  }
}

// Affiche une notification pour les invités tentant une action restreinte
export function showGuestNotification() {
  let overlay = document.getElementById('guest-notif-overlay');
  
  if (!overlay) {
    const loginUrl = resolveRelativePath('login.html', 'pages/login.html');
    const cssPath  = resolveRelativePath('../assets/css/guest_notification.css', 'assets/css/guest_notification.css');

    if (!document.getElementById('guest-notif-css')) {
      const link = document.createElement('link');
      link.id = 'guest-notif-css';
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }

    overlay = document.createElement('div');
    overlay.id = 'guest-notif-overlay';
    overlay.className = 'guest-notif-overlay';

    const logoUrl = 'https://res.cloudinary.com/dkgfa4apm/image/upload/v1773244370/logo_patch_7_2_sswoae.webp';

    overlay.innerHTML = `
      <div class="guest-notif-container">
        <span class="guest-notif-close">&times;</span>
        <img src="${logoUrl}" alt="CookieRun" class="guest-notif-icon">
        <h2>Oh ! Un visiteur !</h2>
        <p>Pour enregistrer tes toppings, builds et costumes préférés, tu dois avoir un compte. C'est gratuit et rapide !</p>
        <div class="guest-notif-buttons">
          <a href="${loginUrl}" class="guest-btn guest-btn-primary">Se connecter / S'inscrire</a>
          <button class="guest-btn guest-btn-secondary" id="guest-notif-close-btn">Continuer en tant que visiteur</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closePopup = () => overlay.classList.remove('show');

    overlay.querySelector('.guest-notif-close').addEventListener('click', closePopup);
    document.getElementById('guest-notif-close-btn').addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
  }

  // Afficher avec un léger délai pour l'animation
  setTimeout(() => {
    overlay.classList.add('show');
  }, 10);
}
