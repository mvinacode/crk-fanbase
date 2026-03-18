import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000;

export function refreshActivityTime() {
  localStorage.setItem('crk_last_activity', Date.now().toString());
}

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
      return true;
    }
  }
  refreshActivityTime();
  return false;
}

checkSessionExpiration();

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    refreshActivityTime();
  }
});

document.addEventListener('click', () => {
  if (localStorage.getItem('crk_last_activity')) {
    refreshActivityTime();
  }
});