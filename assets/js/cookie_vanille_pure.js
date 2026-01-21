fetch('../includes/header_cookie.html')
  .then(r => r.text())
  .then(html => { document.getElementById('header-placeholder').innerHTML = html; });

// Fenêtre costume
const btnCostume = document.querySelector('.btn-costume');
const popupCostume = document.getElementById('popup-costume');
const closePopup = document.getElementById('close-popup');

btnCostume.addEventListener('click', () => { popupCostume.style.display = 'flex'; });
closePopup.addEventListener('click', () => { popupCostume.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === popupCostume) popupCostume.style.display = 'none'; });

// ---- 🔧 Helpers d'icônes
function updateCostumeIconFor(imgEl) {
  const costumeItem = imgEl.closest('.costume-item');
  if (!costumeItem) return;
  const iconImg = costumeItem.querySelector('.costume-icon img');
  if (!iconImg) return;

  // on mémorise l’icône par défaut au premier passage
  if (!iconImg.dataset.defaultIcon) {
    iconImg.dataset.defaultIcon = iconImg.src;
  }

  const step = parseInt(imgEl.dataset.step || '0', 10);
  // step === 2 => mythique, sinon on remet l'icône par défaut (ex: légendaire)
  if (step === 2) {
    iconImg.src = "../assets/images/rarete/mythique_costume.webp";
  } else {
    iconImg.src = iconImg.dataset.defaultIcon;
  }
}

function resetAllIcons(galleryRoot) {
  galleryRoot.querySelectorAll('.costume-item .costume-icon img').forEach(icon => {
    if (icon.dataset.defaultIcon) icon.src = icon.dataset.defaultIcon;
  });
}

// Nouvelle version : utilise data-id pour la sauvegarde
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

  // 🔧 Au chargement : synchroniser l’icône avec le step restauré
  updateCostumeIconFor(img);

  // Gérer les clics
  img.addEventListener('click', () => {
    let currentStep = parseInt(img.dataset.step);
    currentStep = (currentStep + 1) % images.length;
    img.src = images[currentStep];
    img.dataset.step = currentStep;

    localStorage.setItem(`etat-${id}`, currentStep);

    // 🔧 Mettre à jour l’icône (mythique / défaut)
    updateCostumeIconFor(img);
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

  // --- 1) Clé unique pour ce cookie ---
  const cookieIdAttr = document.querySelector(".page-cookie")?.getAttribute("data-cookie-id");
  const nameKey =
    (document.querySelector(".nom-cookie")?.textContent || location.pathname.split("/").pop() || "cookie")
      .trim().toLowerCase().replace(/\s+/g, "-");
  const pageKey = cookieIdAttr || nameKey;
  const LS_KEY = `cookie-illustration:${pageKey}`;

  // --- helpers ---
  const getColorSrc = (el) => {
    try {
      const arr = JSON.parse(el.getAttribute("data-images") || "[]");
      return arr.length ? arr[arr.length - 1] : null;
    } catch { return null; }
  };

  // gère aussi l'état OR (step >= 2)
  const getTargetIllustration = (el) => {
    const step = parseInt(el.getAttribute("data-step") || "0", 10);
    if (step >= 2 && el.hasAttribute("data-illustration-replace-or")) {
      return el.getAttribute("data-illustration-replace-or");
    }
    if (step >= 1 && el.hasAttribute("data-illustration-replace")) {
      return el.getAttribute("data-illustration-replace");
    }
    try {
      const arr = JSON.parse(el.getAttribute("data-images") || "[]");
      if (arr.length === 0) return null;
      if (step >= 2 && arr.length >= 3) return arr[2]; // 3e image = OR
      if (step >= 1) return arr[arr.length - 1];       // dernière = couleur
      return null;
    } catch { return null; }
  };

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

  // Restaurer au chargement
  const saved = localStorage.getItem(LS_KEY);
  if (saved) mainIllustration.src = saved;

  // Vérifie si tous les costumes sont revenus en NB
  const checkAllReset = () => {
    const costumes = gallery.querySelectorAll(".costume-toggle");
    const allReset = Array.from(costumes).every(c => !isObtained(c));
    if (allReset) {
      mainIllustration.src = originalSrc;
      localStorage.removeItem(LS_KEY);

      // 🔧 remettre toutes les icônes à leur valeur par défaut
      resetAllIcons(gallery);

      console.log("🔄 Tous les costumes sont revenus en NB — illustration d'origine et icônes restaurées.");
    }
  };

  // Gère le clic sur un costume
  gallery.addEventListener("click", (e) => {
    const img = e.target.closest(".costume-toggle");
    if (!img) return;

    setTimeout(() => {
      if (isObtained(img)) {
        const newSrc = getTargetIllustration(img);
        applyIllustration(newSrc);
      } else {
        checkAllReset();
      }
    }, 0);
  });
});

// === Déverrouillage Éveil par bouton-image (NB -> Couleur) ===
(function () {
  const pageEl  = document.querySelector('.page-cookie');
  const toggleEl = document.getElementById('awaken-toggle');
  const openBtn  = document.getElementById('btn-open-awakened');
  if (!pageEl || !toggleEl || !openBtn) return;

  // Clés par cookie
  const cookieKey = pageEl.getAttribute('data-cookie-id') || 'cookie_vanille_pure';
  const OWN_KEY   = `cookie-awakened-owned:${cookieKey}`; // "1" si éveil obtenu
  const STEP_KEY  = `etat-awaken-toggle:${cookieKey}`;    // 0=NB, 1=Couleur (icône)

  // Helpers step/images
  const getImages = (el) => {
    try { return JSON.parse(el.getAttribute('data-images') || '[]'); }
    catch { return []; }
  };
  const setStep = (el, step) => {
    const imgs = getImages(el);
    const s = Math.max(0, Math.min(step, imgs.length - 1));
    el.setAttribute('data-step', String(s));
    if (imgs[s]) el.src = imgs[s];
  };
  const getStep = (el) => parseInt(el.getAttribute('data-step') || '0', 10) || 0;

  // Applique l'UI selon possession de l'éveil
  const applyUIFromOwned = (isOwned) => {
    if (isOwned) {
      openBtn.hidden = false;
      openBtn.removeAttribute('aria-disabled');
      toggleEl.classList.add('active-glow');   // glow ON
      setStep(toggleEl, 1); // Couleur
    } else {
      openBtn.hidden = true;
      openBtn.setAttribute('aria-disabled', 'true');
      toggleEl.classList.remove('active-glow'); // glow OFF
      setStep(toggleEl, 0); // NB
    }
  };

  // Restauration initiale
  (function init() {
    const owned = localStorage.getItem(OWN_KEY) === '1';
    const savedStep = localStorage.getItem(STEP_KEY);
    if (savedStep !== null) setStep(toggleEl, parseInt(savedStep, 10));
    applyUIFromOwned(owned);
  })();

  // Clic sur l'icône : NB <-> Couleur
  toggleEl.addEventListener('click', () => {
    // effet pop (inchangé)
    toggleEl.classList.remove('pop');
    void toggleEl.offsetWidth;
    toggleEl.classList.add('pop');

    const next = getStep(toggleEl) === 0 ? 1 : 0;
    setStep(toggleEl, next);
    localStorage.setItem(STEP_KEY, String(next));

    if (next === 1) {
      // ✅ Activation : on marque l’éveil
      localStorage.setItem(OWN_KEY, '1');
      // on peut aussi poser la variante “tirets” pour standardiser
      const hyphenKey = `cookie-awakened-owned:${cookieKey.replace(/_/g, '-')}`;
      localStorage.setItem(hyphenKey, '1');

      applyUIFromOwned(true);
    } else {
      // 🔴 Désactivation : on nettoie TOUTES les variantes pour que la liste ne redirige plus
      const hyphenKey    = `cookie-awakened-owned:${cookieKey.replace(/_/g, '-')}`;
      const underscoreKey= `cookie-awakened-owned:${cookieKey.replace(/-/g, '_')}`;

      localStorage.removeItem(OWN_KEY);
      localStorage.removeItem(hyphenKey);
      localStorage.removeItem(underscoreKey);
      localStorage.removeItem(STEP_KEY);      // optionnel : remet l’icône NB par défaut

      applyUIFromOwned(false);
    }
  });
})();