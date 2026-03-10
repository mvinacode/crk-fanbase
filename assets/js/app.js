import { createClient } from '@supabase/supabase-js'

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialisation
export const supabase = createClient(supabaseUrl, supabaseKey)

console.log("Supabase est prêt !")

// A ajouter dans app.js après la ligne "const supabase = ..."

async function getCookies() {
  const { data, error } = await supabase
    .from('cookies') // Table en minuscule
    .select('*')

  if (error) {
    console.error("Erreur de récupération :", error)
  } else {
    console.log("Mes Cookies trouvés :", data)
  }
}

// On lance la fonction pour tester
getCookies()

// --- Gestion de l'expiration de session (24h) ---
const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

// Fonction pour rafraîchir le temps de dernière activité
export function refreshActivityTime() {
  localStorage.setItem('crk_last_activity', Date.now().toString());
}

// Vérifier l'expiration au chargement initial de app.js
async function checkSessionExpiration() {
  const lastActivity = localStorage.getItem('crk_last_activity');
  if (lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity, 10);
    if (elapsed > SESSION_TIMEOUT_MS) {
      console.log("Session expirée (inactivité > 24h), déconnexion...");
      localStorage.removeItem('crk_last_activity');
      await supabase.auth.signOut();

      const currentPath = window.location.pathname;
      if (!currentPath.includes('login.html')) {
        const loginUrl = currentPath.includes('/pages/') ? 'login.html' : 'pages/login.html';
        window.location.href = loginUrl;
      }
      return true; // Expiré
    }
  }
  refreshActivityTime(); // Session valide ou absente, on met à jour
  return false; // Non expiré
}

checkSessionExpiration();

// Redirection automatique si l'utilisateur est déconnecté (par Supabase ou par notre script)
supabase.auth.onAuthStateChange(async (event, session) => {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('login.html');

  if (!session && !isLoginPage) {
    // Rediriger vers la page de login en fonction de l'emplacement actuel (racine ou sous-dossier)
    const loginUrl = currentPath.includes('/pages/') ? 'login.html' : 'pages/login.html';
    window.location.href = loginUrl;
  } else if (session) {
    // S'il y a une session (ex: connexion réussie), on s'assure de démarrer le chronomètre
    refreshActivityTime();
  }
});

// Ajouter un écouteur sur le document pour rafraîchir l'activité lors des clics (optionnel, pour repousser l'expiration)
document.addEventListener('click', () => {
  if (localStorage.getItem('crk_last_activity')) {
    refreshActivityTime();
  }
});