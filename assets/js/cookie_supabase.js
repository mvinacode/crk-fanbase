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

if (cookieId === 'cookie-temeraire') {
  cookieId = 'fa4da28e-bff9-441e-b466-a6464c1d266a';
}

if (cookieId === 'cookie-fraise') {
  cookieId = '9a419714-296e-449f-815c-1842448d7234';
}

if (cookieId === 'cookie-sorcier') {
  cookieId = 'b01c71b1-19b0-46ff-894f-f22d3008f585';
}

if (cookieId === 'cookie-ninja') {
  cookieId = '6f0371f8-a990-46f5-83b5-fcb476744825';
}

if (cookieId === 'cookie-ange') {
  cookieId = 'fbe1a5be-bfac-44af-b1a1-10446abf35b0';
}

if (cookieId === 'cookie-costaud') {
  cookieId = '5b3df6bd-fb10-4538-9e2f-b6d85c5d8eb7';
}

if (cookieId === 'cookie-aventurier') {
  cookieId = 'c94ab484-756e-40dd-9451-da840179f983';
}

if (cookieId === 'cookie-alchimiste') {
  cookieId = 'e2dfc10a-4f2a-4ce8-9c5d-6bb18e0ff5ca';
}

if (cookieId === 'cookie-avocat') {
  cookieId = '8f0007c7-0641-455e-b184-3d41569e85d5';
}

if (cookieId === 'cookie-betterave') {
  cookieId = '09dfe6bb-6a87-4984-8afb-96b94444c08d';
}

if (cookieId === 'cookie-mure') {
  cookieId = '806edfc7-e9c6-4f31-9797-2e9455f6544e';
}

if (cookieId === 'cookie-carotte') {
  cookieId = '9d9bd274-c85b-4b4e-b6dc-9b5115b87471';
}

if (cookieId === 'cookie-cerise') {
  cookieId = '638e6269-caad-4d3b-ab53-c0ea87e4034a';
}

if (cookieId === 'cookie-piment') {
  cookieId = 'ac08d696-014e-4ad7-9510-e5ac5a47d7ea';
}

if (cookieId === 'cookie-trefle') {
  cookieId = '33d1bacf-7921-4f3d-a95c-5f44cc92de90';
}

if (cookieId === 'cookie-creme-patissiere-iii') {
  cookieId = 'dd1be758-122d-4597-86e7-bb4b2b61718c';
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

// Charger les données du cookie depuis Supabase
async function loadCookieData() {
  try {
    // Récupérer le cookie depuis Supabase
    console.log("Tentative de chargement pour ID:", cookieId);

    // Récupération intelligente : par ID (UUID) ou par Slug
    let cookieData = null;
    let error = null;
    let response;

    // Si l'ID ressemble à un UUID, on cherche par ID, sinon par slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cookieId);

    if (isUuid) {
      response = await supabase
        .from('cookies')
        .select('*')
        .eq('id', cookieId)
        .maybeSingle();
      cookieData = response.data;
      error = response.error;
    } else {
      console.log("ID n'est pas un UUID, on cherche par slug:", cookieId);
      // Tentative par slug
      response = await supabase
        .from('cookies')
        .select('*')
        .eq('slug', cookieId)
        .maybeSingle();

      cookieData = response.data;
      error = response.error;

      // FALLBACK : Si la colonne slug n'existe pas ou si rien n'est trouvé
      // On tolère l'erreur de colonne inexistante (42703 en PostgreSQL)
      if (!cookieData || (error && (error.code === '42703' || error.message.includes('slug')))) {
        console.log("Recherche par slug échouée ou colonne absente, tentative via cookies.json + recherche par nom...");
        try {
          const localResponse = await fetch('../assets/data/cookies.json');
          if (localResponse.ok) {
            const localCookies = await localResponse.json();
            // On cherche le cookie qui a cet ID dans le JSON (ex: "cookie-fraise")
            const localEntry = localCookies.find(c =>
              c.id === cookieId ||
              (c.nom && c.nom.toLowerCase().replace(/\s+/g, '-') === cookieId.toLowerCase())
            );

            if (localEntry) {
              console.log("Correspondance trouvée dans cookies.json:", localEntry.nom);
              // On tente une recherche par nom exact dans Supabase
              const nameResponse = await supabase
                .from('cookies')
                .select('*')
                .ilike('nom', localEntry.nom)
                .maybeSingle();

              if (nameResponse.data) {
                console.log("Cookie trouvé en base via son nom !");
                cookieData = nameResponse.data;
                error = null;
              } else {
                console.log("Cookie non trouvé en base sous ce nom, utilisation des données locales.");
                cookieData = localEntry;
                error = null;
              }
            }
          }
        } catch (localErr) {
          console.error("Erreur lors du fallback local:", localErr);
        }
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
    cookieData.toppings = await fetchCategoryData('toppings', ['topping1', 'topping2', 'topping3', 'topping4', 'topping5'], 'Garniture');
    cookieData.tartelettes = await fetchCategoryData('tartelettes', ['tartelette1', 'tartelette2', 'tartelette3', 'tartelette4', 'tartelette5'], 'Tartelette');
    cookieData.biscuits = await fetchCategoryData('biscuits', ['biscuit1', 'biscuit2', 'biscuit3'], 'Biscuit');
    cookieData.promotions = await fetchCategoryData('promotions', ['promotion1', 'promotion2', 'promotion3', 'promotion4', 'promotion5'], 'Promotion');

    // Pour l'ascension, la structure est un peu différente dans cookieData
    const ascensionItems = await fetchCategoryData('ascension', ['ascension'], 'Ascension');
    cookieData.ascension = { etoiles: ascensionItems };

    // --- Récupération de tous les costumes (table "costumes") ---
    let costumesResponse = await supabase
      .from('costumes')
      .select('*')
      .eq('cookie_id', cookieData.id);

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
          illustrationReplace: costumeRow.illustrationReplace || null,
          rareteIcon: costumeRow.rareteIcon || null
        };
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
    let localNavigation = {};
    try {
      // Ajout d'un timestamp pour éviter le cache du navigateur
      const navResponse = await fetch(`../assets/data/navigation.json?t=${Date.now()}`);
      if (navResponse.ok) {
        localNavigation = await navResponse.json();
      }
    } catch (e) {
      console.warn('Erreur chargement navigation.json:', e);
    }

    // Fusionner la navigation (Local + Supabase)
    const cookieNav = {
      ...(localNavigation[cookieData.id] || localNavigation[urlParams.get('id')] || {}),
      ...(cookieData.navigation || {})
    };
    cookieData.navigation = cookieNav;

    // --- RÉCUPÉRATION DE LA SÉLECTION SUPABASE (Optionnel si connecté) ---
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      console.log('[DEBUG] Utilisateur connecté:', authData.user.id);
      const { data: userSelection, error: selectError } = await supabase
        .from('cookies_users')
        .select('costume_id, builds')
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

// Applique dynamiquement les styles d'illustration selon le nom ou l'URL de l'image
function applyIllustrationStyles() {
  const img = document.querySelector('.illustration-cookie img');
  if (!img) return;
  // Réinitialise les styles
  img.style.width = '';
  img.style.height = '';
  img.style.left = '';
  img.style.top = '';

  // Règles dynamiques selon le nom ou l'URL
  const src = img.src.toLowerCase();
  console.log('[applyIllustrationStyles] src:', src);
  if (src.includes('gentleman')) {
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '380px';
    img.style.top = '300px';
  } else if (src.includes('anniversaire')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '270px';
    img.style.top = '140px';
  } else if (src.includes('empereur') || src.includes('celeste')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '280px';
    img.style.top = '100px';
  } else if (src.includes('baie') || src.includes('verte')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '250px';
    img.style.top = '120px';
  } else if (src.includes('sorcier') && src.includes('gnome')) {
    // Cas SPÉCIFIQUE : Cookie Sorcier en costume Gnome (Garde la taille normale)
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '260px';
    img.style.top = '190px';
  } else if (src.includes('gnome')) {
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '350px';
    img.style.top = '300px';
  } else if (src.includes('hiver') || src.includes('chaud')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '270px';
    img.style.top = '140px';
  } else if (src.includes('fete') || src.includes('preparee')) {
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '400px';
    img.style.top = '350px';
  } else if (src.includes('cache') || src.includes('ombre')) {
    console.warn('[applyIllustrationStyles] Applying Ninja Costume (Cache) styles for:', src);
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '350px';
    img.style.top = '320px';
  } else if (src.includes('cookie_ninja') || (src.includes('ninja') && src.includes('original'))) {
    console.warn('[applyIllustrationStyles] Applying Ninja styles for:', src);
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '200px';
    img.style.top = '140px';
  } else if (src.includes('chef') || src.includes('chœur')) {
    console.warn('[applyIllustrationStyles] Applying Ange Costume (Cache) styles for:', src);
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '390px';
    img.style.top = '360px';
  } else if (src.includes('pull')) {
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '380px';
    img.style.top = '340px';
  } else if (src.includes('camouflage') || src.includes('jungle')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '300px';
    img.style.top = '120px';
  } else if (src.includes('erreur') || src.includes('debutant')) {
    console.warn('[applyIllustrationStyles] Applying Alchimiste Costume (Erreur) styles for:', src);
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '380px';
    img.style.top = '360px';
  } else if (src.includes('cookie_alchimiste') || (src.includes('alchimiste') && src.includes('original'))) {
    console.warn('[applyIllustrationStyles] Applying Alchimiste styles for:', src);
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '270px';
    img.style.top = '150px';
  } else if (src.includes('chasseuse') || src.includes('occasionnelle')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '310px';
    img.style.top = '110px';
  } else if (src.includes('fermiere') || src.includes('fashionista')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '280px';
    img.style.top = '110px';
  } else if (src.includes('explosion') || src.includes('bombe')) {
    console.warn('[applyIllustrationStyles] Applying Cerise Costume (Explosion) styles for:', src);
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '280px';
    img.style.top = '150px';
  } else if (src.includes('poches') || src.includes('chance')) {
    console.warn('[applyIllustrationStyles] Applying Cerise Costume (Poches) styles for:', src);
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '290px';
    img.style.top = '150px';
  } else if (src.includes('cookie_cerise') || (src.includes('cerise') && src.includes('original'))) {
    console.warn('[applyIllustrationStyles] Applying Cerise styles for:', src);
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '240px';
    img.style.top = '120px';
  } else if (src.includes('prisonniere') || src.includes('evasion')) {
    console.warn('[applyIllustrationStyles] Applying Piment Costume (Prisonnière) styles for:', src);
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.left = '380px';
    img.style.top = '320px';
  } else if (src.includes('cookie_piment') || (src.includes('piment') && src.includes('original'))) {
    console.warn('[applyIllustrationStyles] Applying Piment styles for:', src);
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '270px';
    img.style.top = '160px';
  } else if (src.includes('vagabond') || src.includes('automne')) {
    img.style.width = '412px';
    img.style.height = '444px';
    img.style.left = '250px';
    img.style.top = '100px';
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
  if (data.nom && (data.nom.includes('Crème Pâtissière') || data.nom.includes('creme patissiere'))) {
    root.style.setProperty('--title-size', '70px');
  } else {
    root.style.removeProperty('--title-size');
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

  // 1. Priorité Supabase (si l'info a été injectée par loadCookieData)
  if (data.activeCostumeId) {
    const active = data.costumes?.find(c => c.id === data.activeCostumeId);
    if (active && active.illustrationReplace) {
      costumeIllustration = formatImagePath(active.illustrationReplace);
      console.log('[Costume] Priorité 1 : Restauration depuis Supabase (actif):', costumeIllustration);
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
    }
  }

  if (!costumeIllustration && !getCookieIllustration(data.id)) {
    console.log('[Costume] Aucune sauvegarde trouvée, affichage illustration défaut.');
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

  const cookieHTML = `
  <div class="bloc-fond-cookie">
   <div class="fond-floute"></div>
   <h1 class="nom-cookie">${data.nom}</h1>
   
   <div class="badges">
     ${(() => {
      // Support des deux formats : colonnes directes (rarete, classe, element) OU format JSON (badges.rarete, etc.)
      const rarete = data.rarete || data.badges?.rarete || '';
      const classe = data.classe || data.badges?.classe || '';
      const element = data.element || data.badges?.element || null;

      // Ne pas afficher les badges vides pour éviter les espaces
      let badgesHTML = '';
      if (rarete) badgesHTML += `<img alt="Rareté" class="badge" src="${formatImagePath(rarete)}"/>`;
      if (classe) badgesHTML += `<img alt="Classe" class="badge" src="${formatImagePath(classe)}"/>`;
      if (element) badgesHTML += `<img alt="Élément" class="badge" src="${formatImagePath(element)}"/>`;

      return badgesHTML;
    })()}
   </div>
  </div>
  
  <div class="illustration-cookie">
    <img alt="${data.nom}" src="${currentIllustration}"/>
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

 <div class="tartelettes">
    ${(data.tartelettes || []).map(t => `
        <img alt="${t.nom || 'Tartelette'}" class="tartelette-cycle" 
             data-id="${t.id}" 
             data-images='${safeJsonStringify(t.images)}' 
             data-step="${t.selectedStep || 0}" 
             src="${formatImagePath(t.images ? t.images[t.selectedStep || 0] : '')}"/>
    `).join('')}
 </div>

 <div class="biscuits ${data.nom && data.nom.includes('Sorcier') ? 'biscuits-sorcier' : ''} ${data.nom && data.nom.includes('Costaud') ? 'biscuits-costaud' : ''} 
 ${data.nom && data.nom.includes('Alchimiste') ? 'biscuits-alchimiste' : ''} ${data.nom && data.nom.includes('Avocat') ? 'biscuits-avocat' : ''} ${data.nom && data.nom.includes('Betterave') ? 'biscuits-betterave' : ''}
 ${data.nom && (data.nom.includes('Mure') || data.nom.includes('Mûre')) ? 'biscuits-mure' : ''} ${data.nom && data.nom.includes('Carotte') ? 'biscuits-carotte' : ''} 
 ${data.nom && data.nom.includes('Cerise') ? 'biscuits-cerise' : ''} ${data.nom && data.nom.includes('Piment') ? 'biscuits-piment' : ''}">
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

  <a class="btn-costume" href="#"><span>Costumes</span></a>
  ${data.navigation?.precedent ? `<a href="cookie_detail.html?id=${data.navigation.precedent}" class="btn-cookie-precedent"><span>Cookie précédent</span></a>` : ''}
  ${data.navigation?.suivant ? `<a href="cookie_detail.html?id=${data.navigation.suivant}" class="btn-cookie-suivant"><span>Cookie suivant</span></a>` : ''}
 
  `;

  if (pageContainer) {
    pageContainer.innerHTML = cookieHTML;
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
  }

  document.querySelectorAll('.garniture-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle, .ascension-cycle, .costume-toggle').forEach(element => {
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
      if (this.classList.contains('costume-toggle')) {
        const costumeName = this.alt?.toLowerCase() || '';
        const isNB = costumeName.includes('nb') || (images[parseInt(this.dataset.step || 0)]?.toLowerCase().includes('nb'));

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

    // Ne garder que les 22 plus récents
    const recentCookies = data.slice(0, 22);

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

      if (daysDifference <= 30 && cookie.type) {
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
