import { supabase } from './app.js';

// Script de migration : convertit le JSON en données Supabase
async function migrateCookieToSupabase() {
  try {
    // Charger le JSON existant
    const response = await fetch('../assets/data/cookie-temeraire_data.json');
    const cookieData = await response.json();
    
    console.log('📦 Données JSON chargées:', cookieData);
    
    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('cookies')
      .insert([cookieData])
      .select();
    
    if (error) {
      console.error('❌ Erreur insertion:', error);
      return;
    }
    
    console.log('✅ Cookie migré avec succès:', data);
    alert('Cookie Téméraire migré vers Supabase !');
    
  } catch (error) {
    console.error('❌ Erreur migration:', error);
  }
}

// Appeler la fonction au chargement
migrateCookieToSupabase();
