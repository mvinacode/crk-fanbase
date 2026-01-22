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

// Charger les données du cookie
fetch(`../assets/data/${cookieId}_data.json`)
  .then(response => response.json())
  .then(cookieData => {
    // Changer le titre de la page
    document.title = cookieData.pageTitle || cookieData.nom;
    
    // Charger le CSS spécifique
    if (cookieData.cssFile) {
      loadCSS(cookieData.cssFile);
    }
    
    renderCookie(cookieData);
    renderCostumes(cookieData.costumes);
    
    // Attendre que le DOM soit mis à jour avant d'attacher les événements
    setTimeout(() => {
      setupImageCycles();
      setupCostumePopup();
    }, 0);
  })
  .catch(error => {
    console.error('Erreur chargement données:', error);
    document.getElementById('page-cookie').innerHTML = '<p>Erreur de chargement des données du cookie.</p>';
  });

// === FONCTIONS POUR LE RENDU DYNAMIQUE ===

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
      ${data.badges.element ? `<img alt="Element" class="badge" src="${data.badges.element}"/>` : ''}
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
    ${data.navigation.precedent ? `<a class="btn-cookie-precedent" href="${data.navigation.precedent.url}"><span>Cookie précédent</span></a>` : ''}
    ${data.navigation.suivant ? `<a class="btn-cookie-suivant" href="${data.navigation.suivant.url}"><span>Cookie suivant</span></a>` : ''}
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
    
    gallery.insertAdjacentHTML('beforeend', costumeHTML);
  });
}

function setupImageCycles() {
  // === SYSTÈME DE DÉTECTION PAR ÉLÉMENT INDIVIDUEL ===
  function generateElementSignature(element) {
    const id = element.dataset.id;
    const images = element.dataset.images;
    if (!id || !images) return null;
    
    // Crée un hash unique pour cet élément spécifique
    const signature = (id + images).split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0).toString();
    
    return signature;
  }

  function checkIndividualChanges() {
    const elements = document.querySelectorAll('.garniture-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle, .ascension-cycle, .costume-toggle');
    
    console.log(`🔍 Vérification de ${elements.length} éléments`);
    
    elements.forEach(el => {
      const id = el.dataset.id;
      if (!id) {
        console.log('⚠️ Élément sans data-id trouvé, ignoré');
        return;
      }
      
      const signatureKey = `signature:${id}`;
      const currentSignature = generateElementSignature(el);
      const savedSignature = localStorage.getItem(signatureKey);
      
      console.log(`📋 ${id}:`);
      console.log(`  - Signature actuelle: ${currentSignature}`);
      console.log(`  - Signature sauvegardée: ${savedSignature}`);
      
      // Si la signature de CET élément a changé
      if (savedSignature && savedSignature !== currentSignature) {
        console.log(`🔄 Modification détectée pour ${id} - Réinitialisation de cet élément uniquement`);
        
        // ✅ Supprime UNIQUEMENT l'état de CET élément
        localStorage.removeItem(`etat-${id}`);
      } else if (!savedSignature) {
        console.log(`✨ Première visite pour ${id}`);
      } else {
        console.log(`✅ Aucun changement pour ${id}`);
      }
      
      // Sauvegarde la signature de cet élément
      localStorage.setItem(signatureKey, currentSignature);
    });
  }

  // APPELLE LA VÉRIFICATION AU CHARGEMENT
  checkIndividualChanges();

  // === CODE EXISTANT (inchangé) ===
  const elements = document.querySelectorAll('.costume-toggle, .garniture-cycle, .ascension-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle');

  elements.forEach(img => {
    const images = JSON.parse(img.dataset.images);
    const id = img.dataset.id;

    if (!id) return;

    // Charger l'état sauvegardé
    const savedStep = localStorage.getItem(`etat-${id}`);
    if (savedStep !== null) {
      img.dataset.step = savedStep;
      img.src = images[savedStep];
    }

    // Gérer les clics
    img.addEventListener('click', () => {
      let currentStep = parseInt(img.dataset.step);
      currentStep = (currentStep + 1) % images.length;
      img.src = images[currentStep];
      img.dataset.step = currentStep;

      localStorage.setItem(`etat-${id}`, currentStep);
    });
  });

  // Bouton de sauvegarde (effet visuel uniquement)
  document.getElementById('btn-save').addEventListener('click', () => {
    alert('Modifications sauvegardées 🍪');
  });

  // Gestion du changement d'illustration selon les costumes
  const mainIllustration = document.querySelector(".illustration-cookie img");
  const gallery = document.querySelector(".costume-gallery");
  if (!mainIllustration || !gallery) return;

  const cookieIdAttr = document.querySelector(".page-cookie")?.getAttribute("data-cookie-id");
  const nameKey =
    (document.querySelector(".nom-cookie")?.textContent || location.pathname.split("/").pop() || "cookie")
      .trim().toLowerCase().replace(/\s+/g, "-");
  const pageKey = cookieIdAttr || nameKey;
  const LS_KEY = `cookie-illustration:${pageKey}`;

  const getColorSrc = (el) => {
    try {
      const arr = JSON.parse(el.getAttribute("data-images") || "[]");
      return arr.length ? arr[arr.length - 1] : null;
    } catch { return null; }
  };

  const getTargetIllustration = (el) =>
    el.getAttribute("data-illustration-replace") || getColorSrc(el);

  const isObtained = (el) => {
    const step = parseInt(el.getAttribute("data-step") || "0", 10);
    return step >= 1 || el.classList.contains("obtained");
  };

  const applyIllustration = (src) => {
    if (!src) return;
    mainIllustration.src = src;
    localStorage.setItem(LS_KEY, src);
  };

  // Sauvegarde l'image d'origine
  const originalSrc = mainIllustration.getAttribute("data-original") || mainIllustration.src;
  mainIllustration.setAttribute("data-original", originalSrc);

  // Restaurer l'illustration sauvegardée au chargement
  const saved = localStorage.getItem(LS_KEY);
  if (saved) mainIllustration.src = saved;

  // Fonction pour vérifier si TOUS les costumes sont revenus en NB
  const checkAllReset = () => {
    const costumes = gallery.querySelectorAll(".costume-toggle");
    const allReset = Array.from(costumes).every(c => !isObtained(c));
    if (allReset) {
      // remet l'illustration d'origine
      mainIllustration.src = originalSrc;
      localStorage.removeItem(LS_KEY);
      console.log("🔄 Tous les costumes sont revenus en NB — illustration d'origine restaurée.");
    }
  };

  // Quand on clique sur un costume
  gallery.addEventListener("click", (e) => {
    const img = e.target.closest(".costume-toggle");
    if (!img) return;
    setTimeout(() => {
      if (isObtained(img)) {
        const newSrc = getTargetIllustration(img);
        applyIllustration(newSrc);
      } else {
        // Si on a repassé en NB, vérifier si tous le sont
        checkAllReset();
      }
    }, 0);
  });
}

function setupCostumePopup() {
  // Configuration du popup de costumes
  const btnCostume = document.getElementById('btn-costume');
  const popupCostume = document.getElementById('popup-costume');
  const closePopup = document.getElementById('close-popup');

  if (btnCostume) {
    btnCostume.addEventListener('click', (e) => {
      e.preventDefault();
      popupCostume.style.display = 'flex';
    });
  }

  if (closePopup) {
    closePopup.addEventListener('click', () => {
      popupCostume.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === popupCostume) {
      popupCostume.style.display = 'none';
    }
  });
}
