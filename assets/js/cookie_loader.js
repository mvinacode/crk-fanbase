// Charger le header
fetch('../includes/header_cookie.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

// Récupérer l'ID du cookie depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const cookieId = urlParams.get('id') || 'cookie-temeraire';

// Fonction pour charger dynamiquement un fichier CSS
function loadCSS(filename) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `../assets/css/${filename}`;
  link.id = 'dynamic-cookie-css';
  document.head.appendChild(link);
}

// Fonction pour charger dynamiquement un fichier JS
function loadJS(filename) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `../assets/js/${filename}`;
    script.id = 'dynamic-cookie-js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Charger les données du cookie
fetch(`../assets/data/${cookieId}_data.json`)
  .then(response => response.json())
  .then(async cookieData => {
    // Changer le titre de la page
    document.title = cookieData.pageTitle || cookieData.nom;
    
    // Charger le CSS spécifique
    if (cookieData.cssFile) {
      loadCSS(cookieData.cssFile);
    }
    
    // Charger le JS spécifique si nécessaire
    if (cookieData.jsFile) {
      await loadJS(cookieData.jsFile);
    }
    
    // Les fonctions renderCookie, renderCostumes, etc. seront définies dans le JS chargé
    if (typeof renderCookie === 'function') {
      renderCookie(cookieData);
    }
    if (typeof renderCostumes === 'function') {
      renderCostumes(cookieData.costumes);
    }
    if (typeof setupImageCycles === 'function') {
      setupImageCycles();
    }
    if (typeof setupCostumePopup === 'function') {
      setupCostumePopup();
    }
  })
  .catch(error => {
    console.error('Erreur chargement données:', error);
    document.getElementById('page-cookie').innerHTML = '<p>Erreur de chargement des données du cookie.</p>';
  });
