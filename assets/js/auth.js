// Vérifier si un utilisateur est connecté
function isLoggedIn() {
  return localStorage.getItem('crk-current-user') !== null;
}

// Obtenir l'utilisateur connecté
function getCurrentUser() {
  return localStorage.getItem('crk-current-user');
}

// Déconnexion
function logout() {
  localStorage.removeItem('crk-current-user');
  window.location.href = '../pages/login.html';
}

// Afficher le nom d'utilisateur dans le header
document.addEventListener('DOMContentLoaded', () => {
  const userInfoDiv = document.getElementById('user-info');
  
  if (userInfoDiv) {
    if (isLoggedIn()) {
      const username = getCurrentUser();
      userInfoDiv.innerHTML = `
        <span class="welcome-message">Bienvenue, <strong>${username}</strong> !</span>
        <button onclick="logout()" class="btn btn-logout">
          <span>Déconnexion</span>
        </button>
      `;
    } else {
      userInfoDiv.innerHTML = `
        <a href="../pages/login.html" class="btn btn-login-header">
          <span>Connexion</span>
        </a>
      `;
    }
  }
});
