import { supabase } from './app.js';

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".grille-cookies");
  const rechercheInput = document.getElementById("recherche");
  const filtreObtenu = document.getElementById("filtre-obtenu");
  const filtreNonObtenu = document.getElementById("filtre-non-obtenu");
  let tousLesCookies = [];
  let cookiesFiltres = [];
  let cookiesAffiches = 0;
  const COOKIES_PAR_PAGE = 20;

  let rareteActive = "";
  let roleActif = "";
  let elementActif = "";

  async function loadAllCookies() {
    try {
      // 1. Charger le JSON local
      const response = await fetch("../assets/data/cookies.json");
      const localCookies = await response.json();

      // 2. Charger les cookies de Supabase
      const { data: dbCookies, error } = await supabase
        .from('cookies')
        .select('*');

      if (error) {
        console.error("Erreur Supabase:", error);
      }

      // 3. Fusionner et formater les données Supabase
      const formattedDbCookies = (dbCookies || []).map(db => {
        // Si le cookie existe déjà dans le JSON (même ID), on peut choisir de le privilégier ou non.
        // Ici on ajoute seulement ceux qui ne sont pas dans le JSON ou on fusionne.
        return {
          id: db.id,
          nom: db.nom,
          image: db.icon_tete || db.tete || "", // Mapping vers image
          rarete: db.rarete || "",
          role: db.classe || "", // Mapping vers role
          element: db.element || "",
          lien: `cookie_detail.html?id=${db.id}`,
          isFromDb: true
        };
      });

      // Fusion intelligente : on remplace les locaux par les DB si l'ID ou le NOM correspond
      const merged = [...localCookies];
      formattedDbCookies.forEach(dbCookie => {
        const cleanName = (n) => (n || "").trim().toLowerCase();
        let index = merged.findIndex(c => c.id === dbCookie.id);
        if (index === -1) {
          index = merged.findIndex(c => cleanName(c.nom) === cleanName(dbCookie.nom));
        }

        if (index !== -1) {
          // Fusionner : on garde les données Supabase en priorité mais on ne s'écrase pas avec du vide
          const dbData = { ...dbCookie };

          // Nettoyage des champs vides pour ne pas écraser les données locales valides
          if (!dbData.image) delete dbData.image;
          if (!dbData.rarete) delete dbData.rarete;
          if (!dbData.role) delete dbData.role;
          if (!dbData.element) delete dbData.element;

          merged[index] = { ...merged[index], ...dbData };
        } else {
          merged.push(dbCookie);
        }
      });

      tousLesCookies = merged;
      afficherCookies(merged);
    } catch (err) {
      console.error("Erreur lors du chargement des cookies:", err);
    }
  }

  // --- Synchronization Supabase (NEW) ---
  async function syncOwnershipFromSupabase() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: myCookies, error } = await supabase
      .from('cookies_users')
      .select('cookie_id')
      .eq('user_id', session.user.id);

    if (myCookies) {
      myCookies.forEach(row => {
        if (row.cookie_id) {
          localStorage.setItem(row.cookie_id, "true");
        }
      });
      // Re-apply visual state
      document.querySelectorAll(".btn-obtenu").forEach(btn => {
        if (localStorage.getItem(btn.dataset.cookieId) === "true") {
          btn.classList.add("obtenu");
          btn.closest(".carte-cookie")?.classList.add("obtenu");
        }
      });
    }
  }

  loadAllCookies().then(() => {
    syncOwnershipFromSupabase();
  });

  function afficherCookies(liste) {
    cookiesFiltres = liste;

    // Sauvegarder les IDs des cartes déjà visibles
    const cartesVisibles = new Set();
    document.querySelectorAll(".carte-cookie.visible").forEach(carte => {
      const id = carte.querySelector(".btn-obtenu")?.dataset.cookieId;
      if (id) cartesVisibles.add(id);
    });

    cookiesAffiches = 0;
    container.innerHTML = "";
    container.dataset.cartesVisibles = JSON.stringify(Array.from(cartesVisibles));

    // Créer un élément sentinelle pour détecter le scroll
    let sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.id = "scroll-sentinel";
      sentinel.style.height = "1px";
      container.parentElement.appendChild(sentinel);

      // Observer la sentinelle pour charger automatiquement
      const sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && cookiesAffiches < cookiesFiltres.length) {
            chargerPlusCookies();
          }
        });
      }, {
        rootMargin: "200px"
      });

      sentinelObserver.observe(sentinel);
    }

    chargerPlusCookies();
  }

  function chargerPlusCookies() {
    const debut = cookiesAffiches;
    const fin = Math.min(debut + COOKIES_PAR_PAGE, cookiesFiltres.length);
    const nouveauxCookies = cookiesFiltres.slice(debut, fin);

    nouveauxCookies.forEach((cookie, index) => {
      const carte = document.createElement("a");
      // Par défaut, lien dynamique vers la page détail avec l'id
      carte.href = `cookie_detail.html?id=${encodeURIComponent(cookie.id)}`;
      // --- Redirection automatique vers la page éveillée si possédé ---
      // (on garde la logique existante, mais la valeur par défaut du href est maintenant cookie_detail.html?id=...)
      const cookieKeyFromLink = (href) => {
        const file = (href || "").split("/").pop() || "";
        return file.replace(/\.html?$/i, "");
      };

      const toHyphen = (s) => (s || "").toLowerCase().replace(/_/g, "-");
      const toUnderscore = (s) => (s || "").toLowerCase().replace(/-/g, "_");

      const linkKey = cookieKeyFromLink(cookie.lien);
      const idKey = (cookie.id || "");
      const candidates = new Set([
        linkKey,
        toHyphen(linkKey),
        toUnderscore(linkKey),
        idKey,
        toHyphen(idKey),
        toUnderscore(idKey),
      ]);

      let hasAwakened = false;
      let canonical = null;
      for (const key of candidates) {
        const val = localStorage.getItem(`cookie-awakened-owned:${key}`);
        if (val === "1") {
          hasAwakened = true;
          canonical = toHyphen(key);
          break;
        }
      }

      if (hasAwakened && canonical) {
        localStorage.setItem(`cookie-awakened-owned:${canonical}`, "1");
      }

      const isLysBlanc = ["cookie-lys-blanc", "cookie_lys_blanc"].includes(canonical || toHyphen(linkKey));
      const isVanillePure = ["cookie-vanille-pure", "cookie_vanille_pure"].includes(canonical || toHyphen(linkKey));
      const isBaieHoux = ["cookie-baie-de-houx", "cookie_baie_de_houx"].includes(canonical || toHyphen(linkKey));
      const isCacaoNoir = ["cookie-cacao-noir", "cookie_cacao_noir"].includes(canonical || toHyphen(linkKey));
      const isFromageDore = ["cookie-fromage-dore", "cookie_fromage_dore"].includes(canonical || toHyphen(linkKey));
      if (hasAwakened && isLysBlanc) {
        carte.href = "cookie_lys_blanc_eveil.html";
        carte.dataset.awakened = "true";
      }
      if (hasAwakened && isVanillePure) {
        carte.href = "cookie_vanille_pure_eveil.html";
        carte.dataset.awakened = "true";
      }
      if (hasAwakened && isBaieHoux) {
        carte.href = "cookie_baie_de_houx_eveil.html";
        carte.dataset.awakened = "true";
      }
      if (hasAwakened && isCacaoNoir) {
        carte.href = "cookie_cacao_noir_eveil.html";
        carte.dataset.awakened = "true";
      }
      if (hasAwakened && isFromageDore) {
        carte.href = "cookie_fromage_dore_eveil.html";
        carte.dataset.awakened = "true";
      }

      // Vérifier l'état obtenu dès le début
      const estObtenu = localStorage.getItem(cookie.id) === "true";

      carte.className = "carte-cookie carte-cookie-glossy";
      if (estObtenu) {
        carte.className += " obtenu";
      }

      // Vérifier si cette carte était déjà visible pour ne pas rejouer l'animation
      const cartesVisibles = JSON.parse(container.dataset.cartesVisibles || "[]");
      if (cartesVisibles.includes(cookie.id)) {
        carte.classList.add("visible");
      }

      // Aide pour les chemins d'images (gère les URLs absolues Cloudinary)
      const getImgSrc = (path) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        return `../assets/images/${path}`;
      };

      let elements = [];
      if (Array.isArray(cookie.element)) {
        elements = cookie.element;
      } else if (typeof cookie.element === 'string') {
        if (cookie.element.trim().startsWith('[')) {
          try {
            elements = JSON.parse(cookie.element);
          } catch (e) {
            elements = [cookie.element];
          }
        } else if (cookie.element.trim() !== "") {
          elements = [cookie.element];
        }
      }

      let multiElementsClass = elements.length > 1 ? "multi-elements" : "";
      let blocCentreHTML = `<div class="bloc-centre ${multiElementsClass}"><img src="${getImgSrc(cookie.role)}" alt="Rôle" class="badge-icon">`;

      elements.forEach(elem => {
        blocCentreHTML += `<img src="${getImgSrc(elem)}" alt="Élément" class="badge-icon">`;
      });

      blocCentreHTML += `</div>`;

      carte.innerHTML = `
        <div class="bloc-gauche">
          <div class="fond-img">
            <img src="${getImgSrc(cookie.image)}" alt="${cookie.nom}" class="cookie-head">
          </div>
          <div class="fond-img">
            <img src="${getImgSrc(cookie.rarete)}" alt="rarete" class="badge-epique">
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

    cookiesAffiches = fin;

    activerBoutonsObtenu();

    // Observer pour l'animation au scroll
    observerCartes();
  }

  function observerCartes() {
    const cartes = document.querySelectorAll(".carte-cookie:not(.visible)");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Ajouter un petit délai pour un effet plus fluide
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    cartes.forEach(carte => {
      observer.observe(carte);
    });
  }

  function appliquerFiltres() {
    let resultats = tousLesCookies;

    const recherche = rechercheInput.value.toLowerCase();
    resultats = resultats.filter(cookie => cookie.nom.toLowerCase().includes(recherche));

    if (rareteActive !== "") {
      const keyword = rareteActive.replace('.webp', '').toLowerCase();
      resultats = resultats.filter(cookie => {
        const rareteUrl = (cookie.rarete || "").toLowerCase();
        // Gestion de l'overlap "epique" vs "super_epique"
        if (keyword === 'epique' && rareteUrl.includes('super_epique')) {
          return false;
        }
        return rareteUrl.includes(keyword);
      });
    }

    if (roleActif !== "") {
      resultats = resultats.filter(cookie => {
        const role = (cookie.role || "").toLowerCase();
        const roleFilter = roleActif.toLowerCase().replace(".webp", "");
        return role.includes(roleFilter);
      });
    }

    if (elementActif !== "") {
      resultats = resultats.filter(cookie => {
        const elementFilter = elementActif.toLowerCase().replace(".webp", "");
        const elements = Array.isArray(cookie.element) ? cookie.element : [cookie.element || ""];
        return elements.some(e => (e || "").toLowerCase().includes(elementFilter));
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
    const boutons = document.querySelectorAll(".btn-obtenu:not([data-initialized])");
    boutons.forEach(bouton => {
      const id = bouton.dataset.cookieId;
      const carte = bouton.closest(".carte-cookie");

      // Marquer comme initialisé pour éviter les doublons
      bouton.dataset.initialized = "true";

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

        // Ne recharger que si les filtres obtenu/non-obtenu sont actifs
        if (filtreObtenu.checked || filtreNonObtenu.checked) {
          appliquerFiltres();
        }

        // Sync with Supabase (Smart Delete)
        (async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            if (estObtenu) {
              await supabase.from('cookies_users').upsert({ user_id: session.user.id, cookie_id: id }, { onConflict: 'user_id, cookie_id' });
            } else {
              // Smart Delete: Check if row has valuable data before deleting
              const { data: existingRow, error } = await supabase
                .from('cookies_users')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('cookie_id', id)
                .maybeSingle();

              if (existingRow) {
                // Check for any non-metadata columns that have values
                const metadataCols = ['id', 'user_id', 'cookie_id', 'created_at', 'updated_at'];
                const hasValuableData = Object.keys(existingRow).some(key =>
                  !metadataCols.includes(key) && existingRow[key] !== null && existingRow[key] !== ''
                );

                if (!hasValuableData) {
                  console.log("Suppression de la ligne (aucune donnée importante trouvée)");
                  await supabase.from('cookies_users').delete().eq('user_id', session.user.id).eq('cookie_id', id);
                } else {
                  console.log("Conservation de la ligne (données importantes détectées : costumes, builds, etc.)");
                }
              } else {
                // Row doesn't exist, nothing to delete
              }
            }
          }
        })();
      });
    });
  }

  // Rarete
  window.toggleRareteOptions = function () {
    const options = document.getElementById("rareteOptions");
    const isVisible = options.classList.contains("show");

    if (isVisible) {
      options.classList.remove("show");
    } else {
      // Ajouter la classe après un court délai pour déclencher l'animation
      setTimeout(() => {
        options.classList.add("show");
      }, 10);
    }
  };

  document.querySelectorAll("#rareteOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      rareteActive = rareteActive === valeur ? "" : valeur;

      // Retirer la classe active de tous les éléments
      document.querySelectorAll("#rareteOptions li").forEach(li => li.classList.remove("active"));

      // Ajouter la classe active à l'élément cliqué (sauf si on désélectionne)
      if (rareteActive) {
        option.classList.add("active");
      }

      document.getElementById("rareteOptions").classList.remove("show");
      appliquerFiltres();
    });
  });

  // Rôle
  window.toggleRoleOptions = function () {
    const options = document.getElementById("roleOptions");
    const isVisible = options.classList.contains("show");

    if (isVisible) {
      options.classList.remove("show");
    } else {
      // Ajouter la classe après un court délai pour déclencher l'animation
      setTimeout(() => {
        options.classList.add("show");
      }, 10);
    }
  };

  document.querySelectorAll("#roleOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      roleActif = roleActif === valeur ? "" : valeur;

      // Retirer la classe active de tous les éléments
      document.querySelectorAll("#roleOptions li").forEach(li => li.classList.remove("active"));

      // Ajouter la classe active à l'élément cliqué (sauf si on désélectionne)
      if (roleActif) {
        option.classList.add("active");
      }

      document.getElementById("roleOptions").classList.remove("show");
      appliquerFiltres();
    });
  });

  // Élément
  window.toggleElementOptions = function () {
    const options = document.getElementById("elementOptions");
    const isVisible = options.classList.contains("show");

    if (isVisible) {
      options.classList.remove("show");
    } else {
      // Ajouter la classe après un court délai pour déclencher l'animation
      setTimeout(() => {
        options.classList.add("show");
      }, 10);
    }
  };

  document.querySelectorAll("#elementOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      elementActif = elementActif === valeur ? "" : valeur;

      // Retirer la classe active de tous les éléments
      document.querySelectorAll("#elementOptions li").forEach(li => li.classList.remove("active"));

      // Ajouter la classe active à l'élément cliqué (sauf si on désélectionne)
      if (elementActif) {
        option.classList.add("active");
      }

      document.getElementById("elementOptions").classList.remove("show");
      appliquerFiltres();
    });
  });

  // --- Chargement du Header ---
  function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      fetch('../includes/header_list.html')
        .then(response => {
          if (!response.ok) throw new Error("Header not found");
          return response.text();
        })
        .then(data => {
          headerPlaceholder.innerHTML = data;
          document.dispatchEvent(new CustomEvent('headerLoaded'));
        })
        .catch(err => console.error("Erreur chargement header:", err));
    }
  }

  loadHeader();
});

// Animation de bouton pressé avec délai avant navigation
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', function (e) {
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
