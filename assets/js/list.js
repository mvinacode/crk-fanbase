  fetch('../includes/header_list.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".grille-cookies");
  const rechercheInput = document.getElementById("recherche");
  const filtreObtenu = document.getElementById("filtre-obtenu");
  const filtreNonObtenu = document.getElementById("filtre-non-obtenu");
  let tousLesCookies = [];

  let rareteActive = "";
  let roleActif = "";
  let elementActif = "";

  fetch("../assets/data/cookies.json")
    .then(response => response.json())
    .then(data => {
      tousLesCookies = data;
      afficherCookies(data);
    });

  function afficherCookies(liste) {
    container.innerHTML = "";

    liste.forEach(cookie => {
      const carte = document.createElement("a");
      carte.href = cookie.lien;
// --- Redirection automatique vers la page éveillée si possédé ---
// 1) Fabrique une clé "fichier" à partir du lien : "xxx/nom.html" -> "nom"
const cookieKeyFromLink = (href) => {
  const file = (href || "").split("/").pop() || "";
  return file.replace(/\.html?$/i, "");
};

// 2) Normalise en deux variantes : tirets et underscores
const toHyphen = (s) => (s || "").toLowerCase().replace(/_/g, "-");
const toUnderscore = (s) => (s || "").toLowerCase().replace(/-/g, "_");

// Clés candidates (depuis le lien ET depuis l'id JSON)
const linkKey = cookieKeyFromLink(cookie.lien);           // ex: "cookie_lys_blanc"
const idKey   = (cookie.id || "");                        // ex: "cookie-lys-blanc"

const candidates = new Set([
  linkKey,
  toHyphen(linkKey),     // "cookie-lys-blanc"
  toUnderscore(linkKey), // "cookie_lys_blanc"
  idKey,
  toHyphen(idKey),
  toUnderscore(idKey),
]);

// 3) Vérifie si une des variantes est marquée "éveil possédé"
let hasAwakened = false;
let canonical = null; // on gardera la version "tirets" comme canon
for (const key of candidates) {
  const val = localStorage.getItem(`cookie-awakened-owned:${key}`);
  if (val === "1") {
    hasAwakened = true;
    canonical = toHyphen(key);
    break;
  }
}

// 4) (Optionnel mais conseillé) migration vers une clé canon "tirets"
if (hasAwakened && canonical) {
  localStorage.setItem(`cookie-awakened-owned:${canonical}`, "1");
}

// 5) Si c’est Lys Blanc ET éveil possédé -> redirige vers la page éveillée
const isLysBlanc = ["cookie-lys-blanc","cookie_lys_blanc"].includes(canonical || toHyphen(linkKey));
const isVanillePure = ["cookie-vanille-pure","cookie_vanille_pure"].includes(canonical || toHyphen(linkKey));
const isBaieHoux = ["cookie-baie-de-houx","cookie_baie_de_houx"].includes(canonical || toHyphen(linkKey));
const isCacaoNoir = ["cookie-cacao-noir","cookie_cacao_noir"].includes(canonical || toHyphen(linkKey));
const isFromageDore = ["cookie-fromage-dore","cookie_fromage_dore"].includes(canonical || toHyphen(linkKey));
if (hasAwakened && isLysBlanc) {
  carte.href = "cookie_lys_blanc_eveil.html";    // list.html est dans /pages/
  carte.dataset.awakened = "true";               // (optionnel: style)
}
if (hasAwakened && isVanillePure) {
  carte.href = "cookie_vanille_pure_eveil.html";    // list.html est dans /pages/
  carte.dataset.awakened = "true";               // (optionnel: style)
}
if (hasAwakened && isBaieHoux) {
  carte.href = "cookie_baie_de_houx_eveil.html";    // list.html est dans /pages/
  carte.dataset.awakened = "true";               // (optionnel: style)
}
if (hasAwakened && isCacaoNoir) {
  carte.href = "cookie_cacao_noir_eveil.html";    // list.html est dans /pages/
  carte.dataset.awakened = "true";               // (optionnel: style)
}
if (hasAwakened && isFromageDore) {
  carte.href = "cookie_fromage_dore_eveil.html";    // list.html est dans /pages/
  carte.dataset.awakened = "true";               // (optionnel: style)
}

      carte.className = "carte-cookie";

      // Opacité si obtenu
      const estObtenu = localStorage.getItem(cookie.id) === "true";
      if (estObtenu) {
        carte.classList.add("obtenu");
      }

      let multiElementsClass = Array.isArray(cookie.element) && cookie.element.length > 1 ? "multi-elements" : "";
      let blocCentreHTML = `<div class="bloc-centre ${multiElementsClass}"><img src="../assets/images/${cookie.role}" alt="Rôle" class="badge-icon">`;

      if (Array.isArray(cookie.element)) {
        cookie.element.forEach(elem => {
          blocCentreHTML += `<img src="../assets/images/${elem}" alt="Élément" class="badge-icon">`;
        });
      } else if (cookie.element && cookie.element !== "") {
        blocCentreHTML += `<img src="../assets/images/${cookie.element}" alt="Élément" class="badge-icon">`;
      }

      blocCentreHTML += `</div>`;

      carte.innerHTML = `
        <div class="bloc-gauche">
          <div class="fond-img">
            <img src="../assets/images/${cookie.image}" alt="${cookie.nom}" class="cookie-head">
          </div>
          <div class="fond-img">
            <img src="../assets/images/${cookie.rarete}" alt="rarete" class="badge-epique">
          </div>
        </div>
        ${blocCentreHTML}
        <div class="bloc-droite">
          <h3 class="nom-cookie">${cookie.nom}</h3>
        </div>
        <div class="bloc-obtenu">
          <button class="btn-obtenu" data-cookie-id="${cookie.id}" aria-label="Cookie obtenu">
            <svg class="checkmark-svg" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" fill="none" stroke="#FFF0DC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;

// --- Changement d'image si Lys Blanc éveillé ---
if (cookie.id === "cookie-lys-blanc") {
  const awakenKey1 = localStorage.getItem('cookie-awakened-owned:cookie-lys-blanc') === "1";
  const awakenKey2 = localStorage.getItem('cookie-awakened-owned:cookie_lys_blanc') === "1";
  const isAwakened = awakenKey1 || awakenKey2;

  if (isAwakened) {
    const headImg = carte.querySelector(".cookie-head");
    if (headImg) {
      headImg.src = "../assets/images/cookies/cookie_lys_blanc/cookie_lys_blanc_eveil_tete.webp";
    }
  }
}

// --- Changement d'image si Vanille Pure éveillé ---
if (cookie.id === "cookie-vanille-pure") {
  const awakenKey1 = localStorage.getItem('cookie-awakened-owned:cookie-vanille-pure') === "1";
  const awakenKey2 = localStorage.getItem('cookie-awakened-owned:cookie_vanille_pure') === "1";
  const isAwakened = awakenKey1 || awakenKey2;

  if (isAwakened) {
    const headImg = carte.querySelector(".cookie-head");
    if (headImg) {
      headImg.src = "../assets/images/cookies/cookie_vanille_pure/cookie_vanille_pure_eveil_tete.webp";
    }
  }
}

// --- Changement d'image si Baie de Houx éveillé ---
if (cookie.id === "cookie-baie-de-houx") {
  const awakenKey1 = localStorage.getItem('cookie-awakened-owned:cookie-baie-de-houx') === "1";
  const awakenKey2 = localStorage.getItem('cookie-awakened-owned:cookie_baie_de_houx') === "1";
  const isAwakened = awakenKey1 || awakenKey2;

  if (isAwakened) {
    const headImg = carte.querySelector(".cookie-head");
    if (headImg) {
      headImg.src = "../assets/images/cookies/cookie_baie_de_houx/cookie_baie_de_houx_eveil_tete.webp";
    }
  }
}

// --- Changement d'image si Cacao Noir éveillé ---
if (cookie.id === "cookie-cacao-noir") {
  const awakenKey1 = localStorage.getItem('cookie-awakened-owned:cookie-cacao-noir') === "1";
  const awakenKey2 = localStorage.getItem('cookie-awakened-owned:cookie_cacao_noir') === "1";
  const isAwakened = awakenKey1 || awakenKey2;

  if (isAwakened) {
    const headImg = carte.querySelector(".cookie-head");
    if (headImg) {
      headImg.src = "../assets/images/cookies/cookie_cacao_noir/cookie_cacao_noir_eveil_tete.webp";
    }
  }
}

// --- Changement d'image si Fromage Doré éveillé ---
if (cookie.id === "cookie-fromage-dore") {
  const awakenKey1 = localStorage.getItem('cookie-awakened-owned:cookie-fromage-dore') === "1";
  const awakenKey2 = localStorage.getItem('cookie-awakened-owned:cookie_fromage_dore') === "1";
  const isAwakened = awakenKey1 || awakenKey2;

  if (isAwakened) {
    const headImg = carte.querySelector(".cookie-head");
    if (headImg) {
      headImg.src = "../assets/images/cookies/cookie_fromage_dore/cookie_fromage_dore_eveil_tete.webp";
    }
  }
}

      container.appendChild(carte);
    });

    activerBoutonsObtenu();
  }

  function appliquerFiltres() {
    let resultats = tousLesCookies;

    const recherche = rechercheInput.value.toLowerCase();
    resultats = resultats.filter(cookie => cookie.nom.toLowerCase().includes(recherche));

    if (rareteActive !== "") {
      resultats = resultats.filter(cookie => cookie.rarete.includes(rareteActive));
    }

    if (roleActif !== "") {
      resultats = resultats.filter(cookie => cookie.role.includes(roleActif));
    }

    if (elementActif !== "") {
      resultats = resultats.filter(cookie => {
        if (Array.isArray(cookie.element)) {
          return cookie.element.some(e => e.includes(elementActif));
        } else {
          return cookie.element.includes(elementActif);
        }
      });
    }

    resultats = resultats.filter(cookie => {
      const estObtenu = localStorage.getItem(cookie.id) === "true";
      if (filtreObtenu.checked && !filtreNonObtenu.checked) return estObtenu;
      if (!filtreObtenu.checked && filtreNonObtenu.checked) return !estObtenu;
      return true;
    });

    afficherCookies(resultats);
  }

  rechercheInput.addEventListener("input", appliquerFiltres);
  filtreObtenu.addEventListener("change", appliquerFiltres);
  filtreNonObtenu.addEventListener("change", appliquerFiltres);

  function activerBoutonsObtenu() {
    const boutons = document.querySelectorAll(".btn-obtenu");
    boutons.forEach(bouton => {
      const id = bouton.dataset.cookieId;
      const carte = bouton.closest(".carte-cookie");

      if (localStorage.getItem(id) === "true") {
        bouton.classList.add("obtenu");
        carte.classList.add("obtenu");
      }

      bouton.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        bouton.classList.toggle("obtenu");

        const estObtenu = bouton.classList.contains("obtenu");
        localStorage.setItem(id, estObtenu);
        if (estObtenu) {
          carte.classList.add("obtenu");
        } else {
          carte.classList.remove("obtenu");
        }

        appliquerFiltres();
      });
    });
  }

  // Rarete
  window.toggleRareteOptions = function () {
    const options = document.getElementById("rareteOptions");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
  };

  document.querySelectorAll("#rareteOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      rareteActive = rareteActive === valeur ? "" : valeur;
      document.getElementById("rareteOptions").style.display = "none";
      appliquerFiltres();
    });
  });

  // Rôle
  window.toggleRoleOptions = function () {
    const options = document.getElementById("roleOptions");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
  };

  document.querySelectorAll("#roleOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      roleActif = roleActif === valeur ? "" : valeur;
      document.getElementById("roleOptions").style.display = "none";
      appliquerFiltres();
    });
  });

  // Élément
  window.toggleElementOptions = function () {
    const options = document.getElementById("elementOptions");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
  };

  document.querySelectorAll("#elementOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      elementActif = elementActif === valeur ? "" : valeur;
      document.getElementById("elementOptions").style.display = "none";
      appliquerFiltres();
    });
  });
});

// Animation de bouton pressé avec délai avant navigation
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Si c'est un lien (pas juste un bouton)
    if (this.tagName === 'A' && this.href) {
      e.preventDefault(); // Empêcher la navigation immédiate
      const href = this.href;
      
      // Laisser le temps à l'animation de se jouer (150ms de descente)
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    }
  });
});
