import { supabase } from './app.js';

// Charger le header
fetch('../includes/header_cookie.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

// Récupérer l'ID du cookie depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
// Utilise l'UUID fourni par défaut si aucun paramètre dans l'URL
const cookieId = urlParams.get('id') || 'fa4da28e-bff9-441e-b466-a6464c1d266a';

// Fonction pour charger dynamiquement un fichier CSS
function loadCSS(filename) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `../assets/css/${filename}`;
  link.id = 'dynamic-cookie-css';
  document.head.appendChild(link);
}

// Charger les données du cookie depuis Supabase
async function loadCookieData() {
  try {
    // Récupérer le cookie depuis Supabase
    console.log("Tentative de chargement pour ID:", cookieId);

    // Essai sur la table "Cookies" (majuscule) avec colonne "uuid"
    let response = await supabase
      .from('Cookies')
      .select('*')
      .eq('uuid', cookieId) // On teste 'uuid' car vous l'avez mentionné
      .maybeSingle();

    // Si ça échoue (table introuvable), on tente la table minuscule "cookies"
    if (response.error && response.error.code === '42P01') {
      console.warn("Table 'Cookies' (Maj) introuvable, essai 'cookies' (min)...");
      response = await supabase
        .from('cookies')
        .select('*')
        .eq('uuid', cookieId)
        .maybeSingle();
    }

    // Si erreur de colonne (42703), on tente avec 'id' au lieu de 'uuid'
    if (response.error && response.error.code === '42703') {
      console.warn("Colonne 'uuid' introuvable, essai avec 'id'...");
      // On re-tente avec id sur Cookies Maj
      response = await supabase.from('Cookies').select('*').eq('id', cookieId).maybeSingle();
      // Si table fail, on tente id sur cookies min
      if (response.error && response.error.code === '42P01') {
        response = await supabase.from('cookies').select('*').eq('id', cookieId).maybeSingle();
      }
    }

    // Extraction finale
    let { data: cookieData, error } = response;

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    if (!cookieData) {
      throw new Error('Cookie non trouvé');
    }

    console.log('✅ Données Cookie chargées:', cookieData);

    // --- NOUVEAU : Récupération des Costumes depuis la table séparée 'costumes' ---
    console.log("Tentative de chargement des costumes pour cookie_id:", cookieData.uuid || cookieData.id);

    // On cherche les costumes liés à ce cookie
    // On force la minuscule 'costumes' comme demandé
    let costumesResponse = await supabase
      .from('costumes') // Table en minuscule explicite
      .select('*')
      .eq('cookie_id', cookieData.uuid || cookieData.id) // Utilise l'UUID du cookie trouvé précédemment
      .order('nom');

    // Tentative de fallback Majuscule au cas où, pour robustesse
    if (costumesResponse.error && costumesResponse.error.code === '42P01') {
      console.warn("Table 'costumes' (min) introuvable, essai 'Costumes' (Maj)...");
      costumesResponse = await supabase
        .from('Costumes')
        .select('*')
        .eq('cookie_id', cookieData.uuid || cookieData.id);
    }

    // Si on a des costumes, on les injecte dans l'objet cookie pour l'affichage
    if (costumesResponse.data && costumesResponse.data.length > 0) {
      console.log(`✅ ${costumesResponse.data.length} costumes trouvés`);
      // Adaptation du format DB vers format Attendu par le render
      cookieData.costumes = costumesResponse.data.map(c => ({
        id: c.id,
        nom: c.nom,
        // Si 'image' est stocké en JSON string ou array
        images: Array.isArray(c.image) ? c.image : (typeof c.image === 'string' && c.image.startsWith('[') ? JSON.parse(c.image) : [c.image]),
        rareteIcon: c.rareteIcon,
        illustrationReplace: c.illustrationReplace
      }));
    } else {
      console.log("⚠️ Aucun costume trouvé dans la table 'Costumes' (ou erreur si JSON utilisé avant)");
      if (!cookieData.costumes) cookieData.costumes = []; // Sécurité
    }
    // -----------------------------------------------------------------------------

    // Changer le titre de la page
    document.title = cookieData.pageTitle || cookieData.nom;

    // Changer la favicon (icône de l'onglet)
    if (cookieData.icon_tete) {
      const favicon = document.querySelector("link[rel='icon']");
      if (favicon) {
        // Si c'est une URL absolue (commence par http), on l'utilise telle quelle
        if (cookieData.icon_tete.startsWith('http')) {
          favicon.href = cookieData.icon_tete;
        } else {
          // Sinon on traite comme un chemin relatif local
          favicon.href = cookieData.icon_tete.startsWith('../') ? cookieData.icon_tete : '../' + cookieData.icon_tete;
        }
      }
    }

    // Charger le CSS dynamique unique
    loadCSS('cookie_dynamic.css');

    // Appliquer le thème dynamique (Couleurs, Backgrounds)
    applyDynamicTheme(cookieData);

    // Ancien système de fichier CSS spécifique (Desactivé pour le dynamique)
    /* 
    const cssToLoad = cookieData.cssFile || 'cookie_temeraire.css';
    console.log("Chargement du CSS :", cssToLoad);
    loadCSS(cssToLoad); 
    */

    renderCookie(cookieData);
    renderCostumes(cookieData.costumes);

    // Attendre que le DOM soit mis à jour avant d'attacher les événements
    setTimeout(() => {
      setupImageCycles();
      setupCostumePopup();
    }, 0);

  } catch (error) {
    console.error('Erreur chargement données:', error);
    // Afficher l'erreur détaillée sur la page pour le debug
    const errorMsg = error.message || JSON.stringify(error);
    document.getElementById('page-cookie').innerHTML = `
        <div style="text-align: center; color: white; margin-top: 50px; padding: 20px;">
            <h2 style="color: #ff6b6b;">Oups ! Erreur de chargement</h2>
            <p>Impossible de récupérer les données du cookie.</p>
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px; margin: 20px auto; max-width: 600px; text-align: left; font-family: monospace;">
                <strong>Détails :</strong> ${errorMsg}<br>
                <strong>Code :</strong> ${error.code || 'N/A'}<br>
                <strong>Hint :</strong> ${error.hint || 'Aucun indice'}<br>
            </div>
            <p><em>Vérifiez la console du navigateur (F12) pour plus d'infos.</em></p>
        </div>
    `;
  }
}

// Lancer le chargement
loadCookieData();

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
  if (data.bg_color) root.style.setProperty('--bg-color', data.bg_color);
  if (data.bg_image) {
    // Gérer images relatives ou absolues
    const bgUrl = data.bg_image.startsWith('http') || data.bg_image.startsWith('..')
      ? `url("${data.bg_image}")`
      : `url("../${data.bg_image}")`;
    root.style.setProperty('--bg-image', bgUrl);
  }

  // 3. Titre
  if (data.title_color) root.style.setProperty('--title-color', data.title_color);

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
  const pageContainer = document.getElementById('page-cookie');

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
  const cookieHTML = `
  <div class="bloc-fond-cookie">
   <div class="fond-floute"></div>
   <h1 class="nom-cookie">${data.nom}</h1>
  </div>
  
  <div class="illustration-cookie">
    <img alt="${data.nom}" src="../${data.illustration}"/>
  </div>

  <div class="badges">
    <img alt="Rareté" class="badge" src="../${data.badges?.rarete || ''}"/>
    <img alt="Classe" class="badge" src="../${data.badges?.classe || ''}"/>
    ${data.badges?.element ? `<img alt="Élément" class="badge" src="../${data.badges.element}"/>` : '<img class="badge" src=""/>'}
  </div>

  <div class="toppings">
    ${(data.toppings || []).map((t, i) => `
        <img alt="${t.nom}" class="garniture-cycle" 
             data-id="${t.id}" 
             data-images='${safeJsonStringify(t.images)}' 
             data-step="0" 
             src="../${t.images ? t.images[0] : ''}"/>
    `).join('')}
 </div>

 <div class="tartelettes">
    ${(data.tartelettes || []).map(t => `
        <img alt="${t.nom}" class="tartelette-cycle" 
             data-id="${t.id}" 
             data-images='${safeJsonStringify(t.images)}' 
             data-step="0" 
             src="../${t.images ? t.images[0] : ''}"/>
    `).join('')}
 </div>

 <div class="biscuits">
    ${(data.biscuits || []).map(b => `
        <img alt="${b.nom}" class="biscuit-cycle" 
             data-id="${b.id}" 
             data-images='${safeJsonStringify(b.images)}'
             data-step="0" 
             src="../${b.images ? b.images[0] : ''}"/>
    `).join('')}
 </div>

 <div class="promotion">
    ${(data.promotions || []).map(p => `
        <img alt="Promotion" class="promotion-cycle" 
             data-id="${p.id}" 
             data-images='${safeJsonStringify(p.images)}'
             data-step="0" 
             src="../${p.images ? p.images[0] : ''}"/>
    `).join('')}
 </div>

 <div class="ascension">
    ${(data.ascension?.etoiles || []).map(a => `
        <img alt="Ascension" class="ascension-cycle" 
             data-id="${a.id}" 
             data-images='${safeJsonStringify(a.images)}'
             data-step="0" 
             src="../${a.images ? a.images[0] : ''}"/>
    `).join('')}
 </div>

 <a class="btn-costume" href="#">Costumes</a>
 ${data.navigation?.precedent ? `<a href="cookie_detail.html?id=${data.navigation.precedent}" class="btn-cookie-precedent"><span>Cookie précédent</span></a>` : ''}
 ${data.navigation?.suivant ? `<a href="cookie_detail.html?id=${data.navigation.suivant}" class="btn-cookie-suivant"><span>Cookie suivant</span></a>` : ''}
 <button class="btn-save" id="btn-save">Sauvegarder</button>
  `;

  pageContainer.innerHTML = cookieHTML;
}

// Aide pour convertir les tableaux JSON en string pour data-images
function safeJsonStringify(obj) {
  if (!obj) return '[]';
  // On ajoute le préfixe ../ si nécessaire, ici on suppose que les chemins dans JSON sont relatifs à la racine
  // Mais dans le HTML original, les tableaux contiennent "../assets/..."
  // Si vos données DB ont "assets/...", ajoutez le "../" ici
  const fixedPaths = obj.map(p => p.startsWith('../') ? p : '../' + p);
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
        <img alt="${c.nom}" class="costume-toggle" 
             data-id="${c.id || 'costume-' + Math.random()}" 
             data-images='${safeJsonStringify(c.images)}'
             ${c.illustrationReplace ? `data-illustration-replace="../${c.illustrationReplace}"` : ''}
             data-step="0" 
             src="../${c.images[0]}"/>
        <div class="costume-icon">
            <img alt="Rareté" src="../${c.rareteIcon || 'assets/images/rarete/normal_costume.webp'}"/>
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

function setupImageCycles() {
  // La logique existante pour gérer le clic sur les images (cycle) doit être réappliquée
  // car les éléments viennent d'être créés dynamiquement.
  // On suppose qu'il existe une fonction globale ou on réimplémente le listener ici

  document.querySelectorAll('.garniture-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle, .ascension-cycle, .costume-toggle').forEach(element => {
    element.addEventListener('click', function () {
      // Logique de changement d'image
      // Pour l'instant simple toggle pour l'exemple
      const images = JSON.parse(this.dataset.images || '[]');
      if (images.length > 1) {
        let step = parseInt(this.dataset.step || 0);
        step = (step + 1) % images.length;
        this.dataset.step = step;
        this.src = images[step]; // Déjà préfixé par safeJsonStringify
      }

      // Si c'est un costume avec illustration de remplacement
      if (this.dataset.illustrationReplace) {
        const illustration = document.querySelector('.illustration-cookie img');
        if (illustration) illustration.src = this.dataset.illustrationReplace;
      }
    });
  });
}

