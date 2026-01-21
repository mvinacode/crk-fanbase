// ------------------------------
// Chargement du header
// ------------------------------
fetch('../includes/header_cookie.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

// ------------------------------
// Fenêtre costume (popup)
// ------------------------------
const btnCostume = document.querySelector('.btn-costume');
const popupCostume = document.getElementById('popup-costume');
const closePopup = document.getElementById('close-popup');

btnCostume?.addEventListener('click', () => {
  popupCostume.style.display = 'flex';
});

closePopup?.addEventListener('click', () => {
  popupCostume.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === popupCostume) {
    popupCostume.style.display = 'none';
  }
});

// ------------------------------
// Détection du cookie courant (clé unique par page)
// ------------------------------
const pageCookieEl = document.querySelector(".page-cookie");
const cookieIdAttr = pageCookieEl?.getAttribute("data-cookie-id");
const nameKey =
  (document.querySelector(".nom-cookie")?.textContent || location.pathname.split("/").pop() || "cookie")
    .trim().toLowerCase().replace(/\s+/g, "-");
const pageKey = cookieIdAttr || nameKey;

// Clés de stockage unifiées
const BASE_KEY = `cookie-base:${pageKey}`;       // image promo/éveil courante
const COSTUME_KEY = `cookie-costume:${pageKey}`; // image costume (si actif)

// ------------------------------
// Ciblage illustration principale
// ------------------------------
const mainIllustration = document.getElementById('main-cookie-img');

// Fonction centrale d’affichage
function refreshIllustration() {
  const base = localStorage.getItem(BASE_KEY);
  const costume = localStorage.getItem(COSTUME_KEY);
  if (!mainIllustration) return;

  if (costume) {
    mainIllustration.src = costume;       // costume prioritaire
  } else if (base) {
    mainIllustration.src = base;          // sinon base promo
  }
}

// Sauvegarde l'original comme fallback si rien n'est stocké
if (mainIllustration) {
  const originalSrc = mainIllustration.getAttribute("data-original") || mainIllustration.src;
  mainIllustration.setAttribute("data-original", originalSrc);
  if (!localStorage.getItem(BASE_KEY)) {
    localStorage.setItem(BASE_KEY, originalSrc);
  }
}

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
  const elements = document.querySelectorAll('.garniture-cycle, .biscuit-cycle, .tartelette-cycle, .costume-toggle');
  
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
const elements = document.querySelectorAll('.costume-toggle, .garniture-cycle, .biscuit-cycle, .tartelette-cycle');

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

// ------------------------------
// Bouton de sauvegarde (effet visuel uniquement)
// ------------------------------
document.getElementById('btn-save')?.addEventListener('click', () => {
  alert('Modifications sauvegardées 🍪');
});

// ------------------------------
// Gestion Promotion / Éveil
// ------------------------------
const eveilElements = document.querySelectorAll('.promotion-bete-cycle');

// Helper pour définir la BASE selon le step
function setBaseForStep(step) {
  // Adapte ici si tu as d'autres paliers/images
  let baseSrc;
  if (step === 2 || step === 3) {
    baseSrc = "../assets/images/cookies/cookie_lait_de_l_ombre/cookie_lait_de_l_ombre_2_stars.webp";
  } else if (step === 4 || step === 5) {
    baseSrc = "../assets/images/cookies/cookie_lait_de_l_ombre/cookie_lait_de_l_ombre_4_stars.webp";
  } else if (step === 6) {
    baseSrc = "../assets/images/cookies/cookie_lait_de_l_ombre/cookie_lait_de_l_ombre_6_stars.webp";
  } else {
    baseSrc = "../assets/images/cookies/cookie_lait_de_l_ombre/cookie_lait_de_l_ombre_base.webp";
  }

  localStorage.setItem(BASE_KEY, baseSrc);
  refreshIllustration(); // affiche costume si actif, sinon base
}

// Charger le step de l'éveil si sauvegardé et brancher les clics
eveilElements.forEach(img => {
  try {
    const images = JSON.parse(img.dataset.images || "[]");
    const id = img.dataset.id;

    // restaurer l’icone/step enregistré (affichage des petites icônes)
    const savedStep = localStorage.getItem(`etat-${id}`);
    if (savedStep !== null) {
      img.dataset.step = savedStep;
      if (images.length) {
        const idx = parseInt(savedStep, 10);
        img.src = images[idx] || img.src;
      }
    }

    img.addEventListener('click', () => {
      let currentStep = parseInt(img.dataset.step || "0", 10);
      currentStep = (currentStep + 1) % images.length;
      img.src = images[currentStep] || img.src;
      img.dataset.step = currentStep.toString();

      // Sauvegarder l'état actuel de l’icone
      localStorage.setItem(`etat-${id}`, currentStep);

      // Définir la BASE (promo) en fonction du step, sans écraser l’affichage costume
      setBaseForStep(currentStep);
    });
  } catch { /* ignore */ }
});

// ------------------------------
// Gestion des costumes (galerie)
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".costume-gallery");
  if (!mainIllustration || !gallery) {
    // Même sans galerie, on s'assure d'afficher le bon état au chargement
    refreshIllustration();
    return;
  }

  // Helpers lecture d'attributs
  const getTargetIllustration = (el) => {
    const step = parseInt(el.getAttribute("data-step") || "0", 10);
    // Priorité aux remplacements explicites si fournis
    if (step >= 2 && el.hasAttribute("data-illustration-replace-or")) {
      return el.getAttribute("data-illustration-replace-or");
    }
    if (step >= 1 && el.hasAttribute("data-illustration-replace")) {
      return el.getAttribute("data-illustration-replace");
    }
    try {
      const arr = JSON.parse(el.getAttribute("data-images") || "[]");
      if (arr.length === 0) return null;
      if (step >= 2 && arr.length >= 3) return arr[2]; // 3e image = OR (si tu utilises cette convention)
      if (step >= 1) return arr[arr.length - 1];       // dernière = couleur
      return null;
    } catch { return null; }
  };

  const isObtained = (el) => {
    const step = parseInt(el.getAttribute("data-step") || "0", 10);
    return step >= 1 || el.classList.contains("obtained");
  };

  // Si tous les costumes sont revenus en NB → on enlève le costume sauvegardé et on remet la base
  const checkAllReset = () => {
    const costumes = gallery.querySelectorAll(".costume-toggle");
    const allReset = Array.from(costumes).every(c => !isObtained(c));
    if (allReset) {
      localStorage.removeItem(COSTUME_KEY);
      refreshIllustration();

      // Remettre toutes les icônes à leur valeur par défaut si ta fonction existe
      if (typeof resetAllIcons === "function") {
        resetAllIcons(gallery);
      }

      console.log("🔄 Tous les costumes sont revenus en NB — retour à la promo courante.");
    }
  };

  // Clic sur un costume
  gallery.addEventListener("click", (e) => {
    const img = e.target.closest(".costume-toggle");
    if (!img) return;

    // Laisse d’abord la logique interne de l’icone faire son cycle si besoin
    setTimeout(() => {
      if (isObtained(img)) {
        const newSrc = getTargetIllustration(img);
        if (newSrc) {
          // On mémorise le costume et on rafraîchit l’affichage
          localStorage.setItem(COSTUME_KEY, newSrc);
          refreshIllustration(); // => affiche le costume immédiatement
        }
      } else {
        // Costume retiré → retour à la base (promo courante)
        localStorage.removeItem(COSTUME_KEY);
        refreshIllustration();
        checkAllReset();
      }
    }, 0);
  });

  // Au chargement : afficher l’état attendu
  refreshIllustration();
});