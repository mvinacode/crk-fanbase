fetch('../includes/header_cookie.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

// Fenêtre costume
const btnCostume = document.querySelector('.btn-costume');
const popupCostume = document.getElementById('popup-costume');
const closePopup = document.getElementById('close-popup');

btnCostume.addEventListener('click', () => {
  popupCostume.style.display = 'flex';
});

closePopup.addEventListener('click', () => {
  popupCostume.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === popupCostume) {
    popupCostume.style.display = 'none';
  }
});

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

document.addEventListener("DOMContentLoaded", () => {
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
});
