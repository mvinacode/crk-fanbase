// Simuler une petite base de données d'utilisateurs en localStorage
function initUserDatabase() {
  if (!localStorage.getItem('crk-users')) {
    const defaultUsers = {
      'demo': 'demo123',
      'admin': 'admin'
    };
    localStorage.setItem('crk-users', JSON.stringify(defaultUsers));
  }
}

// Vérifier si un utilisateur est connecté
function isLoggedIn() {
  return localStorage.getItem('crk-current-user') !== null;
}

// Obtenir l'utilisateur connecté
function getCurrentUser() {
  return localStorage.getItem('crk-current-user');
}

// Connexion
function login(username, password) {
  const users = JSON.parse(localStorage.getItem('crk-users') || '{}');
  
  if (users[username] && users[username] === password) {
    localStorage.setItem('crk-current-user', username);
    return { success: true };
  }
  
  return { success: false, error: 'Nom d\'utilisateur ou mot de passe incorrect' };
}

// Inscription
function register(username, password) {
  const users = JSON.parse(localStorage.getItem('crk-users') || '{}');
  
  if (users[username]) {
    return { success: false, error: 'Ce nom d\'utilisateur existe déjà' };
  }
  
  if (username.length < 3) {
    return { success: false, error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
  }
  
  if (password.length < 4) {
    return { success: false, error: 'Le mot de passe doit contenir au moins 4 caractères' };
  }
  
  users[username] = password;
  localStorage.setItem('crk-users', JSON.stringify(users));
  localStorage.setItem('crk-current-user', username);
  
  return { success: true };
}

// Déconnexion
function logout() {
  localStorage.removeItem('crk-current-user');
}

// Initialiser la page de connexion
document.addEventListener('DOMContentLoaded', () => {
  initUserDatabase();
  
  // Si déjà connecté, rediriger vers l'accueil
  if (isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }
  
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const registerLink = document.getElementById('register-link');
  
  // Gérer la soumission du formulaire
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const result = login(username, password);
    
    if (result.success) {
      // Connexion réussie - rediriger vers l'accueil
      window.location.href = '../index.html';
    } else {
      // Afficher l'erreur
      errorMessage.textContent = result.error;
      
      // Effet de secousse sur le formulaire
      loginForm.style.animation = 'shake 0.5s';
      setTimeout(() => {
        loginForm.style.animation = '';
      }, 500);
    }
  });
  
  // Lien d'inscription
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    const username = prompt('Choisissez un nom d\'utilisateur (min 3 caractères) :');
    if (!username) return;
    
    const password = prompt('Choisissez un mot de passe (min 4 caractères) :');
    if (!password) return;
    
    const result = register(username, password);
    
    if (result.success) {
      alert('Inscription réussie ! Vous êtes maintenant connecté.');
      window.location.href = '../index.html';
    } else {
      errorMessage.textContent = result.error;
    }
  });
});

// Animation de secousse pour les erreurs
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);
