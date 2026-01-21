
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

// Nouvelle version : utilise data-id pour la sauvegarde
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

// Bouton de sauvegarde (effet visuel uniquement)
document.getElementById('btn-save').addEventListener('click', () => {
  alert('Modifications sauvegardées 🍪');
});

const eveilElements = document.querySelectorAll('.eveil-cycle');
const mainIllustration = document.getElementById('main-cookie-img');

// Charger illustration principale sauvegardée
const savedIllustration = localStorage.getItem('cacao-noir-eveil-illustration');
if (savedIllustration) {
  mainIllustration.src = savedIllustration;
}

// Charger le step de l'éveil si sauvegardé
eveilElements.forEach(img => {
  const images = JSON.parse(img.dataset.images);
  const id = img.dataset.id;

  const savedStep = localStorage.getItem(`etat-${id}`);
  if (savedStep !== null) {
    img.dataset.step = savedStep;
    img.src = images[savedStep];
  }

  img.addEventListener('click', () => {
    let currentStep = parseInt(img.dataset.step);
    currentStep = (currentStep + 1) % images.length;
    img.src = images[currentStep];
    img.dataset.step = currentStep;

    // Sauvegarder l'état actuel
    localStorage.setItem(`etat-${id}`, currentStep);

    // Mise à jour de l'illustration principale selon l'étape
    if (currentStep === 2) {
      mainIllustration.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_2_stars.webp";
    } else if (currentStep === 3) {
      mainIllustration.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_2_stars.webp";
    } else if (currentStep === 4) {
      mainIllustration.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_4_stars.webp";
    } else if (currentStep === 5) {
      mainIllustration.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_4_stars.webp";
    } else if (currentStep === 6) {
      mainIllustration.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_6_stars.webp";
    } else {
      mainIllustration.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_base.webp";
    }
    // Sauvegarde de l'illustration actuelle
    localStorage.setItem('cacao-noir-eveil-illustration', mainIllustration.src);
  });
});

