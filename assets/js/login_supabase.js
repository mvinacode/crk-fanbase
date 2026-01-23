import { supabase } from './app.js';

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
  return { success: true, user: data.user };
}

// Déconnexion
export async function logout() {
  await supabase.auth.signOut();
}

// Inscription utilisateur (optionnel)
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, user: data.user };
}
