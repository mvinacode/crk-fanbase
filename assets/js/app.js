import { createClient } from '@supabase/supabase-js'

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialisation
export const supabase = createClient(supabaseUrl, supabaseKey)

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

// Redirection automatique supprimée pour permettre l'accès public
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
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