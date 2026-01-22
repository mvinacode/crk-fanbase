// Charger le header
fetch('../includes/header_cookie.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

// Récupérer l'ID du cookie depuis l'URL (ex: cookie.html?id=cookie-lys-blanc)
const urlParams = new URLSearchParams(window.location.search);
const cookieId = urlParams.get('id') || 'cookie-lys-blanc'; // Par défaut Lys Blanc pour le test

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
    
    renderCookie(cookieData);
    renderCostumes(cookieData.costumes);
    setupImageCycles();
    setupCostumePopup();
  })
  .catch(error => {
    console.error('Erreur chargement données:', error);
    document.getElementById('page-cookie').innerHTML = '<p>Erreur de chargement des données du cookie.</p>';
  });

function renderCookie(data) {
  const pageContainer = document.getElementById('page-cookie');
  
  // Générer les toppings HTML
  let toppingsHTML = '';
  data.toppings.forEach((topping, index) => {
    const imagesJSON = JSON.stringify(topping.images);
    toppingsHTML += `
      <img alt="Garniture évolutive" class="garniture-cycle" 
           data-id="garniture-${index}" 
           data-images='${imagesJSON}' 
           data-step="0" 
           src="${topping.images[0]}"/>
    `;
  });
  
  // Générer les tartelettes HTML
  let tartelettesHTML = '';
  data.tartelettes.forEach((tartelette, index) => {
    const imagesJSON = JSON.stringify(tartelette.images);
    tartelettesHTML += `
      <img alt="Tartelette évolutive" class="tartelette-cycle" 
           data-id="tartelette-${index}" 
           data-images='${imagesJSON}' 
           data-step="0" 
           src="${tartelette.images[0]}"/>
    `;
  });
  
  // Générer les biscuits HTML
  let biscuitsHTML = '';
  data.biscuits.forEach((biscuit, index) => {
    const imagesJSON = JSON.stringify(biscuit.images);
    biscuitsHTML += `
      <img alt="Biscuit évolutif" class="biscuit-cycle" 
           data-id="biscuit-${index}" 
           data-images='${imagesJSON}' 
           data-step="0" 
           src="${biscuit.images[0]}"/>
    `;
  });
  
  // Générer les promotions HTML
  let promotionsHTML = '';
  data.promotions.forEach((promotion, index) => {
    const imagesJSON = JSON.stringify(promotion.images);
    promotionsHTML += `
      <img alt="Promotion évolutive" class="promotion-cycle" 
           data-id="promotion-${index}" 
           data-images='${imagesJSON}' 
           data-step="0" 
           src="${promotion.images[0]}"/>
    `;
  });
  
  // Générer l'ascension HTML
  const ascensionImagesJSON = JSON.stringify(data.ascension.etoiles);
  
  pageContainer.innerHTML = `
    <div class="bloc-fond-cookie">
      <div class="fond-floute"></div>
      <h1 class="nom-cookie">${data.nom}</h1>
    </div>
    
    <div class="illustration-cookie">
      <img id="illustration-main" alt="Illustration Cookie" src="${data.illustration}"/>
    </div>

    <div class="badges">
      <img alt="Rareté" class="badge" src="${data.badges.rarete}"/>
      <img alt="Classe" class="badge" src="${data.badges.classe}"/>
      <img alt="Element" class="badge" src="${data.badges.element}"/>
    </div>

    <div class="toppings">
      ${toppingsHTML}
    </div>

    <div class="tartelettes">
      ${tartelettesHTML}
    </div>

    <div class="biscuits">
      ${biscuitsHTML}
    </div>

    <div class="promotion">
      ${promotionsHTML}
    </div>

    <div class="ascension">
      <img alt="Ascension évolutive" class="ascension-cycle" 
           data-id="ascension-star" 
           data-images='${ascensionImagesJSON}' 
           data-step="0" 
           src="${data.ascension.etoiles[0]}"/>
    </div>

    <a class="btn-costume" id="btn-costume"><span>Costumes</span></a>
    <a class="btn-cookie-precedent" href="${data.navigation.precedent.url}"><span>Cookie précédent</span></a>
    <a class="btn-cookie-suivant" href="${data.navigation.suivant.url}"><span>Cookie suivant</span></a>
  `;
  
  // Définir l'attribut data-cookie-id pour le localStorage
  pageContainer.setAttribute('data-cookie-id', data.id.replace(/-/g, '_'));
}

function renderCostumes(costumes) {
  const gallery = document.getElementById('costume-gallery');
  
  costumes.forEach((costume, index) => {
    const imagesJSON = JSON.stringify(costume.images);
    const mythiqueIcon = costume.iconeMythique ? 
      `<img src="${costume.iconeMythique}" alt="Icône mythique" class="icon-small">` : '';
    
    const costumeHTML = `
      <div class="costume-item">
        <img alt="${costume.nom}" class="costume-toggle" 
             data-id="costume-${index}" 
             data-images='${imagesJSON}' 
             ${costume.illustrationReplace ? `data-illustration-replace="${costume.illustrationReplace}"` : ''}
             ${costume.illustrationReplaceOr ? `data-illustration-replace-or="${costume.illustrationReplaceOr}"` : ''}
             data-step="0" 
             src="${costume.images[0]}"/>
        <div class="costume-icon">
          <img alt="Icône ${costume.nom}" src="${costume.icone}"/>
        </div>
        <p class="costume-name">${costume.nom} ${mythiqueIcon}</p>
      </div>
    `;
    
    gallery.innerHTML += costumeHTML;
  });
}

function setupImageCycles() {
  // Gérer tous les cycles d'images (toppings, tartelettes, biscuits, promotions, ascension)
  const cyclableElements = document.querySelectorAll('[data-images]');
  
  cyclableElements.forEach(element => {
    element.addEventListener('click', function() {
      const images = JSON.parse(this.getAttribute('data-images'));
      let currentStep = parseInt(this.getAttribute('data-step'));
      
      // Passer à l'image suivante (boucle)
      currentStep = (currentStep + 1) % images.length;
      
      this.src = images[currentStep];
      this.setAttribute('data-step', currentStep);
    });
  });
  
  // Gérer les costumes avec remplacement d'illustration
  const costumeToggles = document.querySelectorAll('.costume-toggle');
  const illustrationMain = document.getElementById('illustration-main');
  
  costumeToggles.forEach(costume => {
    costume.addEventListener('click', function() {
      const images = JSON.parse(this.getAttribute('data-images'));
      let currentStep = parseInt(this.getAttribute('data-step'));
      
      // Passer à l'image suivante
      currentStep = (currentStep + 1) % images.length;
      
      this.src = images[currentStep];
      this.setAttribute('data-step', currentStep);
      
      // Remplacer l'illustration principale si nécessaire
      const illustrationReplace = this.getAttribute('data-illustration-replace');
      const illustrationReplaceOr = this.getAttribute('data-illustration-replace-or');
      
      if (illustrationReplace && currentStep === 1) {
        illustrationMain.src = illustrationReplace;
      } else if (illustrationReplaceOr && currentStep === 2) {
        illustrationMain.src = illustrationReplaceOr;
      }
    });
  });
}

function setupCostumePopup() {
  const popup = document.getElementById('popup-costume');
  const btnCostume = document.getElementById('btn-costume');
  const closePopup = document.getElementById('close-popup');
  
  if (btnCostume) {
    btnCostume.addEventListener('click', (e) => {
      e.preventDefault();
      popup.style.display = 'flex';
    });
  }
  
  if (closePopup) {
    closePopup.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }
  
  window.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });
}
