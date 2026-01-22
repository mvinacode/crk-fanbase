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
    .from('Cookies') // Attention aux majuscules !
    .select('*')
 
  if (error) {
    console.error("Erreur de récupération :", error)
  } else {
    console.log("Mes Cookies trouvés :", data)
  }
}
 
// On lance la fonction pour tester
getCookies()