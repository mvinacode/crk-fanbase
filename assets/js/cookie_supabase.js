// Affichage dynamique du user (connexion/déconnexion) sur la page d'accueil
function initUserInfo() {
  const userInfo = document.getElementById('user-info');
  if (!userInfo) return;

  import('./login_supabase.js').then(({ isLoggedIn, logout }) => {
    import('./app.js').then(({ supabase }) => {
      async function showUser() {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          userInfo.innerHTML = `<button id="logout-btn" class="btn btn-login"><span>Déconnexion</span></button>`;
          const logoutBtn = document.getElementById('logout-btn');
          if (logoutBtn) {
            logoutBtn.onclick = async () => {
              await logout();
              window.location.reload();
            };
          }
        } else {
          userInfo.innerHTML = `<a href="pages/login.html" class="btn btn-login"><span>Se connecter</span></a>`;
        }
      }
      showUser();
    });
  });
}

// Initialiser si l'élément existe déjà, sinon attendre l'événement
if (document.getElementById('user-info')) {
  initUserInfo();
} else {
  document.addEventListener('headerLoaded', initUserInfo);
}
import { supabase } from './app.js';

// Charger dynamiquement le CSS cookie_dynamic.css dès le début
loadCookieDynamicCSS();

// --- GESTION DU HEADER (UNIFIÉ) ---
const pageCookie = document.getElementById('page-cookie');
const headerPlaceholder = document.getElementById('header-placeholder');

if (headerPlaceholder) {
  const headerPath = pageCookie ? '../includes/header_cookie.html' : 'includes/header_index.html';
  fetch(headerPath)
    .then(response => response.text())
    .then(data => {
      headerPlaceholder.innerHTML = data;
      // Dispatch d'un événement pour prévenir les autres scripts que le header est prêt
      document.dispatchEvent(new CustomEvent('headerLoaded'));
    });
}

// Récupérer l'ID du cookie depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
// Utilise l'UUID fourni par défaut si aucun paramètre dans l'URL
let cookieId = urlParams.get('id') || 'fa4da28e-bff9-441e-b466-a6464c1d266a';
// Nettoyer l'ID : enlever les chevrons < > s'ils sont présents
cookieId = cookieId.trim().replace(/^<|>$/g, '').trim();

const cookieMap = {
  'cookie-temeraire': 'fa4da28e-bff9-441e-b466-a6464c1d266a',
  'cookie-fraise': '9a419714-296e-449f-815c-1842448d7234',
  'cookie-sorcier': 'b01c71b1-19b0-46ff-894f-f22d3008f585',
  'cookie-ninja': '6f0371f8-a990-46f5-83b5-fcb476744825',
  'cookie-ange': 'fbe1a5be-bfac-44af-b1a1-10446abf35b0',
  'cookie-costaud': '5b3df6bd-fb10-4538-9e2f-b6d85c5d8eb7',
  'cookie-aventurier': 'c94ab484-756e-40dd-9451-da840179f983',
  'cookie-alchimiste': 'e2dfc10a-4f2a-4ce8-9c5d-6bb18e0ff5ca',
  'cookie-avocat': '8f0007c7-0641-455e-b184-3d41569e85d5',
  'cookie-betterave': '09dfe6bb-6a87-4984-8afb-96b94444c08d',
  'cookie-mure': '806edfc7-e9c6-4f31-9797-2e9455f6544e',
  'cookie-carotte': '9d9bd274-c85b-4b4e-b6dc-9b5115b87471',
  'cookie-cerise': '638e6269-caad-4d3b-ab53-c0ea87e4034a',
  'cookie-piment': 'ac08d696-014e-4ad7-9510-e5ac5a47d7ea',
  'cookie-trefle': '33d1bacf-7921-4f3d-a95c-5f44cc92de90',
  'cookie-creme-patissiere-iii': 'dd1be758-122d-4597-86e7-bb4b2b61718c',
  'cookie-chevalier': '886acc5d-30e5-4b38-9488-28b3349faddc',
  'cookie-oignon': 'bda640ab-89be-447c-8210-16616fa9de53',
  'cookie-pancake': 'a8f85028-e661-4378-a193-e3a951b66d05',
  'cookie-princesse': '5ab8cd4a-61c0-498a-8f17-9f6d63577cbe',
  'cookie-boule-de-gomme': '86e05b59-a249-4218-bac6-d3fe3fc733a6',
  'cookie-jardinier': 'b9c41288-16d4-42ef-a887-a53639ca572c',
  'cookie-choco-noir': '2334ec6a-3e4c-497a-93bf-ddf3ee70bb8c',
  'cookie-espresso': '67175204-d395-48f9-b909-a77e426af7cc',
  'cookie-reglisse': '4e2b26fd-01c4-489e-bb1a-7c9c78cf1dcc',
  'cookie-madeleine': '84f24310-256d-4e4f-addc-ae201bedacc9',
  'cookie-lait': 'db8de6ac-1857-409a-af44-cb19fd2d6277',
  'cookie-choco-menthe': 'd3ba8976-3225-4b7a-b448-2acf77d44f28',
  'cookie-champignon-veneneux': '208193a2-2738-407f-a369-0e9d33abdbac',
  'cookie-grenade': '8ee2d6c0-3850-4583-a3ca-472a5734bd73',
  'cookie-patate-douce': 'a709bc50-4e3d-4b31-86db-8ab021e8801c',
  'cookie-seigle': '2a64cf1b-013e-4d83-b3f2-4db3c9c43375',
  'cookie-sucre-glace': '18f2de53-0fed-42c9-86ef-c5e19f0b3f0a',
  'cookie-petillant': '93db6fb5-267a-43be-a9ee-d219157ff816',
  'cookie-lys-tigre': '38ce4017-fb02-429e-93b0-3402678dacfc',
  'cookie-vampire': 'd118c11e-6048-420e-9174-5f9fc2c780e5',
  'cookie-loup-garou': 'd5fbf15b-d256-4f89-845c-28cba230090a',
  'cookie-kumiho': '61abe8df-ca00-4e39-9f40-907b1817174e',
  'cookie-latte': '056e7c48-9653-4905-8578-4ebc43ec2a28',
  'cookie-chouquette': 'a8cc42f1-8c98-43ee-9851-76208bc71e00'
};

if (cookieMap[cookieId]) {
  cookieId = cookieMap[cookieId];
}

// Fonction pour charger dynamiquement un fichier CSS
function loadCookieDynamicCSS() {
  // Vérifier si le CSS n'est pas déjà chargé
  const id = 'css-cookie-dynamic';
  if (document.getElementById(id)) {
    console.log('CSS cookie_dynamic.css déjà chargé, ignoré.');
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';

  // Détecter le chemin selon la page (accueil vs pages/xxx)
  const isDetailPage = document.getElementById('page-cookie');
  const path = isDetailPage ? '../assets/css/cookie_dynamic.css' : 'assets/css/cookie_dynamic.css';

  link.href = path;
  link.id = id;
  document.head.appendChild(link);
  console.log('✅ CSS chargé : ' + path);
}

// --- HELPER FETCH CATEGORY DATA ---
async function fetchCategoryData(categorySlug, buildTypes, defaultNom) {
  try {
    // 1. Tentative sur la nouvelle table (ex: 'toppings')
    // cookieId n'est pas global ici, il faut le passer en paramètre
    throw new Error('fetchCategoryData doit recevoir cookieId en paramètre');

    if (!newError && newData && newData.length > 0) {
      console.log(`Données trouvées dans la nouvelle table "${categorySlug}"`);
      return newData.map(item => ({
        id: item.id,
        nom: item.nom || item.type || defaultNom,
        images: Array.isArray(item.images) ? item.images : (typeof item.images === 'string' ? JSON.parse(item.images) : [])
      }));
    }
  } catch (e) {
    console.log(`Table "${categorySlug}" non trouvée ou erreur, tentative fallback builds...`);
  }

  // 2. Fallback sur la table 'builds'
  const { data: fallbackData } = await supabase
    .from('builds')
    .select('*')
    .eq('cookie_id', cookieId)
    .in('type', buildTypes)
    .order('type', { ascending: true });

  if (fallbackData && fallbackData.length > 0) {
    console.log(`Fallback builds utilisé pour "${categorySlug}"`);
    return fallbackData.map(row => {
      const images = Object.keys(row)
        .filter(key => key.startsWith('image') && row[key])
        .sort()
        .map(key => row[key]);
      return {
        id: row.id,
        nom: row.nom || row.type || defaultNom,
        images: images
      };
    });
  }
  return [];
}

// Charger les données du cookie depuis Supabase
async function loadCookieData() {
  try {
    // --- CHARGEMENT DES DONNÉES DU COOKIE (SUPABASE ou LOCAL) ---
    let cookieData = null;
    let error = null;

    try {
      // 1. Tentative Supabase
      // On suppose que la table principale s'appelle 'cookies' (ou adapter selon votre schéma)
      const { data, error: sbError } = await supabase
        .from('cookies')
        .select('*')
        .eq('id', cookieId)
        .maybeSingle();

      if (sbError) throw sbError;

      if (data) {
        cookieData = data;
      } else {
        throw new Error('Cookie introuvable dans Supabase');
      }

    } catch (sbErr) {
      error = sbErr;
      console.warn("Échec Supabase, tentative fallback local...", sbErr);

      try {
        // 2. Fallback Local (cookies.json)
        // Ajustez le chemin si nécessaire (assets/data/cookies.json)
        const resp = await fetch('assets/data/cookies.json');
        if (resp.ok) {
          const localCookies = await resp.json();
          const localEntry = localCookies.find(c => c.id === cookieId);

          if (localEntry) {
            console.log("Cookie trouvé localement (fallback).");
            cookieData = localEntry;
            // On efface l'erreur car on a trouvé une solution
            error = null;
          }
        }
      } catch (localErr) {
        console.error("Erreur lors du fallback local:", localErr);
      }
    }

    if (error && !cookieData) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    if (!cookieData) {
      console.error('Aucun cookie trouvé avec l\'ID/Slug:', cookieId);
      throw new Error(`Cookie non trouvé: ${cookieId}`);
    }

    // Mise à jour de l'ID global vers l'UUID réel pour les futures requêtes (comme les builds)
    cookieId = cookieData.id;
    window.cookieId = cookieData.id; // On le sauve aussi globalement

    // DEBUG : Afficher toutes les lignes builds pour ce cookie_id
    let allBuildsResponse = await supabase
      .from('builds')
      .select('*')
      .eq('cookie_id', cookieData.id);
    console.log('Toutes les lignes builds pour ce cookie_id :', allBuildsResponse);

    // --- HELPER FETCH CATEGORY DATA ---
    async function fetchCategoryData(categorySlug, buildTypes, defaultNom) {
      try {
        // 1. Tentative sur la nouvelle table (ex: 'toppings')
        const { data: newData, error: newError } = await supabase
          .from(categorySlug)
          .select('*')
          .eq('cookie_id', cookieData.id)
          .order('position', { ascending: true });

        if (!newError && newData && newData.length > 0) {
          console.log(`Données trouvées dans la nouvelle table "${categorySlug}"`);
          return newData.map(item => ({
            id: item.id,
            nom: item.nom || item.type || defaultNom,
            images: Array.isArray(item.images) ? item.images : (typeof item.images === 'string' ? JSON.parse(item.images) : [])
          }));
        }
      } catch (e) {
        console.log(`Table "${categorySlug}" non trouvée ou erreur, tentative fallback builds...`);
      }

      // 2. Fallback sur la table 'builds'
      const { data: fallbackData } = await supabase
        .from('builds')
        .select('*')
        .eq('cookie_id', cookieData.id)
        .in('type', buildTypes)
        .order('type', { ascending: true });

      if (fallbackData && fallbackData.length > 0) {
        console.log(`Fallback builds utilisé pour "${categorySlug}"`);
        return fallbackData.map(row => {
          const images = Object.keys(row)
            .filter(key => key.startsWith('image') && row[key])
            .sort()
            .map(key => row[key]);
          return {
            id: row.id,
            nom: row.nom || row.type || defaultNom,
            images: images
          };
        });
      }
      return [];
    }

    // --- CHARGEMENT DES DIFFÉRENTES CATÉGORIES ---
    // --- Récupération du cookie depuis Supabase (doit être AVANT les fetchCategoryDataWithId) ---
    // ... code existant pour récupérer cookieData ...
    // 1. Toppings : reset step si modifié
    const prevToppingsRaw = localStorage.getItem(`toppings-data:${cookieId}`);
    let prevToppings = [];
    try { prevToppings = prevToppingsRaw ? JSON.parse(prevToppingsRaw) : []; } catch (e) { prevToppings = []; }
    const newToppings = await fetchCategoryDataWithId('toppings', ['topping'], 'Garniture', cookieData.id);
    newToppings.forEach(t => {
      const prev = prevToppings.find(pt => pt.id === t.id);
      if (prev && Array.isArray(prev.images) && Array.isArray(t.images)) {
        if (JSON.stringify(prev.images) !== JSON.stringify(t.images)) {
          saveEtatForId(t.id, 0);
        }
      }
    });
    localStorage.setItem(`toppings-data:${cookieId}`, JSON.stringify(newToppings));
    cookieData.toppings = newToppings;

    // 2. Tartelettes : reset step si modifié
    const prevTartelettesRaw = localStorage.getItem(`tartelettes-data:${cookieId}`);
    let prevTartelettes = [];
    try { prevTartelettes = prevTartelettesRaw ? JSON.parse(prevTartelettesRaw) : []; } catch (e) { prevTartelettes = []; }
    const newTartelettes = await fetchCategoryDataWithId('tartelettes', ['tartelette'], 'Tartelette', cookieData.id);
    newTartelettes.forEach(t => {
      const prev = prevTartelettes.find(pt => pt.id === t.id);
      if (prev && Array.isArray(prev.images) && Array.isArray(t.images)) {
        if (JSON.stringify(prev.images) !== JSON.stringify(t.images)) {
          saveEtatForId(t.id, 0);
        }
      }
    });
    localStorage.setItem(`tartelettes-data:${cookieId}`, JSON.stringify(newTartelettes));
    cookieData.tartelettes = newTartelettes;

    // 3. Biscuits : reset step si modifié
    const prevBiscuitsRaw = localStorage.getItem(`biscuits-data:${cookieId}`);
    let prevBiscuits = [];
    try { prevBiscuits = prevBiscuitsRaw ? JSON.parse(prevBiscuitsRaw) : []; } catch (e) { prevBiscuits = []; }
    const newBiscuits = await fetchCategoryDataWithId('biscuits', ['biscuit'], 'Biscuit', cookieData.id);
    newBiscuits.forEach(t => {
      const prev = prevBiscuits.find(pt => pt.id === t.id);
      if (prev && Array.isArray(prev.images) && Array.isArray(t.images)) {
        if (JSON.stringify(prev.images) !== JSON.stringify(t.images)) {
          saveEtatForId(t.id, 0);
        }
      }
    });
    localStorage.setItem(`biscuits-data:${cookieId}`, JSON.stringify(newBiscuits));
    cookieData.biscuits = newBiscuits;

    // 4. Promotions (pas de reset)
    cookieData.promotions = await fetchCategoryDataWithId('promotions', ['promotion1', 'promotion2', 'promotion3', 'promotion4', 'promotion5'], 'Promotion', cookieData.id);

    // 5. Pierres de confiture : reset step si modifié
    const prevPierresRaw = localStorage.getItem(`pierres-data:${cookieId}`);
    let prevPierres = [];
    try { prevPierres = prevPierresRaw ? JSON.parse(prevPierresRaw) : []; } catch (e) { prevPierres = []; }
    const pierresItems = await fetchCategoryDataWithId('pierres_de_confiture', ['pierre1', 'pierre2', 'pierre3', 'pierre4', 'pierre5'], 'Pierre de confiture', cookieData.id);
    pierresItems.forEach(t => {
      const prev = prevPierres.find(pt => pt.id === t.id);
      if (prev && Array.isArray(prev.images) && Array.isArray(t.images)) {
        if (JSON.stringify(prev.images) !== JSON.stringify(t.images)) {
          saveEtatForId(t.id, 0);
        }
      }
    });
    localStorage.setItem(`pierres-data:${cookieId}`, JSON.stringify(pierresItems));
    cookieData.pierres_de_confiture = pierresItems;

    // 6. Ascension (pas de reset, inchangé)
    const ascensionItems = await fetchCategoryDataWithId('ascension', ['ascension'], 'Ascension', cookieData.id);
    cookieData.ascension = { etoiles: ascensionItems };
    // 7. Bonbons : reset step si modifié
    const prevBonbonsRaw = localStorage.getItem(`bonbons-data:${cookieId}`);
    let prevBonbons = [];
    try { prevBonbons = prevBonbonsRaw ? JSON.parse(prevBonbonsRaw) : []; } catch (e) { prevBonbons = []; }
    const newBonbons = await fetchCategoryDataWithId('bonbons', ['bonbon', 'bonbon1', 'bonbon2', 'bonbon3', 'bonbon4', 'bonbon5'], 'Bonbon', cookieData.id);
    newBonbons.forEach(t => {
      const prev = prevBonbons.find(pt => pt.id === t.id);
      if (prev && Array.isArray(prev.images) && Array.isArray(t.images)) {
        if (JSON.stringify(prev.images) !== JSON.stringify(t.images)) {
          saveEtatForId(t.id, 0);
        }
      }
    });
    localStorage.setItem(`bonbons-data:${cookieId}`, JSON.stringify(newBonbons));
    cookieData.bonbons = newBonbons;

    // Nouvelle version de fetchCategoryData qui prend cookieId en paramètre
    async function fetchCategoryDataWithId(categorySlug, buildTypes, defaultNom, cookieId) {
      try {
        const { data: newData, error: newError } = await supabase
          .from(categorySlug)
          .select('*')
          .eq('cookie_id', cookieId)
          .order('position', { ascending: true });
        if (!newError && newData && newData.length > 0) {
          return newData.map(item => ({
            id: item.id,
            nom: item.nom || item.type || defaultNom,
            images: Array.isArray(item.images) ? item.images : (typeof item.images === 'string' ? JSON.parse(item.images) : [])
          }));
        }
      } catch (e) { }
      const { data: fallbackData } = await supabase
        .from('builds')
        .select('*')
        .eq('cookie_id', cookieId)
        .in('type', buildTypes)
        .order('type', { ascending: true });
      if (fallbackData && fallbackData.length > 0) {
        return fallbackData.map(row => {
          const images = Object.keys(row)
            .filter(key => key.startsWith('image') && row[key])
            .sort()
            .map(key => row[key]);
          return {
            id: row.id,
            nom: row.nom || row.type || defaultNom,
            images: images
          };
        });
      }
      return [];
    }

    // --- Récupération de tous les costumes (table "costumes") ---
    let costumesResponse = await supabase
      .from('costumes')
      .select('*')
      .eq('cookie_id', cookieData.id)
      .order('created_at', { ascending: true });

    if (costumesResponse.data && costumesResponse.data.length > 0) {
      console.log('Costumes trouvés dans Supabase');
      cookieData.costumes = costumesResponse.data.map(costumeRow => {
        // Récupère toutes les colonnes imageX non nulles et triées
        const costumeImages = Object.keys(costumeRow)
          .filter(key => key.startsWith('image') && costumeRow[key])
          .sort()
          .map(key => costumeRow[key])
          .filter(img => !!img);
        return {
          id: costumeRow.id,
          nom: costumeRow.nom || 'Costume',
          images: costumeImages,
          illustrationReplace: costumeRow.illustrationReplace || costumeRow.illustration_replace || null,
          rareteIcon: costumeRow.rareteIcon || costumeRow.rarete_icon || null,
          style: {
            width: costumeRow.style_width,
            height: costumeRow.style_height,
            top: costumeRow.style_top,
            left: costumeRow.style_left
          }
        };
      });

      // Tri pour mettre le costume "Original" en premier
      cookieData.costumes.sort((a, b) => {
        const isAOriginal = a.nom && a.nom.toLowerCase().includes('original');
        const isBOriginal = b.nom && b.nom.toLowerCase().includes('original');

        if (isAOriginal && !isBOriginal) return -1;
        if (!isAOriginal && isBOriginal) return 1;
        return 0;
      });
    } else {
      cookieData.costumes = [];
    }

    // Log complet de cookieData pour debug
    console.log('cookieData complet après chargement dynamisé :', cookieData);

    // Met à jour le titre de la page avec le nom du cookie
    document.title = cookieData.nom || 'Cookie';

    // Met à jour la favicon avec icon_tete si présent
    if (cookieData.icon_tete) {
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      // Si c'est une URL absolue (commence par http), on l'utilise telle quelle
      if (cookieData.icon_tete.startsWith('http')) {
        favicon.href = cookieData.icon_tete;
      } else {
        // Sinon on traite comme un chemin relatif local
        favicon.href = cookieData.icon_tete.startsWith('../') ? cookieData.icon_tete : '../' + cookieData.icon_tete;
      }
    }

    // --- RÉCUPÉRATION DE LA NAVIGATION LOCALE (FALLBACK) ---
    let localNavigation = []; // Par défaut on attend un tableau (nouvelle version)
    try {
      // Ajout d'un timestamp pour éviter le cache du navigateur
      const navResponse = await fetch(`../assets/data/navigation.json?t=${Date.now()}`);
      if (navResponse.ok) {
        localNavigation = await navResponse.json();
      }
    } catch (e) {
      console.warn('Erreur chargement navigation.json:', e);
    }

    // Calcul de la navigation (Ordre circulaire)
    let calculatedNav = {};

    // Si c'est un tableau (format allégé)
    if (Array.isArray(localNavigation) && localNavigation.length > 0) {
      // On cherche l'index de l'ID actuel
      const currentIndex = localNavigation.indexOf(cookieData.id);

      if (currentIndex !== -1) {
        // Calcul circulaire (modulo)
        const prevIndex = (currentIndex - 1 + localNavigation.length) % localNavigation.length;
        const nextIndex = (currentIndex + 1) % localNavigation.length;

        calculatedNav = {
          precedent: localNavigation[prevIndex],
          suivant: localNavigation[nextIndex]
        };
      } else {
        console.warn(`Cookie ID ${cookieData.id} non trouvé dans navigation.json`);
      }
    }
    // Si c'est encore un objet (ancien format, au cas où)
    else if (localNavigation && typeof localNavigation === 'object') {
      calculatedNav = localNavigation[cookieData.id] || localNavigation[urlParams.get('id')] || {};
    }

    // Fusionner la navigation (Calculée + Surcharges Supabase si existantes)
    const cookieNav = {
      ...calculatedNav,
      ...(cookieData.navigation || {})
    };
    cookieData.navigation = cookieNav;

    // --- RÉCUPÉRATION DE LA SÉLECTION SUPABASE (Optionnel si connecté) ---
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      console.log('[DEBUG] Utilisateur connecté:', authData.user.id);
      const { data: userSelection, error: selectError } = await supabase
        .from('cookies_users')
        .select('costume_id, builds, stats_checks')
        .eq('user_id', authData.user.id)
        .eq('cookie_id', cookieId) // cookieId est déjà l'UUID ici
        .maybeSingle();

      console.log('[DEBUG] userSelection récupéré:', userSelection);
      if (selectError) console.error('[DEBUG] Erreur sélection Supabase:', selectError);

      if (userSelection) {
        // 1. Restauration du costume
        if (userSelection.costume_id) {
          console.log('[DEBUG] costume_id trouvé en base:', userSelection.costume_id);
          const selectedCostume = cookieData.costumes?.find(c => c.id === userSelection.costume_id);
          console.log('[DEBUG] Costume correspondant trouvé dans data:', selectedCostume?.nom);

          if (selectedCostume && selectedCostume.illustrationReplace) {
            cookieData.activeCostumeId = selectedCostume.id;
            saveCookieIllustration(cookieData.id, formatImagePath(selectedCostume.illustrationReplace));
            saveEtatForId(selectedCostume.id, 1);
          }
        }

        // 2. Restauration des builds (JSONB)
        if (userSelection.builds) {
          console.log('[DEBUG] Builds trouvés en base:', userSelection.builds);
          // On injecte les builds dans cookieData pour que renderCookie les utilise
          cookieData.activeBuilds = userSelection.builds;

          // On peut aussi mettre à jour les objets data directement pour simplifier renderCookie
          const applyStep = (items) => {
            if (!items) return;
            items.forEach(item => {
              if (userSelection.builds[item.id] !== undefined) {
                item.selectedStep = userSelection.builds[item.id];
                // Mise à jour synchrone du localStorage pour la cohérence
                saveEtatForId(item.id, item.selectedStep);
              }
            });
          };

          applyStep(cookieData.toppings);
          applyStep(cookieData.tartelettes);
          applyStep(cookieData.biscuits);
          applyStep(cookieData.promotions);
          if (cookieData.ascension?.etoiles) applyStep(cookieData.ascension.etoiles);
        }

        // 3. Restauration des stats checks (JSONB)
        if (userSelection.stats_checks) {
          console.log('[DEBUG] Stats checks trouvés en base:', userSelection.stats_checks);
          // On met à jour le localStorage pour que renderCookie l'utilise
          localStorage.setItem(`cookie_stats_checks_${cookieId}`, JSON.stringify(userSelection.stats_checks));
        }
      }
    }

    // Afficher le cookie et appliquer le thème
    applyDynamicTheme(cookieData);
    renderCookie(cookieData);

    // Afficher la galerie de costumes si présente (après renderCookie pour que le DOM existe)
    if (cookieData.costumes && cookieData.costumes.length > 0) {
      renderCostumes(cookieData.costumes);
    }

    // Appliquer dynamiquement les styles d'illustration selon l'image
    applyIllustrationStyles();

    setupImageCycles(cookieData);
    setupCostumePopup();
  } catch (err) {
    console.error('Erreur lors du chargement des données du cookie:', err);
  }
}

// --- CONFIGURATION DES POSITIONS COSTUMES ---
const COSTUME_STYLES = [
  // == CUSTOM ==
  { ids: ['cookie_alchimiste', 'alchimiste'], style: { width: '412px', height: '444px', left: '270px', top: '150px' } },
  { ids: ['chasseuse', 'occasionnelle'], style: { width: '412px', height: '444px', left: '310px', top: '110px' } },
  { ids: ['fermiere', 'fashionista'], style: { width: '412px', height: '444px', left: '280px', top: '110px' } },
  { ids: ['explosion', 'bombe'], style: { width: '412px', height: '444px', left: '280px', top: '150px' } },
  { ids: ['poches', 'chance'], style: { width: '412px', height: '444px', left: '290px', top: '150px' } },
  { ids: ['cookie_cerise', 'cerise'], style: { width: '412px', height: '444px', left: '240px', top: '120px' } },
  { ids: ['prisonniere', 'evasion'], style: { width: '200px', height: 'auto', left: '380px', top: '320px' } },
  { ids: ['cookie_piment', 'piment'], style: { width: '412px', height: '444px', left: '270px', top: '160px' } },
  { ids: ['vagabond', 'automne'], style: { width: '412px', height: '444px', left: '250px', top: '100px' } },
  { ids: ['honorable', 'descendant'], style: { width: '200px', height: 'auto', left: '390px', top: '300px' } },
  { ids: ['cookie_creme_patissiere_iii', 'creme_patissiere_iii'], style: { width: '412px', height: '444px', left: '270px', top: '120px' } },
  { ids: ['Gardien', 'doux'], style: { width: '200px', height: 'auto', left: '360px', top: '320px' } },
  { ids: ['larmes', 'blanches'], style: { width: '412px', height: '444px', left: '250px', top: '100px' } },
  { ids: ['oignon'], style: { width: '412px', height: '444px', left: '270px', top: '120px' } },
  { ids: ['Legerement', 'brule'], style: { width: '200px', height: 'auto', left: '380px', top: '270px' } },
  { ids: ['mascotte', 'choeur'], style: { width: '200px', height: 'auto', left: '380px', top: '270px' } },
  { ids: ['pancake'], style: { width: '412px', height: '444px', left: '270px', top: '120px' } },
  { ids: ['joies', 'ete'], style: { width: '200px', height: 'auto', left: '380px', top: '320px' } },
  { ids: ['princesse'], style: { width: '412px', height: '444px', left: '300px', top: '100px' } },
  { ids: ['boule-de-gomme', 'boule_de_gomme'], style: { width: '412px', height: '444px', left: '250px', top: '180px' } },
  { ids: ['menthe', 'glacee'], style: { width: '412px', height: '444px', left: '270px', top: '100px' } },
  { ids: ['jardinier'], style: { width: '412px', height: '444px', left: '290px', top: '100px' } },
  { ids: ['prince', 'royaume'], style: { width: '200px', height: 'auto', left: '370px', top: '360px' } },
  { ids: ['vieux', 'souvenirs'], style: { width: '412px', height: '444px', left: '280px', top: '150px' } },
  { ids: ['choco-noir', 'choco_noir'], style: { width: '412px', height: '444px', left: '260px', top: '180px' } },
  { ids: ['roti'], style: { width: '412px', height: '444px', left: '250px', top: '110px' } },
  { ids: ['erudit'], style: { width: '412px', height: '444px', left: '230px', top: '120px' } },
  { ids: ['espresso'], style: { width: '412px', height: '444px', left: '250px', top: '170px' } },
  { ids: ['zz', 'skull'], style: { width: '400px', height: 'auto', left: '380px', top: '290px' } },
  { ids: ['reglisse'], style: { width: '412px', height: '444px', left: '240px', top: '170px' } },
];

// Applique dynamiquement les styles d'illustration selon le nom ou l'URL de l'image
function applyIllustrationStyles() {
  const img = document.querySelector('.illustration-cookie img');
  if (!img) return;

  // Réinitialise les styles
  img.style.width = '';
  img.style.height = '';
  img.style.left = '';
  img.style.top = '';

  const src = img.src.toLowerCase();
  const costumeName = img.dataset.costumeName || '';

  // 1. Identifier la règle Hardcoded (Fallback)
  let finalStyle = {};
  const rule = COSTUME_STYLES.find(r => {
    const matchId = r.ids.some(id => src.includes(id.toLowerCase()) || costumeName.includes(id.toLowerCase()));
    if (matchId && r.conditions) {
      return r.conditions.every(c => src.includes(c.toLowerCase()) || costumeName.includes(c.toLowerCase()));
    }
    return matchId;
  });

  if (rule) {
    finalStyle = { ...rule.style };
    console.log(`[applyIllustrationStyles] Base style found (Hardcoded): ${rule.ids.join(', ')}`);
  }

  // 2. Fusionner avec les styles Supabase (Override)
  if (img.dataset.styleWidth) finalStyle.width = img.dataset.styleWidth;
  if (img.dataset.styleHeight) finalStyle.height = img.dataset.styleHeight;
  if (img.dataset.styleTop) finalStyle.top = img.dataset.styleTop;
  if (img.dataset.styleLeft) finalStyle.left = img.dataset.styleLeft;

  // 3. Appliquer le résultat
  if (Object.keys(finalStyle).length > 0) {
    console.log('[applyIllustrationStyles] Applying Final Style:', finalStyle);
    Object.assign(img.style, finalStyle);
  } else {
    console.log('[applyIllustrationStyles] No specific style rule found for:', src);
  }
}



// --- SAUVEGARDE SIMPLE DANS LE LOCALSTORAGE ---
// --- SAUVEGARDE ILLUSTRATION (système cookie_temeraire.js) ---
function saveCookieIllustration(id, src) {
  if (!id || !src) return;
  localStorage.setItem(`cookie-illustration:${id}`, src);
}

function getCookieIllustration(id) {
  if (!id) return null;
  return localStorage.getItem(`cookie-illustration:${id}`);
}

// --- SAUVEGARDE CYCLES (système cookie_temeraire.js) ---
function saveEtatForId(id, step) {
  if (!id) return;
  localStorage.setItem(`etat-${id}`, step);
}

function getEtatForId(id) {
  if (!id) return null;
  return localStorage.getItem(`etat-${id}`);
}
// --- SAUVEGARDE DYNAMIQUE SUR SUPABASE ---
// --- SAUVEGARDE DYNAMIQUE SUR SUPABASE ---
/**
 * Sauvegarde le 'step' d'un élément de build (topping, biscuit, etc.) dans Supabase
 */
async function saveBuildToSupabase(cookieId, buildId, step) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // 1. Récupérer l'état actuel des builds pour ce cookie
    const { data: current, error: fetchError } = await supabase
      .from('cookies_users')
      .select('builds')
      .eq('user_id', user.id)
      .eq('cookie_id', cookieId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // 2. Préparer le nouvel objet builds
    const newBuilds = current?.builds || {};
    newBuilds[buildId] = step;

    // 3. Upsert
    const { error } = await supabase
      .from('cookies_users')
      .upsert({
        user_id: user.id,
        cookie_id: cookieId,
        builds: newBuilds
      }, { onConflict: 'user_id, cookie_id' });

    if (error) throw error;
    console.log(`[Supabase] Build ${buildId} mis à jour : step ${step}`);
  } catch (err) {
    console.error('[Supabase] Erreur saveBuildToSupabase:', err);
  }
}

async function saveSelectionToSupabase(cookieId, costumeId = null) {
  console.log('--- Tentative de synchronisation Supabase ---');
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.warn('⚠️ Aucun utilisateur connecté.');
    return;
  }

  try {
    const payload = {
      user_id: user.id,
      cookie_id: cookieId,
      costume_id: costumeId // Sera null si non fourni, ce qui vide la colonne
    };

    const { error } = await supabase
      .from('cookies_users')
      .upsert(payload, { onConflict: 'user_id, cookie_id' });

    if (error) throw error;
    console.log('✅ Choix synchronisé sur Supabase');
  } catch (err) {
    console.error('🔴 Erreur Supabase:', err.message);
  }
}

async function saveStatsToSupabase(cookieId, checks) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // On doit faire un upsert prudent pour ne pas écraser les autres champs (costume_id, builds)
    // Mais upsert écrase tout si on ne fournit pas les autres champs ? 
    // NON, Supabase upsert écrase la ligne. Il faut donc récupérer l'existant ou faire un patch.
    // Heureusement, on peut faire un update si la ligne existe.
    // Mais le plus simple avec upsert partiel est de s'assurer qu'on ne perd rien.
    // Mieux : Utiliser .update() car la ligne existe forcément si on a déjà chargé la page (ou presque).
    // Si elle n'existe pas, il faut la créer.

    // Stratégie sûre : Fetch current -> Merge -> Upsert
    // Ou juste .select() avant .upsert() comme fais saveBuildToSupabase

    const { data: current } = await supabase
      .from('cookies_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('cookie_id', cookieId)
      .maybeSingle();

    const payload = {
      user_id: user.id,
      cookie_id: cookieId,
      stats_checks: checks
    };

    // Si une entrée existe déjà, on garde ses valeurs pour les autres champs
    if (current) {
      if (current.costume_id) payload.costume_id = current.costume_id;
      if (current.builds) payload.builds = current.builds;
    }

    const { error } = await supabase
      .from('cookies_users')
      .upsert(payload, { onConflict: 'user_id, cookie_id' });

    if (error) throw error;
    console.log('✅ Stats checks sauvegardés sur Supabase');
  } catch (err) {
    console.error('🔴 Erreur Save Stats:', err);
  }
}

// --- FIN SAUVEGARDE SIMPLE ---

// Lancer le chargement
// Lancer le chargement seulement si on est sur une page de détail
if (document.getElementById('page-cookie')) {
  loadCookieData();
}

// === FONCTIONS POUR LE RENDU DYNAMIQUE ===

function applyDynamicTheme(data) {
  const root = document.documentElement;

  // 1. Couleurs du thème (Boutons, Textes)
  // On attend des colonnes DB : theme_primary, theme_secondary, etc.
  if (data.theme_primary) root.style.setProperty('--theme-primary', data.theme_primary);
  if (data.theme_secondary) root.style.setProperty('--theme-secondary', data.theme_secondary);
  if (data.theme_accent) root.style.setProperty('--theme-accent', data.theme_accent);
  if (data.theme_text) root.style.setProperty('--theme-text', data.theme_text);

  // 2. Backgrounds
  // 2. Backgrounds (Lobby)
  if (data.bg_color) root.style.setProperty('--bg-color', data.bg_color);

  const bgSource = data.lobby || data.bg_image;
  if (bgSource) {
    // Gérer images relatives ou absolues
    const bgUrl = bgSource.startsWith('http') || bgSource.startsWith('..') || bgSource.startsWith('/')
      ? `url("${bgSource}")`
      : `url("../${bgSource}")`;
    root.style.setProperty('--bg-image', bgUrl);
  }

  // 3. Titre
  if (data.title_color) root.style.setProperty('--title-color', data.title_color);

  // Ajustement de la taille du titre si besoin (ex: noms très longs)
  if (data.nom && (data.nom.includes('Crème Pâtissière') || data.nom.includes('creme patissiere') || data.nom.includes('Champignon'))) {
    root.style.setProperty('--title-size', '50px');
    root.style.setProperty('--title-top', '-10px');
  } else {
    root.style.removeProperty('--title-size');
    root.style.removeProperty('--title-top');
  }

  // 4. Positions (Illustration)
  // On peut imaginer des champs 'pos_illustration_top' et 'pos_illustration_left' dans un objet JSON 'style_config' ou colonnes directes
  // Ici on suppose colonnes directes ou champs dans un JSON 'style_options'
  /* Exemple d'usage si vous ajoutez une colonne JSON 'style_options' :
     if (data.style_options) {
        if(data.style_options.illustration_top) root.style.setProperty('--pos-illustration-top', data.style_options.illustration_top);
        if(data.style_options.illustration_left) root.style.setProperty('--pos-illustration-left', data.style_options.illustration_left);
     }
  */
  // Fallback/Support direct si colonnes existent
  if (data.pos_illustration_top) root.style.setProperty('--pos-illustration-top', data.pos_illustration_top);
  if (data.pos_illustration_left) root.style.setProperty('--pos-illustration-left', data.pos_illustration_left);

  console.log("Thème dynamique appliqué pour :", data.nom);
}

function renderCookie(data) {
  // Stocker l'image d'origine du cookie pour la gestion NB
  window._cookieOriginalImage = formatImagePath(data.illustration);

  // --- DÉTERMINATION DE L'ILLUSTRATION À AFFICHER ---
  let currentIllustration = formatImagePath(data.illustration);
  let costumeIllustration = null;
  let activeStyleAttributes = '';

  // 1. Priorité Supabase (si l'info a été injectée par loadCookieData)
  if (data.activeCostumeId) {
    const activeCostume = data.costumes?.find(c => c.id === data.activeCostumeId);
    if (activeCostume && activeCostume.illustrationReplace) {
      costumeIllustration = formatImagePath(activeCostume.illustrationReplace);
      console.log('[Costume] Priorité 1 : Restauration depuis Supabase (actif):', costumeIllustration);
      console.log('[Costume] Priorité 1 : Restauration depuis Supabase (actif):', costumeIllustration);

      // Préparation des attributs de style pour l'injection HTML directe (car le DOM n'est pas encore créé)
      if (activeCostume.nom) {
        activeStyleAttributes += ` data-costume-name="${activeCostume.nom.toLowerCase()}"`;
      }
      if (activeCostume.style) {
        if (activeCostume.style.width) activeStyleAttributes += ` data-style-width="${activeCostume.style.width}"`;
        if (activeCostume.style.height) activeStyleAttributes += ` data-style-height="${activeCostume.style.height}"`;
        if (activeCostume.style.top) activeStyleAttributes += ` data-style-top="${activeCostume.style.top}"`;
        if (activeCostume.style.left) activeStyleAttributes += ` data-style-left="${activeCostume.style.left}"`;
        console.log('[Costume] Generated attributes string:', activeStyleAttributes);
      }
    }
  }

  // 2. Fallback final : Sauvegarde d'illustration simple
  if (costumeIllustration) {
    currentIllustration = costumeIllustration;
  } else {
    const saved = getCookieIllustration(data.id);
    if (saved) {
      currentIllustration = saved;
      console.log('[Costume] Priorité 2 : Restauration depuis sauvegarde simple:', currentIllustration);

      // TENTATIVE INTELLIGENTE : Retrouver le costume associé à cette URL pour appliquer ses styles
      const matchingCostume = data.costumes?.find(c => formatImagePath(c.illustrationReplace) === saved);
      if (matchingCostume) {
        console.log('[Costume] Costume retrouvé via URL locale:', matchingCostume.nom);
        if (matchingCostume.nom) {
          activeStyleAttributes += ` data-costume-name="${matchingCostume.nom.toLowerCase()}"`;
        }
        if (matchingCostume.style) {
          if (matchingCostume.style.width) activeStyleAttributes += ` data-style-width="${matchingCostume.style.width}"`;
          if (matchingCostume.style.height) activeStyleAttributes += ` data-style-height="${matchingCostume.style.height}"`;
          if (matchingCostume.style.top) activeStyleAttributes += ` data-style-top="${matchingCostume.style.top}"`;
          if (matchingCostume.style.left) activeStyleAttributes += ` data-style-left="${matchingCostume.style.left}"`;
        }
      }
    }
  }

  if (!costumeIllustration && !getCookieIllustration(data.id)) {
    console.log('[Costume] Aucune sauvegarde trouvée, affichage illustration défaut.');

    // TENTATIVE INTELLIGENTE (Défaut) : Même logique pour l'illustration de base
    // Si l'illustration par défaut correspond à un "costume" (ex: Original) paramétré dans la DB, on applique ses styles
    const matchingDefault = data.costumes?.find(c => {
      // Correspondance par URL (si l'URL de base est la même que celle du costume Original)
      const matchUrl = c.illustrationReplace && formatImagePath(c.illustrationReplace) === currentIllustration;
      // Correspondance par Nom (si le costume s'appelle "Original" ou "Defaut")
      const matchName = c.nom && (c.nom.toLowerCase() === 'original' || c.nom.toLowerCase() === 'defaut' || c.nom.toLowerCase() === 'défaut');

      return matchUrl || matchName;
    });

    if (matchingDefault) {
      console.log('[Costume] Styles appliqués pour l\'illustration par défaut via Supabase:', matchingDefault.nom);
      if (matchingDefault.nom && !activeStyleAttributes.includes('data-costume-name')) {
        activeStyleAttributes += ` data-costume-name="${matchingDefault.nom.toLowerCase()}"`;
      }
      if (matchingDefault.style) {
        if (matchingDefault.style.width) activeStyleAttributes += ` data-style-width="${matchingDefault.style.width}"`;
        if (matchingDefault.style.height) activeStyleAttributes += ` data-style-height="${matchingDefault.style.height}"`;
        if (matchingDefault.style.top) activeStyleAttributes += ` data-style-top="${matchingDefault.style.top}"`;
        if (matchingDefault.style.left) activeStyleAttributes += ` data-style-left="${matchingDefault.style.left}"`;
      }
    }
  }
  const pageContainer = document.getElementById('page-cookie');
  if (pageContainer && data.id) {
    pageContainer.setAttribute('data-cookie-id', data.id);
  }

  // --- MODE TEST SIMPLIFIÉ ---
  // Utiliser ce mode tant que vous n'avez que la colonne 'nom'
  if (data.nom && !data.illustration) {
    pageContainer.innerHTML = `
        <div class="bloc-fond-cookie">
           <div class="fond-floute"></div>
           <h1 class="nom-cookie">${data.nom}</h1>
        </div>
        <div style="text-align: center; color: white; margin-top: 50px;">
           <p>Données complètes non trouvées dans Supabase.</p>
           <p>Ajoutez les colonnes <code>illustration</code>, <code>badges</code>, etc. pour voir le reste.</p>
        </div>
     `;
    return;
  }
  // ---------------------------

  // Structure HTML identique à cookie_temeraire.html
  // Log pour debug HTML toppings
  const toppingsHTML = (data.toppings || []).map((t, i) => `
        <img alt="${t.nom || 'Garniture'}" class="garniture-cycle" 
             data-id="${t.id}" 
             data-images='${safeJsonStringify(t.images)}' 
             data-step="0" 
             src="${formatImagePath(t.images ? t.images[0] : '')}"/>
    `).join('');
  console.log('HTML généré pour toppings :', toppingsHTML);

  // LOGIQUE DE DIMENSIONNEMENT DYNAMIQUE (Calculée avant le rendu)
  const stats = data.beascuit_stats || ['DGTS d\'Électricité', 'DGTS d\'Électricité', 'DGTS d\'Électricité', 'DGTS d\'Électricité'];
  const isWide = stats.some(s => s.length > 12);
  const isExtraWide = stats.some(s => s.length > 18);
  const isSmallText = stats.some(s => s.length > 12);

  const cookieHTML = `
  <div class="bloc-fond-cookie">
   <div class="fond-floute"></div>
   <h1 class="nom-cookie">${data.nom}</h1>
   
   <div class="badges">
     ${(() => {
      // Support des deux formats : colonnes directes (rarete, classe, element) OU format JSON (badges.rarete, etc.)
      const rarete = data.rarete || data.badges?.rarete || '';
      const classe = data.classe || data.badges?.classe || '';
      const elementRaw = data.element || data.badges?.element || null;

      // Ne pas afficher les badges vides pour éviter les espaces
      let badgesHTML = '';
      if (rarete) badgesHTML += `<img alt="Rareté" class="badge" src="${formatImagePath(rarete)}"/>`;
      if (classe) badgesHTML += `<img alt="Classe" class="badge" src="${formatImagePath(classe)}"/>`;

      // Gestion des éléments multiples (String JSON ou String simple)
      if (elementRaw) {
        let elementsList = [];
        if (typeof elementRaw === 'string' && elementRaw.trim().startsWith('[')) {
          try {
            elementsList = JSON.parse(elementRaw);
          } catch (e) {
            elementsList = [elementRaw];
          }
        } else if (Array.isArray(elementRaw)) {
          elementsList = elementRaw;
        } else {
          elementsList = [elementRaw];
        }

        let elementsHTML = '';
        elementsList.forEach(el => {
          if (el) elementsHTML += `<img alt="Élément" class="badge" src="${formatImagePath(el)}"/>`;
        });

        if (elementsHTML) {
          badgesHTML += `<div class="badges-elements">${elementsHTML}</div>`;
        }
      }

      return badgesHTML;
    })()}
   </div>
  </div>
  
  <div class="illustration-cookie">
    <img alt="${data.nom}" src="${currentIllustration}" ${activeStyleAttributes}/>
  </div>

  <div class="toppings">
    ${(data.toppings || []).map((t, i) => `
        <img alt="${t.nom || 'Garniture'}" class="garniture-cycle" 
             data-id="${t.id}" 
             data-images='${safeJsonStringify(t.images)}' 
             data-step="${t.selectedStep || 0}" 
             src="${formatImagePath(t.images ? t.images[t.selectedStep || 0] : '')}"/>
    `).join('')}
 </div>
 
 <div class="info-frame">
     <div class="info-frame-header">
         <img class="info-frame-icon" src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034037/icon_info_nvqptv.webp" alt="Info" />
         <h3>Attributs recommandés</h3>
     </div>
     <div class="info-frame-content">
         ${(data.toppings_stats || ['???', '???', '???']).map(stat => `<p>${stat}</p>`).join('')}
     </div>
 </div>

 <div class="tartelettes">
    ${(data.tartelettes || []).map(t => `
        <img alt="${t.nom || 'Tartelette'}" class="tartelette-cycle" 
             data-id="${t.id}" 
             data-images='${safeJsonStringify(t.images)}' 
             data-step="${t.selectedStep || 0}" 
             src="${formatImagePath(t.images ? t.images[t.selectedStep || 0] : '')}"/>
    `).join('')}
 </div>

   ${(() => {
      // Logic moved up
      return `
     <div class="info-frame2 ${isExtraWide ? 'extra-wide-mode' : (isWide ? 'wide-mode' : '')} ${isSmallText ? 'small-text' : ''}">
         <div class="info-frame2-header">
             <img class="info-frame2-icon" src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034037/icon_info_nvqptv.webp" alt="Info" />
             <h3>Attributs recommandés</h3>
         </div>
         <div class="info-frame2-content">
             ${(() => {
          const savedChecks = JSON.parse(localStorage.getItem(`cookie_stats_checks_${data.id}`) || '[]');
          return stats.map((stat, index) => `
                <div class="stat-item" data-index="${index}">
                    <div class="stat-checkbox ${savedChecks[index] ? 'checked' : ''}"></div>
                    <p>${stat}</p>
                </div>
             `).join('');
        })()}
         </div>
     </div>
     `;
    })()}

 <div class="biscuits ${isExtraWide ? 'shift-left-dynamic' : ''} ${data.nom && data.nom.includes('Sorcier') ? 'biscuits-sorcier' : ''} ${data.nom && data.nom.includes('Costaud') ? 'biscuits-costaud' : ''} 
 ${data.nom && data.nom.includes('Alchimiste') ? 'biscuits-alchimiste' : ''} ${data.nom && data.nom.includes('Avocat') ? 'biscuits-avocat' : ''} ${data.nom && data.nom.includes('Betterave') ? 'biscuits-betterave' : ''}
 ${data.nom && (data.nom.includes('Mure') || data.nom.includes('Mûre')) ? 'biscuits-mure' : ''} ${data.nom && data.nom.includes('Carotte') ? 'biscuits-carotte' : ''} 
 ${data.nom && data.nom.includes('Cerise') ? 'biscuits-cerise' : ''} ${data.nom && data.nom.includes('Piment') ? 'biscuits-piment' : ''} ${data.nom && data.nom.includes('Chevalier') ? 'biscuits-chevalier' : ''} 
 ${data.nom && data.nom.includes('Boule de gomme') ? 'biscuits-boule-de-gomme' : ''}">
    ${(data.biscuits || []).map(b => `
        <img alt="${b.nom || 'Biscuit'}" class="biscuit-cycle" 
             data-id="${b.id}" 
             data-images='${safeJsonStringify(b.images)}'
             data-step="${b.selectedStep || 0}" 
             src="${formatImagePath(b.images ? b.images[b.selectedStep || 0] : '')}"/>
    `).join('')}
 </div>

 <div class="promotion">
    ${(data.promotions || []).map(p => `
        <img alt="Promotion" class="promotion-cycle" 
             data-id="${p.id}" 
             data-images='${safeJsonStringify(p.images)}'
             data-step="${p.selectedStep || 0}" 
             src="${formatImagePath(p.images ? p.images[p.selectedStep || 0] : '')}"/>
    `).join('')}
 </div>

 <div class="ascension">
    ${(data.ascension?.etoiles || []).map((a, index) => {
      const images = Array.isArray(a) ? a : (a.images || []);
      const step = a.selectedStep || 0;
      return `
        <img alt="Ascension" class="ascension-cycle" 
             data-id="${a.id || 'ascension-' + index}" 
             data-images='${safeJsonStringify(images)}'
             data-step="${step}" 
             src="${formatImagePath(images[step] || '')}"/>
    `}).join('')}
 </div>
 
 <div class="bonbons">
    ${(data.bonbons || []).map(b => `
        <img alt="${b.nom || 'Bonbon'}" class="bonbon-cycle" 
             data-id="${b.id}" 
             data-images='${safeJsonStringify(b.images)}'
             data-step="${b.selectedStep || 0}" 
             src="${formatImagePath(b.images ? b.images[b.selectedStep || 0] : '')}"/>
    `).join('')}
 </div>


  <a class="btn-costume" href="#"><span>Costumes</span></a>
  ${data.navigation?.precedent ? `<a href="cookie_detail.html?id=${data.navigation.precedent}" class="btn-cookie-precedent"><span>Cookie précédent</span></a>` : ''}
  ${data.navigation?.suivant ? `<a href="cookie_detail.html?id=${data.navigation.suivant}" class="btn-cookie-suivant"><span>Cookie suivant</span></a>` : ''}
 
  `;

  if (pageContainer) {
    pageContainer.innerHTML = cookieHTML;

    // Ajouter interactivité checkboxes
    pageContainer.querySelectorAll('.stat-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = item.dataset.index;
        const checkbox = item.querySelector('.stat-checkbox');
        checkbox.classList.toggle('checked');

        // Sauvegarder l'état local
        const checks = JSON.parse(localStorage.getItem(`cookie_stats_checks_${data.id}`) || '[]');
        checks[index] = checkbox.classList.contains('checked');
        localStorage.setItem(`cookie_stats_checks_${data.id}`, JSON.stringify(checks));

        // Sauvegarder sur Supabase
        saveStatsToSupabase(data.id, checks);
      });
    });
  }
}

// Fonction pour formater les chemins d'images
// Priorité : URLs complètes > Chemins absolus > Chemins relatifs locaux
function formatImagePath(path) {
  if (!path) return '';

  // Si c'est déjà une URL complète (http/https), on la retourne telle quelle
  // C'est le format recommandé pour Supabase Storage ou URLs externes
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Si c'est un chemin absolu (commence par /), on le retourne tel quel
  // Utile pour les chemins Supabase Storage comme /storage/v1/object/public/...
  if (path.startsWith('/')) {
    return path;
  }

  // Pour la compatibilité avec l'ancien système local (si vous avez encore des chemins locaux)
  // Si le chemin commence déjà par ../, on le retourne tel quel
  if (path.startsWith('../')) {
    return path;
  }

  // Si le chemin commence par assets/, on ajoute ../ (ancien système local)
  if (path.startsWith('assets/')) {
    return '../' + path;
  }

  // Par défaut, on suppose que c'est une URL ou un chemin absolu
  // Ne pas ajouter de préfixe pour éviter de casser les URLs
  return path;
}

// Aide pour convertir les tableaux JSON en string pour data-images
function safeJsonStringify(obj) {
  if (!obj) return '[]';
  // Formater chaque chemin d'image (gère les URLs complètes)
  const fixedPaths = obj.map(p => formatImagePath(p));
  return JSON.stringify(fixedPaths).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
}

function renderCostumes(costumes) {
  // Cette fonction ne fait que préparer les données, le popup est dans le HTML principal
  // Mais le bouton "Costumes" doit ouvrir le popup, géré plus bas par setupCostumePopup
  // Il faut aussi injecter les costumes dans le popup caché
  const gallery = document.getElementById('popup-costume-gallery');
  if (!gallery) return;

  if (!costumes) return;

  const costumesHTML = costumes.map(c => `
      <div class="costume-item">
        <div class="costume-toggle-wrapper">
          <img alt="${c.nom}" class="costume-toggle" 
               data-id="${c.id || 'costume-' + Math.random()}" 
               data-images='${safeJsonStringify(c.images)}'
               ${c.illustrationReplace ? `data-illustration-replace="${formatImagePath(c.illustrationReplace)}"` : ''}
               data-style-width="${c.style?.width || ''}"
               data-style-height="${c.style?.height || ''}"
               data-style-top="${c.style?.top || ''}"
               data-style-left="${c.style?.left || ''}"
               data-step="0" 
               src="${formatImagePath(c.images[0])}"/>
        </div>
        <div class="costume-icon">
            <img alt="Rareté" src="${formatImagePath(c.rareteIcon || 'assets/images/rarete/normal_costume.webp')}"/>
        </div>
        <p class="costume-name">${c.nom}</p>
      </div>
    `).join('');

  gallery.innerHTML = costumesHTML;
}

// Fonction setupCostumePopup réécrite pour correspondre au nouveau HTML
function setupCostumePopup() {
  const btnCostume = document.querySelector('.btn-costume');
  const popupCostume = document.getElementById('popup-costume'); // Corrigé pour correspondre à l'ID HTML
  const closePopup = document.getElementById('close-popup'); // ID direct

  if (btnCostume && popupCostume) {
    btnCostume.addEventListener('click', (e) => {
      e.preventDefault();
      popupCostume.style.display = 'flex';
    });
  }

  if (closePopup && popupCostume) {
    closePopup.addEventListener('click', () => {
      popupCostume.style.display = 'none';
    });
  }

  // Corrigé pour utiliser la variable popupCostume directement
  if (popupCostume) {
    window.addEventListener('click', (e) => {
      if (e.target === popupCostume) {
        popupCostume.style.display = 'none';
      }
    });
  }

  // Réactiver les event listeners pour les cycles d'images dans le popup
  // checkIndividualChanges() devrait être appelé ici si nécessaire
}

function setupImageCycles(cookieData) {
  // La logique existante pour gérer le clic sur les images (cycle) doit être réappliquée
  // car les éléments viennent d'être créés dynamiquement.
  // On suppose qu'il existe une fonction globale ou on réimplémente le listener ici

  const illustration = document.querySelector('.illustration-cookie img');
  if (illustration) {
    // Ajoute un listener 'load' pour appliquer dynamiquement les styles à chaque changement de src
    illustration.addEventListener('load', () => {
      applyIllustrationStyles();
    });
    // Si l'image est déjà chargée (cache), on applique tout de suite
    if (illustration.complete) {
      applyIllustrationStyles();
    }
  }

  document.querySelectorAll('.garniture-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle, .ascension-cycle, .bonbon-cycle, .costume-toggle').forEach(element => {
    // Restaure l'état sauvegardé au chargement
    const id = element.dataset.id;
    const savedStep = id ? getEtatForId(id) : null;
    const images = JSON.parse(element.dataset.images || '[]');
    if (savedStep !== null && !isNaN(savedStep) && images[savedStep]) {
      element.dataset.step = savedStep;
      element.src = images[savedStep];
    }
    element.addEventListener('click', function () {
      let step = parseInt(this.dataset.step || 0);
      if (images.length > 1) {
        step = (step + 1) % images.length;
        this.dataset.step = step;
        this.src = images[step];
        // Sauvegarde l'état (nouvelle clé)
        if (id) saveEtatForId(id, step);

        // Synchronisation Supabase pour les "builds" (si ce n'est pas un costume)
        if (!this.classList.contains('costume-toggle')) {
          const page = document.getElementById('page-cookie');
          const cookieId = page?.getAttribute('data-cookie-id') || window.cookieId;
          if (cookieId && id) {
            saveBuildToSupabase(cookieId, id, step);
          }
        }
      }
      // Costume : gestion illustration
      const illustration = document.querySelector('.illustration-cookie img');
      let illustrationChanged = false;

      // Nettoyage préalable des styles pour éviter les conflits
      if (illustration) {
        delete illustration.dataset.styleWidth;
        delete illustration.dataset.styleHeight;
        delete illustration.dataset.styleTop;
        delete illustration.dataset.styleLeft;
        delete illustration.dataset.costumeName;
      }

      if (this.classList.contains('costume-toggle')) {
        const costumeName = this.alt?.toLowerCase() || '';
        const currentImageSrc = images[parseInt(this.dataset.step || 0)]?.toLowerCase() || '';
        // Correction : éviter les faux positifs si l'URL contient "nb" par hasard (ex: .../v123456/nb... )
        // On cherche "_nb" ou "(nb)" ou " nb" spécifiquement
        const isNB = costumeName.includes('(nb)') || costumeName.includes(' nb') ||
          currentImageSrc.includes('_nb.') || currentImageSrc.includes('_nb_');

        const page = document.getElementById('page-cookie');
        const cookieId = page?.getAttribute('data-cookie-id') || window.cookieId;

        if (isNB && illustration) {
          // Si on repasse en NB, on vérifie si c'était l'illustration active
          const currentIllustration = illustration.src;
          const isThisCostumeActive = currentIllustration === this.dataset.illustrationReplace;

          if (isThisCostumeActive && window._cookieOriginalImage) {
            console.log('[Costume] Désactivation de l\'illustration active, retour à l\'original...');
            illustration.src = window._cookieOriginalImage;
            illustrationChanged = true;

            if (cookieId) {
              saveSelectionToSupabase(cookieId, null);
              localStorage.removeItem(`cookie-illustration:${cookieId}`);
            }
          }
        } else if (this.dataset.illustrationReplace && illustration) {
          // Si on passe en Couleur, on définit comme illustration active
          illustration.src = this.dataset.illustrationReplace;
          illustrationChanged = true;

          if (cookieId) {
            saveCookieIllustration(cookieId, this.dataset.illustrationReplace);
            // Synchronisation Supabase avec la colonne costume_id
            saveSelectionToSupabase(cookieId, this.dataset.id);

            // Set data attribute for styling
            if (this.alt) {
              illustration.dataset.costumeName = this.alt.toLowerCase();
            }
            illustration.dataset.styleWidth = this.dataset.styleWidth || '';
            illustration.dataset.styleHeight = this.dataset.styleHeight || '';
            illustration.dataset.styleTop = this.dataset.styleTop || '';
            illustration.dataset.styleLeft = this.dataset.styleLeft || '';

            console.log('[Costume] Nouvelle illustration active :', {
              id: this.dataset.id,
              name: this.alt
            });
          }
        }
      }
      else if (this.dataset.illustrationReplace && illustration) {
        illustration.src = this.dataset.illustrationReplace;
        illustrationChanged = true;
      }
      // Réapplique les styles dynamiques si l'illustration a changé
      if (illustrationChanged) {
        applyIllustrationStyles();
      }
    });
  });
}

// --- GESTION DE LA PAGE D'ACCUEIL (INDEX) ---
async function initHomePage() {
  const container = document.querySelector(".cartes-cookies");
  if (!container) return;

  try {
    const response = await fetch(`assets/data/maj.json?t=${Date.now()}`);
    if (!response.ok) throw new Error("Impossible de charger maj.json");

    const data = await response.json();

    // Trie par date décroissante
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Ne garder que les 24 plus récents
    const recentCookies = data.slice(0, 24);

    // Récupérer les données Supabase pour ces cookies (pour l'image "carte" et l'ID)
    const cookieNames = recentCookies.map(c => c.nom).filter(n => n);

    let supabaseMap = {};
    if (cookieNames.length > 0) {
      try {
        const { data: supabaseCookies, error } = await supabase
          .from('cookies')
          .select('nom, carte, id, slug')
          .in('nom', cookieNames);

        if (!error && supabaseCookies) {
          supabaseCookies.forEach(sc => {
            if (sc.nom) supabaseMap[sc.nom.toLowerCase()] = sc;
          });
          console.log("Données Homepage chargées depuis Supabase pour", supabaseCookies.length, "cookies.");
        }
      } catch (err) {
        console.warn("Erreur chargement Supabase Homepage:", err);
      }
    }

    container.innerHTML = ""; // Nettoyer

    recentCookies.forEach(cookie => {
      const sbData = cookie.nom ? supabaseMap[cookie.nom.toLowerCase()] : null;

      const link = document.createElement("a");
      // Priorité au lien généré via ID/Slug Supabase, sinon lien JSON
      if (sbData && (sbData.id || sbData.slug)) {
        link.href = `pages/cookie_detail.html?id=${sbData.id || sbData.slug}`;
      } else {
        // Gestion lien JSON (relatif ou absolu)
        if (cookie.link.startsWith('http')) {
          link.href = cookie.link;
        } else {
          link.href = "pages/" + cookie.link;
        }
      }
      link.className = "carte-cookie-wrapper";

      const img = document.createElement("img");
      let finalImageSrc = "";


      // Logique de priorité intelligente :
      // 1. Si Supabase a une URL absolue (Cloudinary/Storage), c'est la source de vérité.
      // 2. Si le JSON a une URL absolue (Correction manuelle/Patch), ça l'emporte sur un chemin local Supabase potentiellement cassé.
      // 3. Sinon, on utilise Supabase (Chemin local)
      // 4. Enfin, fallback sur JSON (Chemin local)

      const sbHasAbsolute = sbData && sbData.carte && sbData.carte.startsWith('http');
      const jsonHasAbsolute = cookie.image && cookie.image.startsWith('http');

      if (sbHasAbsolute) {
        finalImageSrc = sbData.carte;
      } else if (jsonHasAbsolute) {
        finalImageSrc = cookie.image;
      } else if (sbData && sbData.carte) {
        // Chemin local Supabase
        let cartePath = sbData.carte;
        if (!cartePath.startsWith('assets/') && !cartePath.startsWith('/')) {
          cartePath = "assets/images/" + cartePath;
        }
        finalImageSrc = cartePath;
      } else {
        // Fallback JSON local
        if (cookie.image) {
          finalImageSrc = cookie.image.startsWith('assets/') ? cookie.image : "assets/images/" + cookie.image;
        }
      }

      img.src = finalImageSrc;

      img.alt = cookie.nom || "Cookie";
      img.className = "carte-cookie";

      link.appendChild(img);

      // Afficher l'icône NEW ou UP selon le type et la date
      const cookieDate = new Date(cookie.date);
      const today = new Date();
      const daysDifference = Math.floor((today - cookieDate) / (1000 * 60 * 60 * 24));

      if (daysDifference <= 20 && cookie.type) {
        const icon = document.createElement("img");
        if (cookie.type === "new") {
          icon.src = "assets/images/icones/icon_new.webp";
          icon.alt = "New";
        } else if (cookie.type === "update") {
          icon.src = "assets/images/icones/icon_up.webp";
          icon.alt = "Update";
        }
        icon.className = "icon-new";
        link.appendChild(icon);
      }

      container.appendChild(link);
    });

    // Réattacher les événements de boutons après le rendu des cartes
    setupButtonAnimations();

  } catch (error) {
    console.error("Erreur initHomePage:", error);
  }
}

// --- ANIMATION DES BOUTONS (MIGRÉ DE INDEX.JS) ---
function setupButtonAnimations() {
  const buttons = document.querySelectorAll('.btn, .carte-cookie-wrapper');
  buttons.forEach(button => {
    // Éviter les doublons
    if (button.dataset.animAttached) return;
    button.dataset.animAttached = "true";

    button.addEventListener('click', function (e) {
      if (this.tagName === 'A' && this.href && !this.href.startsWith('#')) {
        e.preventDefault();
        const href = this.href;
        setTimeout(() => {
          window.location.href = href;
        }, 150);
      }
    });
  });
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
  setupButtonAnimations();
});

// Relancer au chargement du header pour les boutons du menu
document.addEventListener('headerLoaded', setupButtonAnimations);
