// Affichage dynamique du user (connexion/déconnexion) sur la page d'accueil
function initUserInfo() {
  const userInfo = document.getElementById('user-info');
  if (!userInfo) return;

  const isDetailPage = !!document.getElementById('page-cookie');
  const loginUrl = isDetailPage ? 'login.html' : 'pages/login.html';

  import('./login_supabase.js').then(({ isLoggedIn, logout }) => {
    import('./app.js').then(({ supabase }) => {
      async function showUser() {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          userInfo.innerHTML = `
            <a href="#" id="logout-btn" class="nav-icon-link">
              <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773164562/deconnexion_u529fl.webp" alt="Déconnexion">
            </a>`;
          const logoutBtn = document.getElementById('logout-btn');
          if (logoutBtn) {
            logoutBtn.onclick = async (e) => {
              e.preventDefault();
              await logout();
              window.location.reload();
            };
          }
        } else {
          userInfo.innerHTML = `
            <a href="${loginUrl}" class="nav-icon-link">
              <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773164563/connexion_p2ilhv.webp" alt="Connexion">
            </a>`;
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
  'cookie-chouquette': 'a8cc42f1-8c98-43ee-9851-76208bc71e00',
  'cookie-amande': '43e3e0ac-0129-40f9-a72b-eeb0b8cf96f8',
  'cookie-vanille-pure': 'c539079c-f705-4e01-83a0-46ceef597e98',
  'cookie-raisin-sec': 'fb2c3d82-4df1-4b0b-a5ad-5e10d8f45310',
  'cookie-crepe-a-la-fraise': '957c7b32-64e1-4f62-a84f-e15486b4e10e',
  'cookie-figue': '5eddb8e7-2757-4175-b4f8-f9743d816200',
  'cookie-patisserie': 'f28d3d9e-2b3d-45cb-8792-50e535e672b7',
  'cookie-red-velvet': 'b5a8de06-efde-48f0-85cc-ef1a26414769',
  'cookie-diablotin': 'b9a16c30-2b55-41a7-92bf-3c3fad13f88b',
  'cookie-mangue': '8901774a-ef65-4c51-b10d-b1323b697a71',
  'cookie-fee-des-mers': 'bc754397-6362-4171-9d7e-3ce890bba255',
  'cookie-lilas': '55d071df-4504-44e2-b90f-b0aeb2d7ab01',
  'cookie-encre-de-seiche': '9eaec7dc-3c7d-4ab3-b66e-cab7da78e62f',
  'cookie-requin-sorbet': 'a0a8476c-c7ec-4328-9117-19756f136006',
  'cookie-parfait': '812272d8-c8f9-41bd-bca5-c71e4cdfd2a6',
  'cookie-baie-de-houx': '9300b136-ab31-4ea5-b65a-6dc17af34c3c',
  'cookie-framboise': 'ae6d7617-891b-4cde-9bfb-b8a12b9b2ec1',
  'cookie-lapin-de-la-lune': '8de64fc6-4335-4c94-8045-f82175b66922',
  'cookie-sonic': 'dbb848d4-4bd6-4ff5-94a5-b16a3945749a',
  'cookie-tails': '282bed3b-8473-4fa5-b539-e507885cb71e',
  'cookie-mala': '85d8c04b-2a26-4724-8960-82f5a9039444',
  'cookie-bonbon-tourbillon': '8fa1f53b-a89a-4a94-9e43-050a8bca3706',
  'cookie-tarte-a-la-citrouille': 'cd51cbcf-a6cd-4368-90a3-4248bae1257b',
  'cookie-coton': 'c4136d63-36ee-4036-87ef-517adaa65add',
  'cookie-reine-de-givre': '25034954-c053-479f-a9a6-0a43c34d484f',
  'cookie-cacao': 'f01f9671-11ba-434a-a7b7-4ee15a87a4fb',
  'cookie-eclair': '1f40f60d-3193-40df-bb19-d7f89593185e',
  'cookie-chevalier-ceylan': '639950ec-8d7a-4d53-8a89-8050b2c027ca',
  'cookie-affogato': 'b43736f0-4ee1-41c1-9552-68609e3d7098',
  'cookie-cacao-noir': 'ca65f53e-1aa0-4367-8017-cee910782ba5',
  'cookie-vergeoise-brune': 'dea4947d-c594-419d-9a78-3325fafde2e4',
  'cookie-fleur-de-cerisier': '42b907d7-7f15-4b10-abed-d46577ce02ec',
  'cookie-creme-fraiche': '55f1e17c-1f98-454d-b5f5-588c8f8ef93b',
  'cookie-baie-sauvage': '2dd10722-c3c1-4cb7-a0e8-611fd12fa99f',
  'cookie-choco-croquant': '128f3a10-c23e-4b86-a772-c76fb5284b62',
  'cookie-huitre': '3979830f-afdd-46fd-80c9-f5b7c816a3d3',
  'cookie-financier': '1d21faed-402c-4743-a44d-51579a3e2126',
  'cookie-licorne-a-la-creme': '795aa9f1-02f8-4dc2-bc42-ffedad971415',
  'cookie-capitaine-caviar': 'ca86f14c-6861-47db-a96e-e90b2c58f68b',
  'cookie-perle-noire': '4322e8e8-d433-4ba3-a5cc-dbd81e378dd4',
  'cookie-bonbon-plongeur': '8abdfeb1-bc8e-405f-9b18-829ff9d9f299',
  'schwarzwalder': 'c7155728-2d16-46a7-9ab0-ec7a2f3f01cb',
  'cookie-jung-kook': '07285106-535e-4cf1-b30a-3c6f63c78666',
  'cookie-v': '242ad7a1-45ab-4faa-a955-64b539a10df7',
  'cookie-jimin': '48a5d856-4866-461c-b587-052c9f5d8acc',
  'cookie-j-hope': '2104f800-74ba-4fae-96f1-b00706e09e75',
  'cookie-suga': 'c4a58656-95eb-4c54-8b98-0fa99e757c80',
  'cookie-jin': 'ae4dfedf-2fb1-49c9-8784-41cb8e24f554',
  'cookie-rm': '5dd97eec-b6c0-4064-8c66-a51e7a9a063c',
  'cookie-macaron': 'a6b9058e-ab92-40cf-ab1e-bfc2622a3739',
  'cookie-sorbet': 'a3390805-88c8-4652-a66b-69bbd9b19c3b',
  'cookie-de-l-avent': 'e6539b9d-8e56-443c-b893-c849dc8548f6',
  'cookie-pomme-de-pin': '4739777f-ca34-42fa-86c7-ee6337a37934',
  'cookie-prophete': '775317af-3307-4695-b996-7a828a39e8ac',
  'cookie-voie-lactee': 'a7cb6699-79d1-4eea-92ba-e17d70e1363a',
  'cookie-clair-de-lune': '960662c1-8f82-4893-9606-9d614080566f',
  'cookie-tarte-aux-myrtilles': '03eec11c-15f7-4530-9837-decf39dff4df',
  'cookie-poussiere-d-etoile': 'b2a8dc03-beb5-4b69-b439-3c020e0bd72b',
  'donut-de-l-espace': 'de406a01-4958-444e-b7d9-73c8b7638101',
  'cookie-capsaicine': '6d23f85b-625a-4023-aef1-666616910292',
  'cookie-jus-de-pruneaux': '6140e47e-6e10-46fd-9147-932ba91ae428',
  'cookie-kouign-amann': '0f56a1ca-abf6-4864-9a99-c034fdb82070',
  'cookie-fruit-du-dragon': '1819829c-b817-447c-aec6-b27a47be014b',
  'cookie-margarine-royale': '18529ba3-97fe-4fdb-8bc1-b5b916131966',
  'cookie-tarte-tatin': '192250a1-b439-48ab-993b-d378348e811d',
  'cookie-sang-dragon': 'bc5efadb-44c9-427b-9f50-95830715bf1f',
  'cookie-paillettes-brillantes': '31f2a398-29b2-4198-ac9d-abb3994c6cf6',
  'cookie-rockstar': '8b516b60-508e-47bd-a64f-1f93cabda7e7',
  'cookie-limonade-noire': 'f2577d95-bb1b-4ee7-a140-8ac45fa392c4',
  'cookie-menthe-poivree': 'e68d19eb-bda1-4bfc-8ede-94c5f7df197d',
  'cookie-corail-carmin': 'b25c981e-0bb9-4932-a723-a8d0d2c72301',
  'cookie-meduse-mousseline': 'd80ab4a8-92c6-4c07-9e08-950e6ab4900c',
  'cookie-fromage-dore': '9bf9c90e-ea0c-4d16-86fb-4d1f585411e9',
  'cookie-tourteau-fromage': '486eb0fc-61c8-4ce0-a704-e0bee0a88a68',
  'cookie-fettuccine': '141eecfd-f254-4869-a3d3-72b57a806603',
  'cookie-mozzarella': '652c366e-1a70-4a48-bb7d-96df9e89beaa',
  'cookie-olive': '6d5ee460-ba12-4d77-886c-067c23c3a33b',
  'cookie-yeti-givre': '99276b8e-8236-4772-bdfe-7e3163b0dc82',
  'cookie-creme-brulee': '72303759-4682-4907-8b85-904cc527def6',
  'cookie-linzer': 'f07056fc-b0cc-46c2-addc-5c4bd7b1fac2',
  'cookie-justicier': '54feab2d-aac1-4fcf-8bd4-8d49e6138061',
  'cookie-lys-blanc': '55b92598-3587-44c5-9eab-a40108e727e6',
  'cookie-muguet': '3f844948-1b47-419e-aeae-f8af0f104931',
  'cookie-chevalier-vif-argent': 'd0fd15e2-186c-4574-a827-5badc2ea2dce',
  'cookie-matcha': '03931bcd-f513-444b-8579-f2e205d504c5',
  'cookie-roi-des-fees': '758cb0a8-8061-4faa-b138-365ff11f00c2',
  'cookie-brioche-beurree': '0a6fe843-87a0-44a2-b322-4206c9e43cec',
  'cookie-saint-honore': 'e8350869-ee95-4a22-be96-d6217feeb7e5',
  'cookie-oursin': 'b31730eb-7a8d-493a-a733-f441449ae8d2',
  'cookie-brise-tonnerre': '9c267ed3-a476-4410-9972-24b7086062b9',
  'cookie-farine-mystique': 'b5be9b79-b330-49c0-bf7f-63d4ccb6b38b',
  'cookie-haetae-des-nuages': 'fba81812-bd0b-4c53-8c25-aab40360f908',
  'cookie-fleur-de-pecher': 'ea00c71d-2d4b-48a1-9e9a-515826fa2f6f',
  'cookie-belette-a-la-creme': '765f7d7f-efd6-48ea-8929-ff3b3b6eec97',
  'cookie-corail-etoile': '9a1c2e43-0c66-4f55-bc1a-23830992ff80',
  'cookie-archer-du-vent': 'aeb7544c-2275-47ce-90e6-802d413854e6',
  'cookie-epices-ardentes': '4ec4899c-0ab3-45d5-a92d-6faa45ad1fbe',
  'cookie-muscade-tigree': '7703b0f0-3bf9-43f9-8b12-954d0636f9cf',
  'cookie-fromage-fume': 'a570531e-56f8-4471-a03b-1119ddacf4d4',
  'cookie-camelia': '2d33aac0-ba9e-4b60-9430-a77136f597c2',
  'cookie-bouton-d-or': '6ea0caa3-92e7-43eb-962a-90eb56107d1c',
  'cookie-bouton-de-braise': 'ad9ab8f6-967d-46da-a039-e436d41fee8c',
  'cookie-choco-nappe': '5bf77430-c98a-49f3-80d1-46799b102190',
  'cookie-pudding-a-la-mode': '849d0348-21b8-473a-9378-53e24b9a642c',
  'cookie-mousse-au-the-vert': '85ece188-ab1c-4199-86c4-ac8a5a9ca81a',
  'cookie-okchun': '450316c3-f078-48fe-bb9f-4cd4964c9a13',
  'cookie-lait-de-l-ombre': '1afcf91b-6b11-47bc-aa2e-f06cf31d8f50',
  'cookie-pomme-d-amour': 'e4462212-2fb2-43fd-a2db-1f9b98c8832a',
  'cookie-saphir-noir': 'dea32e05-62a1-472e-95a4-9ad363936257',
  'cookie-piece-montee': '818556ea-bd09-4cbc-8ade-1cf6b739a8e1',
  'cookie-foret-noire': '2215f4dd-5a83-4d07-b579-0a3f4ac555db',
  'cookie-esprit-du-feu': '31261334-12d8-4f41-be6f-cde3240ebdb6',
  'cookie-agar-agar': '9ed286f2-9a82-49fe-a452-4b498a01e8a9',
  'cookie-sucre-eternel': '5baf87ee-3d9a-4d45-91ed-9a45396cd8b8',
  'cookie-pavlova': '8cfd7e48-b7fa-44b4-8a6b-c7b0a6e654ce',
  'cookie-mouche-sucree': 'c51f7a01-5273-48ab-9371-03c49d56ebb9',
  'cookie-soda-mousse': '137c1f7d-75b9-4b0a-9d35-4f5d8620e8cc',
  'cookie-lapin-marshmallow': 'dab0a148-8a0a-48fb-b35b-02285068e7c0',
  'cookie-citron-jaune': 'fe04e8da-f5f1-411d-b896-308099232428',
  'cookie-orange': '2c876b7b-eabf-4571-b4d6-54033a58650a',
  'cookie-nacre-oceane': '6324d85f-1e57-4dd1-8040-d9aeaf1534b5',
  'cookie-manju': 'ef414b47-9e75-4403-973e-fe891ceaffe2',
  'cookie-citron-vert': '139557a9-5aea-4f25-a269-d50ab2decb4e',
  'cookie-pamplemousse': '5c67e787-7a71-4610-9b3d-3390b37f5869',
  'farinel': 'c6c6bb21-2a18-47eb-8af4-80c7d95e1b70',
  'cookie-menthol': '8455200d-040f-4166-877f-f9b83aae3743',
  'cookie-eau-gazeuse': '392a4db1-168e-4575-8ee3-77caa7f60316',
  'cookie-sel-silencieux': '75771aa8-d0f8-4ff3-a59a-1f362a66fe95',
  'cookie-charbon': 'd535e441-1302-4fdb-84f3-3ab7c0fe9b2d',
  'cookie-saliere': '2ac367cf-ede0-4589-a39b-d6ed2f233439',
  'cookie-pions-choco': '6fef01fc-d5bd-447e-8606-266a6e9b17a2',
  'cookie-glinda': 'e714d788-e633-450e-ae65-23204154bf5f',
  'cookie-elphaba': '87d1ef46-2245-4186-bd43-b8d995fee991',
  'cookie-arbre-millenaire': 'cbaeef08-dee5-420d-a244-78f276cc9571',
  'cookie-sorciere-des-tenebres': 'e51040f4-1e93-4444-97af-3d9fb573650d',
  'cookie-pate-moisie': '8b0be96d-ac88-4bc5-97bf-d9b850d60376',
  'cookie-pate-toxique': 'dc5eb6c5-3694-4e5e-bc96-7c0641733512',
  'cookie-pate-fongique': '9a5ba7ee-378e-40c9-977d-a3740de54af7',
  'cookie-cygne-de-sucre': 'f40c984e-2bea-4907-a353-b9d133fadcfa'
};

if (cookieMap[cookieId]) {
  cookieId = cookieMap[cookieId];
}

// Fonction pour charger dynamiquement un fichier CSS
function loadCookieDynamicCSS() {
  // Vérifier si le CSS n'est pas déjà chargé
  const id = 'css-cookie-dynamic';
  if (document.getElementById(id)) {
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';

  // Détecter le chemin selon la page (accueil vs pages/xxx)
  const isDetailPage = document.getElementById('page-cookie');
  const path = isDetailPage ? '../assets/css/cookie_dynamic.css' : 'assets/css/cookie_dynamic.css';

  link.href = path + '?v=' + new Date().getTime();
  link.id = id;
  document.head.appendChild(link);
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

    // --- CHARGEMENT DES COSTUMES (Si table séparée) ---
    const { data: costumesData, error: costumesError } = await supabase
      .from('costumes')
      .select('*, icon_mythique') // Parfois le select(*) ne prend pas les nouvelles colonnes
      .eq('cookie_id', cookieData.id)
      .order('id'); // ou autre ordre

    if (costumesError) {
      console.error("Erreur lors du chargement des costumes:", costumesError);
    }


    if (costumesData && costumesData.length > 0) {
      // Transformation des données pour correspondre à la structure attendue
      // La table 'costumes' a des colonnes image1, image2, image3
      // Mais le code attend un tableau 'images'
      const formattedCostumes = costumesData.map(c => {
        const imgs = [];
        if (c.image1) imgs.push(c.image1);
        if (c.image2) imgs.push(c.image2);
        if (c.image3) imgs.push(c.image3);

        return {
          ...c,
          images: imgs, // Création du tableau attendu
          image3: c.image3, // On s'assure que image3 est bien là pour le check mythique
          icon_mythique: c.icon_mythique // Propager explicitement la colonne icon_mythique
        };
      });

      cookieData.costumes = formattedCostumes;
    } else {
    }

    // --- CHARGEMENT DES DIFFÉRENTES CATÉGORIES EN PARALLÈLE ---
    // Optimisation : On lance toutes les requêtes en même temps plutôt que de les attendre une par une
    const [
      newToppings,
      newTartelettes,
      newBiscuits,
      rawPromotions,
      pierresItems,
      ascensionItems,
      newBonbons,
      eveilItems
    ] = await Promise.all([
      fetchCategoryDataWithId('toppings', ['topping'], 'Garniture', cookieData.id),
      fetchCategoryDataWithId('tartelettes', ['tartelette'], 'Tartelette', cookieData.id),
      fetchCategoryDataWithId('biscuits', ['biscuit'], 'Biscuit', cookieData.id),
      fetchCategoryDataWithId('promotions', ['promotions', 'promotion1', 'promotion2', 'promotion3', 'promotion4', 'promotion5'], 'Promotion', cookieData.id),
      fetchCategoryDataWithId('pierres_de_confiture', ['pierre_de_confiture', 'pierre1', 'pierre2', 'pierre3', 'pierre4', 'pierre5'], 'Pierre de confiture', cookieData.id),
      fetchCategoryDataWithId('ascension', ['ascension'], 'Ascension', cookieData.id),
      fetchCategoryDataWithId('bonbons', ['bonbon', 'bonbon1', 'bonbon2', 'bonbon3', 'bonbon4', 'bonbon5'], 'Bonbon', cookieData.id),
      fetchCategoryDataWithId('eveil', ['eveil', 'eveil1', 'eveil2', 'eveil3', 'eveil4', 'eveil5', 'eveil6', 'eveil7'], 'Éveil', cookieData.id)
    ]);

    // 1. Toppings
    localStorage.setItem(`toppings-data:${cookieId}`, JSON.stringify(newToppings));
    cookieData.toppings = newToppings;

    // 2. Tartelettes
    localStorage.setItem(`tartelettes-data:${cookieId}`, JSON.stringify(newTartelettes));
    cookieData.tartelettes = newTartelettes;

    // 3. Biscuits
    localStorage.setItem(`biscuits-data:${cookieId}`, JSON.stringify(newBiscuits));
    cookieData.biscuits = newBiscuits;

    // 4. Promotions
    const groupedPromoIndex = rawPromotions.findIndex(p => p.nom === 'promotions' || (p.images.length > 0 && typeof p.images[0] === 'string' && p.images[0].trim().startsWith('[')));
    if (groupedPromoIndex !== -1) {
      const groupedPromo = rawPromotions[groupedPromoIndex];
      const extractedPromos = [];
      groupedPromo.images.forEach((imgData, i) => {
        let parsedImgs = [];
        if (typeof imgData === 'string' && imgData.trim().startsWith('[')) {
          try { parsedImgs = JSON.parse(imgData); } catch (e) { parsedImgs = [imgData]; }
        } else if (Array.isArray(imgData)) {
          parsedImgs = imgData;
        } else {
          parsedImgs = [imgData];
        }
        extractedPromos.push({
          id: `${groupedPromo.id}-promo-${i + 1}`,
          nom: `Promotion ${i + 1}`,
          images: parsedImgs
        });
      });
      cookieData.promotions = extractedPromos;
    } else {
      cookieData.promotions = rawPromotions;
    }

    // 5. Pierres de confiture
    localStorage.setItem(`pierres-data:${cookieId}`, JSON.stringify(pierresItems));
    cookieData.pierre_de_confiture = pierresItems;

    // 6. Ascension
    cookieData.ascension = { etoiles: ascensionItems };

    // 7. Bonbons
    localStorage.setItem(`bonbons-data:${cookieId}`, JSON.stringify(newBonbons));
    cookieData.bonbons = newBonbons;

    // 8. Eveil
    cookieData.eveil = eveilItems;

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
          illustrationReplaceOr: costumeRow.illustrationReplaceOr || costumeRow.illustration_replace_or || null,
          rareteIcon: costumeRow.rareteIcon || costumeRow.rarete_icon || null,
          iconMythique: costumeRow['icon-mythique'] || costumeRow.icon_mythique || null,
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

      // --- GESTION COSTUME ÉVEILLÉ ---
      // Debug : afficher tous les noms de costume pour vérifier

      // Extraire le costume éveillé (ne pas l'afficher dans la galerie)
      const eveilIndex = cookieData.costumes.findIndex(c => {
        if (!c.nom) return false;
        const nomLower = c.nom.toLowerCase();
        return nomLower.includes('éveillé') || nomLower.includes('eveille') ||
          nomLower.includes('éveil') || nomLower.includes('eveil');
      });
      if (eveilIndex !== -1) {
        cookieData.costumeEveil = cookieData.costumes.splice(eveilIndex, 1)[0];
      } else {
      }
    } else {
      cookieData.costumes = [];
    }

    // Log complet de cookieData pour debug

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
      const { data: userSelection, error: selectError } = await supabase
        .from('cookies_users')
        .select('costume_id, builds, stats_checks, is_awakened')
        .eq('user_id', authData.user.id)
        .eq('cookie_id', cookieId) // cookieId est déjà l'UUID ici
        .maybeSingle();

      if (selectError) console.error('[DEBUG] Erreur sélection Supabase:', selectError);

      if (userSelection) {
        // 1. Restauration du costume
        if (userSelection.costume_id) {
          const selectedCostume = cookieData.costumes?.find(c => c.id === userSelection.costume_id);

          if (selectedCostume) {
            let step = 0;
            // Vérifier si un step est sauvegardé dans builds pour ce costume
            if (userSelection.builds && userSelection.builds[selectedCostume.id] !== undefined) {
              step = userSelection.builds[selectedCostume.id];
            }
            // Attacher le step pour renderCostumes
            selectedCostume.selectedStep = step;

            // Si le costume est à step 0 (NB), ne pas appliquer son illustrationReplace
            // L'illustrationReplace du costume Original sera appliqué par matchingDefault plus bas
            if (step > 0) {
              // Déterminer l'illustration à afficher
              let illustrationUrl = selectedCostume.illustrationReplace;
              if (step === 2 && selectedCostume.illustrationReplaceOr) {
                illustrationUrl = selectedCostume.illustrationReplaceOr;
              }

              if (illustrationUrl) {
                cookieData.activeCostumeId = selectedCostume.id;
                cookieData.activeCostumeUrl = illustrationUrl;
              }
            }
          }
        }

        // 2. Restauration des builds (JSONB)
        if (userSelection.builds) {
          // On injecte les builds dans cookieData pour que renderCookie les utilise
          cookieData.activeBuilds = userSelection.builds;

          // On peut aussi mettre à jour les objets data directement pour simplifier renderCookie
          const applyStep = (items) => {
            if (!items) return;
            items.forEach(item => {
              if (userSelection.builds[item.id] !== undefined) {
                item.selectedStep = userSelection.builds[item.id];
                // Mise à jour synchrone du localStorage pour la cohérence

              }
            });
          };

          applyStep(cookieData.toppings);
          applyStep(cookieData.tartelettes);
          applyStep(cookieData.biscuits);
          applyStep(cookieData.promotions);
          if (cookieData.ascension?.etoiles) applyStep(cookieData.ascension.etoiles);
          applyStep(cookieData.eveil);
          applyStep(cookieData.costumes);
          applyStep(cookieData.bonbons);
          applyStep(cookieData.pierre_de_confiture);
        }

        // 3. Restauration des stats checks (JSONB)
        if (userSelection.stats_checks) {
          // On met à jour le localStorage pour que renderCookie l'utilise
          localStorage.setItem(`cookie_stats_checks_${cookieId}`, JSON.stringify(userSelection.stats_checks));
        }

        // 4. Restauration de l'état Éveillé
        if (userSelection.is_awakened) {
          cookieData.isAwakened = userSelection.is_awakened;
        }
      }
    }

    // Afficher le cookie et appliquer le thème
    applyDynamicTheme(cookieData);
    renderCookie(cookieData);

    // Afficher la galerie de costumes si présente (après renderCookie pour que le DOM existe)
    // SWAP Costume Éveillé AVANT le rendu (isAwakened est maintenant défini)
    console.log('[Costume Éveillé] Vérification swap:', {
      isAwakened: cookieData.isAwakened,
      hasCostumeEveil: !!cookieData.costumeEveil,
      costumeEveilNom: cookieData.costumeEveil?.nom,
      costumesRestants: cookieData.costumes?.map(c => c.nom)
    });
    if (cookieData.isAwakened && cookieData.costumeEveil) {
      const originalCostume = cookieData.costumes?.find(c =>
        c.nom && c.nom.toLowerCase().includes('original')
      );
      if (originalCostume && cookieData.costumeEveil.images?.length >= 1) {
        // Sauvegarder les originaux pour restauration
        originalCostume._originalImage0 = originalCostume.images[0];
        originalCostume._originalRareteIcon = originalCostume.rareteIcon;
        // Swapper l'image et l'icône de rareté
        originalCostume.images[0] = cookieData.costumeEveil.images[0];
        if (cookieData.costumeEveil.rareteIcon) {
          originalCostume.rareteIcon = cookieData.costumeEveil.rareteIcon;
        }
        // Flag pour agrandissement spécifique dans la galerie
        originalCostume.isAwakenedSwap = true;

        // Si le costume éveillé a un illustrationReplace, on le met aussi
        if (cookieData.costumeEveil.illustrationReplace) {
          originalCostume._originalIllustrationReplace = originalCostume.illustrationReplace;
          originalCostume.illustrationReplace = cookieData.costumeEveil.illustrationReplace;
        }

        // Remplacer le nom pour "Costume éveillé"
        originalCostume._originalName = originalCostume.nom;
        originalCostume.nom = "Costume éveillé";

      } else {
      }
    }
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

  const src = img.src.toLowerCase();
  const costumeName = img.dataset.costumeName || '';

  // 1. Identifier la règle Hardcoded (Fallback)
  let finalStyle = {};
  const costumeStylesList = window.COSTUME_STYLES || [];
  const rule = costumeStylesList.find(r => {
    const matchId = r.ids.some(id => src.includes(id.toLowerCase()) || costumeName.includes(id.toLowerCase()));
    if (matchId && r.conditions) {
      return r.conditions.every(c => src.includes(c.toLowerCase()) || costumeName.includes(c.toLowerCase()));
    }
    return matchId;
  });

  if (rule) {
    finalStyle = { ...rule.style };
  }

  // 2. Fusionner avec les styles Supabase (Override)
  if (img.dataset.styleWidth) finalStyle.width = img.dataset.styleWidth;
  if (img.dataset.styleHeight) finalStyle.height = img.dataset.styleHeight;
  if (img.dataset.styleTop) finalStyle.top = img.dataset.styleTop;
  if (img.dataset.styleLeft) finalStyle.left = img.dataset.styleLeft;

  // 3. Appliquer le résultat
  if (Object.keys(finalStyle).length > 0) {
    Object.assign(img.style, finalStyle);
  } else {
  }
}



// --- SAUVEGARDE DYNAMIQUE SUR SUPABASE ---
/**
 * Sauvegarde le 'step' d'un élément de build (topping, biscuit, etc.) dans Supabase
 */
async function saveBuildToSupabase(cookieId, buildId, step) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // 1. Récupérer l'état actuel pour ne pas écraser les autres colonnes (costume_id, stats, etc.)
    const { data: current, error: fetchError } = await supabase
      .from('cookies_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('cookie_id', cookieId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // 2. Préparer le payload
    const payload = {
      user_id: user.id,
      cookie_id: cookieId,
      builds: current?.builds || {}
    };

    // Fusionner le nouveau step
    payload.builds[buildId] = step;

    // Préserver les autres colonnes si elles existent
    if (current) {
      if (current.costume_id) payload.costume_id = current.costume_id;
      if (current.stats_checks) payload.stats_checks = current.stats_checks;
      if (current.is_awakened !== undefined) payload.is_awakened = current.is_awakened;
    }

    // 3. Upsert
    const { error } = await supabase
      .from('cookies_users')
      .upsert(payload, { onConflict: 'user_id, cookie_id' });

    if (error) throw error;
  } catch (err) {
    console.error('[Supabase] Erreur saveBuildToSupabase:', err);
  }
}

async function saveSelectionToSupabase(cookieId, costumeId = null, buildIdToUpdate = null, stepValue = null) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  try {
    // 1. Récupérer l'existant pour ne pas écraser builds/stats_checks
    const { data: current } = await supabase
      .from('cookies_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('cookie_id', cookieId)
      .maybeSingle();

    const payload = {
      user_id: user.id,
      cookie_id: cookieId,
      costume_id: costumeId // Sera null si non fourni
    };

    // Si une entrée existe, on préserve les champs manquants dans payload
    if (current) {
      if (current.builds) payload.builds = current.builds;
      if (current.stats_checks) payload.stats_checks = current.stats_checks;
      if (current.is_awakened !== undefined) payload.is_awakened = current.is_awakened;
    }

    // Appliquer la mise à jour du build spécifique SI DEMANDÉ (fusion intelligente)
    if (buildIdToUpdate !== null && stepValue !== null) {
      if (!payload.builds) payload.builds = {};
      payload.builds[buildIdToUpdate] = stepValue;
    }

    const { error } = await supabase
      .from('cookies_users')
      .upsert(payload, { onConflict: 'user_id, cookie_id' });

    if (error) throw error;
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
  } catch (err) {
    console.error('🔴 Erreur Save Stats:', err);
  }
}

async function saveAwakenedStateToSupabase(cookieId, isAwakened) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // Récupérer l'existant pour ne pas écraser les autres données
    const { data: current } = await supabase
      .from('cookies_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('cookie_id', cookieId)
      .maybeSingle();

    const payload = {
      user_id: user.id,
      cookie_id: cookieId,
      is_awakened: isAwakened
    };

    // Si une entrée existe déjà, on garde ses valeurs pour les autres champs
    if (current) {
      if (current.costume_id) payload.costume_id = current.costume_id;
      if (current.builds) payload.builds = current.builds;
      if (current.stats_checks) payload.stats_checks = current.stats_checks;
    }

    const { error } = await supabase
      .from('cookies_users')
      .upsert(payload, { onConflict: 'user_id, cookie_id' });

    if (error) throw error;
  } catch (err) {
    console.error('🔴 Erreur Save Awakened State:', err);
  }
}

// --- FIN SAUVEGARDE SIMPLE ---

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
  if (data.nom && (data.nom.includes('Crème Pâtissière') || data.nom.includes('creme patissiere') || data.nom.includes('Champignon') || data.nom.includes('Tourbillon')
    || data.nom.includes('Tarte à la citrouille') || data.nom.includes('Licorne à la crème') || data.nom.includes('Capitaine Caviar') || data.nom.includes('Tarte aux myrtilles')
    || data.nom.includes('Poussière d\'Étoile') || data.nom.includes('Jus de pruneaux') || data.nom.includes('Fruit du dragon') || data.nom.includes('Margarine Royale')
    || data.nom.includes('Paillettes brillantes') || data.nom.includes('Limonade noire') || data.nom.includes('Méduse Mousseline') || data.nom.includes('Tourteau fromagé')
    || data.nom.includes('Chevalier vif-argent') || data.nom.includes('Brioche beurrée') || data.nom.includes('Brise-tonnerre') || data.nom.includes('Haetae des nuages')
    || data.nom.includes('Belette à la crème') || data.nom.includes('Archer du Vent') || data.nom.includes('Épices Ardentes') || data.nom.includes('Muscade tigrée')
    || data.nom.includes('Bouton de braise') || data.nom.includes('Pudding à la mode') || data.nom.includes('Mousse au thé vert') || data.nom.includes('Lapin Marshmallow')
    || data.nom.includes('Arbre Millénaire') || data.nom.includes('Sorcière des Ténèbres') || data.nom.includes('Cygne de Sucre'))) {
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
  if (data.pos_illustration_left) root.style.setProperty('--pos-illustration-left', data.pos_illustration_left);

  // 5. Gestion de la classe Rareté (Antique) sur le body
  // Support des deux formats : colonnes directes (rarete) OU format JSON (badges.rarete)
  const raretePath = data.rarete || data.badges?.rarete || '';
  if (raretePath.includes('antique')) {
    document.body.classList.add('rarity-antique');
  } else {
    document.body.classList.remove('rarity-antique');
  }

  // Rareté Rare (Demande spécifique couleur #629FC6)
  // On utilise la colonne 'rarete' mais on fait attention à ne pas matcher le dossier asset 'rarete/'
  // Logique : Si ça contient 'rare' ailleurs que dans 'rarete/'
  const cleanedPath = raretePath.toLowerCase().replace('rarete', ''); // Enlève le mot du dossier
  if (cleanedPath.includes('rare')) {
    document.body.classList.add('rarity-rare');
  } else {
    document.body.classList.remove('rarity-rare');
  }

  // Rareté Super Epique (Demande spécifique couleur #D161C6)
  if (cleanedPath.includes('super')) {
    document.body.classList.add('rarity-superepic');
  } else {
    document.body.classList.remove('rarity-superepic');
  }

  // Rareté Epique (Demande spécifique couleur #F766A7)
  if (cleanedPath.includes('epique') && !cleanedPath.includes('super')) {
    document.body.classList.add('rarity-epic');
  } else {
    document.body.classList.remove('rarity-epic');
  }

  // Rareté Légendaire (Demande spécifique dégradé)
  if (cleanedPath.includes('legend') || cleanedPath.includes('légend')) {
    document.body.classList.add('rarity-legendary');
  } else {
    document.body.classList.remove('rarity-legendary');
  }

  // Rareté Spécial (Demande spécifique couleur #FAC534)
  if (cleanedPath.includes('special') || cleanedPath.includes('spécial')) {
    document.body.classList.add('rarity-special');
  } else {
    document.body.classList.remove('rarity-special');
  }

  // Rareté Dragon (Demande spécifique couleur #BA291A)
  if (cleanedPath.includes('dragon')) {
    document.body.classList.add('rarity-dragon');
  } else {
    document.body.classList.remove('rarity-dragon');
  }

  // Rareté Bête (Demande spécifique couleur #C51F42)
  if (cleanedPath.includes('bete')) {
    document.body.classList.add('rarity-bete');
  } else {
    document.body.classList.remove('rarity-bete');
  }

  // Rareté Sorcière (Demande spécifique couleur #A41169)
  if (cleanedPath.includes('sorciere')) {
    document.body.classList.add('rarity-sorciere');
  } else {
    document.body.classList.remove('rarity-sorciere');
  }

  // 6. Gestion des styles spécifiques (Boutons Éveil) via ID
  // Map des styles par défaut pour les cookies Antiques connus
  const cookieStyles = {
    // Pure Vanilla
    'c539079c-f705-4e01-83a0-46ceef597e98': {
      btnBg: '#F4B843', btnHover: '#f7cc77', glow: 'rgb(237, 201, 23)'
    },
    // White Lily (Lys Blanc)
    'cookie-lys-blanc': { // Si l'ID est le slug
      btnBg: '#237D56', btnHover: '#3dba84', glow: 'rgba(0, 255, 200, .35)'
    },
    '73956799-d46e-4f5b-8db8-1765cb131656': { // UUID Lys Blanc (supposition, à vérifier)
      btnBg: '#237D56', btnHover: '#3dba84', glow: 'rgba(0, 255, 200, .35)'
    },
    // Dark Cacao (Cacao Noir)
    'cookie-cacao-noir': {
      btnBg: '#541F5D', btnHover: '#8b5f93', glow: 'rgb(66, 6, 122)'
    },
    'ca65f53e-1aa0-4367-8017-cee910782ba5': { // UUID Cacao Noir
      btnBg: '#541F5D', btnHover: '#8b5f93', glow: 'rgb(66, 6, 122)'
    },
    // Golden Cheese (Fromage Doré)
    'cookie-fromage-dore': {
      btnBg: '#CC662A', btnHover: '#d8895b', glow: 'rgb(255, 53, 3)'
    },
    // Hollyberry (Baie de Houx)
    'cookie-baie-de-houx': {
      btnBg: '#FF0498', btnHover: '#f98fcd', glow: 'rgb(172, 7, 81)'
    },
    'd7f43376-7489-4b68-80d5-3165582f6e91': { // UUID Baie de Houx
      btnBg: '#FF0498', btnHover: '#f98fcd', glow: 'rgb(172, 7, 81)'
    }
  };

  // On essaie de trouver le style par UUID ou par Slug (nom normalisé)
  const baseNom = data.nom ? data.nom.toLowerCase().replace(/[ \u0027\u2019]/g, '-').replace(/[àáâãäå]/g, "a").replace(/[ç]/g, "c").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u") : '';
  let searchSlug = baseNom.startsWith('cookie-') ? baseNom : `cookie-${baseNom}`;
  if (['farinel', 'schwarzwalder', 'donut-de-l-espace'].includes(baseNom)) {
    searchSlug = baseNom;
  }
  const style = cookieStyles[data.id] || cookieStyles[searchSlug];

  if (style) {
    root.style.setProperty('--btn-eveil-bg', style.btnBg);
    root.style.setProperty('--btn-eveil-hover', style.btnHover);
    root.style.setProperty('--awaken-glow', style.glow);
  } else {
    // Fallback par défaut (Theme Primary)
    root.style.setProperty('--btn-eveil-bg', 'var(--theme-primary)');
    root.style.setProperty('--btn-eveil-hover', 'var(--theme-accent)');
    root.style.setProperty('--awaken-glow', 'rgba(255, 255, 255, 0.5)');
  }


  // Ajouter un slug pour ciblage CSS cookie-spécifique
  const pageContainer = document.getElementById('page-cookie');
  if (pageContainer) pageContainer.setAttribute('data-cookie-slug', searchSlug);
}

function renderCookie(data) {
  // Stocker l'image d'origine du cookie pour la gestion NB
  window._cookieOriginalImage = formatImagePath(data.illustration);

  // --- DÉTERMINATION DE L'ILLUSTRATION À AFFICHER ---
  let currentIllustration = formatImagePath(data.illustration);
  // ==== ILLUSTRATION PRINCIPALE ====
  const cookieNameLower = data.nom ? data.nom.toLowerCase().replace(/ /g, '_') : 'default';
  let currentIllustrationUrl = data.activeCostumeUrl || data.illustration || `${ASSETS_BASE_URL}images/illustrations/${cookieNameLower}_illustration.webp`;
  let currentCostumeNom = data.activeCostumeName || (data.costumes && data.costumes.length > 0 ? data.costumes[0].nom : "");
  let activeStyleAttributes = '';

  // Si un costume est actif (via loadCookieData), on applique ses styles
  if (data.activeCostumeId) {
    const activeCostume = data.costumes?.find(c => c.id === data.activeCostumeId);
    if (activeCostume) {
      if (activeCostume.nom) {
        activeStyleAttributes += ` data-costume-name="${activeCostume.nom.toLowerCase()}"`;
      }
      if (activeCostume.style) {
        if (activeCostume.style.width) activeStyleAttributes += ` data-style-width="${activeCostume.style.width}"`;
        if (activeCostume.style.height) activeStyleAttributes += ` data-style-height="${activeCostume.style.height}"`;
        if (activeCostume.style.top) activeStyleAttributes += ` data-style-top="${activeCostume.style.top}"`;
        if (activeCostume.style.left) activeStyleAttributes += ` data-style-left="${activeCostume.style.left}"`;
      }
    }
  }

  // 2. Fallback final
  currentIllustration = currentIllustrationUrl;

  // TENTATIVE INTELLIGENTE : Retrouver le costume associé à cette URL pour appliquer ses styles
  const matchingCostume = data.costumes?.find(c => formatImagePath(c.illustrationReplace) === currentIllustrationUrl);
  if (matchingCostume) {
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

  // TENTATIVE INTELLIGENTE (Défaut) : Même logique pour l'illustration de base
  // Si l'illustration par défaut correspond à un "costume" (ex: Original) paramétré dans la DB, on applique ses styles
  const matchingDefault = data.costumes?.find(c => {
    // Correspondance par URL (si l'URL de base est la même que celle du costume Original)
    const matchUrl = c.illustrationReplace && formatImagePath(c.illustrationReplace) === currentIllustration;
    // Correspondance par Nom (si le costume contient "Original" ou "Defaut")
    const matchName = c.nom && (c.nom.toLowerCase().includes('original') || c.nom.toLowerCase().includes('defaut') || c.nom.toLowerCase().includes('défaut'));

    return matchUrl || matchName;
  });

  if (matchingDefault) {
    if (matchingDefault.nom && !activeStyleAttributes.includes('data-costume-name')) {
      activeStyleAttributes += ` data-costume-name="${matchingDefault.nom.toLowerCase()}"`;
    }
    if (matchingDefault.style) {
      if (matchingDefault.style.width && !activeStyleAttributes.includes('data-style-width')) activeStyleAttributes += ` data-style-width="${matchingDefault.style.width}"`;
      if (matchingDefault.style.height && !activeStyleAttributes.includes('data-style-height')) activeStyleAttributes += ` data-style-height="${matchingDefault.style.height}"`;
      if (matchingDefault.style.top && !activeStyleAttributes.includes('data-style-top')) activeStyleAttributes += ` data-style-top="${matchingDefault.style.top}"`;
      if (matchingDefault.style.left && !activeStyleAttributes.includes('data-style-left')) activeStyleAttributes += ` data-style-left="${matchingDefault.style.left}"`;
    }
    // Only apply default image if no costume is active
    if (!data.activeCostumeId && matchingDefault.illustrationReplace) {
      currentIllustration = formatImagePath(matchingDefault.illustrationReplace);
      window._cookieOriginalImage = currentIllustration;
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

   <div class="illustration-cookie">
     <img alt="${data.nom}" src="${currentIllustration}" ${activeStyleAttributes}/>
   </div>

   <div class="row-costume-bonbon ${(data.bonbons?.length || 0) === 0 && (data.pierre_de_confiture?.length || 0) === 0 ? 'is-centered' : ''}">
    <a class="btn-costume" href="#">
        <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773336768/costumes_s2tdkd.webp" alt="Costumes" />
    </a>
    <div class="bonbons">
        ${(data.bonbons || []).map(b => `
            <img alt="${b.nom || 'Bonbon'}" class="bonbon-cycle" 
                data-id="${b.id}" 
                data-images='${safeJsonStringify(b.images)}'
                data-step="${b.selectedStep || 0}" 
                src="${formatImagePath(b.images ? b.images[b.selectedStep || 0] : '')}"/>
        `).join('')}
    </div>
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

  <div class="eveil">
    ${(data.eveil || []).map(e => `
        <img alt="${e.nom || 'Éveil'}" class="eveil-cycle" 
             data-id="${e.id}" 
             data-images='${safeJsonStringify(e.images)}'
             data-step="${e.selectedStep || 0}" 
             src="${formatImagePath(e.images ? e.images[e.selectedStep || 0] : '')}"/>
    `).join('')}
  </div>

  <div class="detail-grid-mobile">
    <!-- Groupe 1: Garnitures & Tartelettes -->
    <div class="column-left equipment-group">
        <button class="btn-info-trigger" aria-label="Afficher les attributs">
            <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034037/icon_info_nvqptv.webp" alt="i" />
        </button>
        <div class="row-toppings-tartelettes">
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
        </div>
        <div class="info-frame mobile-popup">
            <div class="info-frame-header">
                <img class="info-frame-icon" src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034037/icon_info_nvqptv.webp" alt="Info" />
                <h3>Attributs recommandés</h3>
                <button class="btn-close-popup">&times;</button>
            </div>
            <div class="info-frame-content">
                ${(data.toppings_stats || ['???', '???', '???']).map(stat => `<p>${stat}</p>`).join('')}
            </div>
        </div>
    </div>

    <!-- Groupe 2: Biscuits & Stats -->
    <div class="column-right equipment-group">
        <button class="btn-info-trigger" aria-label="Afficher les attributs">
            <img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034037/icon_info_nvqptv.webp" alt="i" />
        </button>
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

        ${(() => {
            const classe = data.classe || data.badges?.classe || '';
            if (classe.includes('bts')) return '';

            return `
            <div class="info-frame2 mobile-popup ${isExtraWide ? 'extra-wide-mode' : (isWide ? 'wide-mode' : '')} ${isSmallText ? 'small-text' : ''}">
                <div class="info-frame2-header">
                    <img class="info-frame2-icon" src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034037/icon_info_nvqptv.webp" alt="Info" />
                    <h3>Attributs recommandés</h3>
                    <button class="btn-close-popup">&times;</button>
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
    </div>
  </div>
  </div>

  <div class="pierre-confiture">
     ${(data.pierre_de_confiture || []).map(p => `
         <img alt="${p.nom || 'Pierre de confiture'}" class="pierre-cycle" 
              data-id="${p.id}" 
              data-images='${safeJsonStringify(p.images)}'
              data-step="${p.selectedStep || 0}" 
              src="${formatImagePath(p.images ? p.images[p.selectedStep || 0] : '')}"/>
     `).join('')}
  </div>

  ${data.navigation?.precedent ? `<a href="cookie_detail.html?id=${data.navigation.precedent}" class="btn-cookie-precedent"><img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773327896/precedent_watsjr.webp" alt="Précédent" /></a>` : ''}
  ${data.navigation?.suivant ? `<a href="cookie_detail.html?id=${data.navigation.suivant}" class="btn-cookie-suivant"><img src="https://res.cloudinary.com/dkgfa4apm/image/upload/v1773327894/suivant_gsobzx.webp" alt="Suivant" /></a>` : ''}
 
  `;

  if (pageContainer) {
    pageContainer.innerHTML = cookieHTML;

    // Ajouter interactivité popups d'attributs
    pageContainer.querySelectorAll('.btn-info-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const group = btn.closest('.equipment-group');
        const popup = group?.querySelector('.mobile-popup');
        if (popup) popup.classList.add('show-popup');
      });
    });

    pageContainer.querySelectorAll('.btn-close-popup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = btn.closest('.mobile-popup');
        if (popup) popup.classList.remove('show-popup');
      });
    });

    // Fermer les popups en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-popup') && !e.target.closest('.btn-info-trigger')) {
        document.querySelectorAll('.mobile-popup.show-popup').forEach(p => {
          p.classList.remove('show-popup');
        });
      }
    });

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

  // 7. Injection dynamique du bouton Éveil (si applicable)
  injectAwakenButton(data);

  // 8. Gestion des costumes (Popup et Changement d'image)
  setupCostumeLogic(data);
}

// Configuration des données d'Éveil pour les cookies Antiques
const cookieAwakenData = {
  'cookie-vanille-pure': { // ID
    eveilUrl: 'cookie_vanille_pure_eveil.html',
    buttonLabel: 'Sage Éveillé',
    confitureNb: '../assets/images/confiture_d_ames/awaken_pure_vanilla_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_pure_vanilla_jam.webp'
  },
  'c539079c-f705-4e01-83a0-46ceef597e98': { // UUID
    eveilUrl: 'cookie_vanille_pure_eveil.html',
    buttonLabel: 'Sage Éveillé',
    confitureNb: '../assets/images/confiture_d_ames/awaken_pure_vanilla_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_pure_vanilla_jam.webp'
  },
  'cookie-lys-blanc': {
    eveilUrl: 'cookie_lys_blanc_eveil.html',
    buttonLabel: 'Lumière de l\'Aube',
    confitureNb: '../assets/images/confiture_d_ames/awaken_white_lily_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_white_lily_jam.webp'
  },
  '55b92598-3587-44c5-9eab-a40108e727e6': { // UUID Lys Blanc
    eveilUrl: 'cookie_lys_blanc_eveil.html',
    buttonLabel: 'Lumière de l\'Aube',
    confitureNb: '../assets/images/confiture_d_ames/awaken_white_lily_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_white_lily_jam.webp'
  },
  'cookie-cacao-noir': {
    eveilUrl: 'cookie_cacao_noir_eveil.html',
    buttonLabel: 'Seigneur Dragon',
    confitureNb: '../assets/images/confiture_d_ames/awaken_dark_cacao_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_dark_cacao_jam.webp'
  },
  'ca65f53e-1aa0-4367-8017-cee910782ba5': {
    eveilUrl: 'cookie_cacao_noir_eveil.html',
    buttonLabel: 'Seigneur Dragon',
    confitureNb: '../assets/images/confiture_d_ames/awaken_dark_cacao_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_dark_cacao_jam.webp'
  },
  'cookie-fromage-dore': {
    eveilUrl: 'cookie_fromage_dore_eveil.html',
    buttonLabel: 'Ailes Immortelles',
    confitureNb: '../assets/images/confiture_d_ames/awaken_golden_cheese_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_golden_cheese_jam.webp'
  },
  '9bf9c90e-ea0c-4d16-86fb-4d1f585411e9': { // UUID Fromage Doré
    eveilUrl: 'cookie_fromage_dore_eveil.html',
    buttonLabel: 'Ailes Immortelles',
    confitureNb: '../assets/images/confiture_d_ames/awaken_golden_cheese_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_golden_cheese_jam.webp'
  },
  'cookie-baie-de-houx': {
    eveilUrl: 'cookie_baie_de_houx_eveil.html',
    buttonLabel: 'Aegis',
    confitureNb: '../assets/images/confiture_d_ames/awaken_hollyberry_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_hollyberry_jam.webp'
  },
  'd7f43376-7489-4b68-80d5-3165582f6e91': { // UUID Baie de Houx
    eveilUrl: 'cookie_baie_de_houx_eveil.html',
    buttonLabel: 'Aegis',
    confitureNb: '../assets/images/confiture_d_ames/awaken_hollyberry_jam_nb.webp',
    confitureColor: '../assets/images/confiture_d_ames/awaken_hollyberry_jam.webp'
  }
};

function injectAwakenButton(data) {
  // Rendre le nom de recherche robuste (".startsWith('cookie-')" évite les "cookie-cookie-baie...")
  const baseNom = data.nom ? data.nom.toLowerCase().replace(/ /g, '-').replace(/[àáâãäå]/g, "a").replace(/[ç]/g, "c").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u") : '';
  const searchSlug = baseNom.startsWith('cookie-') ? baseNom : `cookie-${baseNom}`;
  const awakenData = cookieAwakenData[data.id] || cookieAwakenData[searchSlug];

  if (!awakenData) return; // Pas de données d'éveil pour ce cookie

  // On évite les doublons si déjà injecté
  if (document.getElementById('awaken-toggle')) return;

  const container = document.querySelector('.bloc-fond-cookie');
  if (!container) return;

  // Gestion de la source des images (Supabase uniquement)
  let toggleImageNb = null;
  let toggleImageColor = null;

  if (data.confiture_ames) {
    try {
      if (typeof data.confiture_ames === 'string') {
        const strVal = data.confiture_ames.trim();
        // Si ça ressemble à un tableau JSON ["...", "..."]
        if (strVal.startsWith('[')) {
          const confiture = JSON.parse(strVal);
          if (Array.isArray(confiture) && confiture.length >= 2) {
            toggleImageNb = formatImagePath(confiture[0]);
            toggleImageColor = formatImagePath(confiture[1]);
          }
        }
        // Si c'est un object JSON {"nb": "...", "color": "..."}
        else if (strVal.startsWith('{')) {
          const confiture = JSON.parse(strVal);
          if (confiture && confiture.nb && confiture.color) {
            toggleImageNb = formatImagePath(confiture.nb);
            toggleImageColor = formatImagePath(confiture.color);
          }
        }
        // Séparé par des virgules : "image1, image2"
        else if (strVal.includes(',')) {
          const parts = strVal.split(',').map(s => s.trim());
          if (parts.length >= 2) {
            toggleImageNb = formatImagePath(parts[0]);
            toggleImageColor = formatImagePath(parts[1]);
          }
        }
        // Sinon (une seule image, ou erreur), on ignore et fallback prendra le relais
      } else if (Array.isArray(data.confiture_ames) && data.confiture_ames.length >= 2) {
        toggleImageNb = formatImagePath(data.confiture_ames[0]);
        toggleImageColor = formatImagePath(data.confiture_ames[1]);
      } else if (data.confiture_ames.nb && data.confiture_ames.color) {
        toggleImageNb = formatImagePath(data.confiture_ames.nb);
        toggleImageColor = formatImagePath(data.confiture_ames.color);
      }
    } catch (e) {
    }
  }

  // Fallback local si Supabase ne renvoie pas confiture_ames (ou pas correctement parsé)
  if ((!toggleImageNb || !toggleImageColor) && awakenData.confitureNb && awakenData.confitureColor) {
    toggleImageNb = formatImagePath(awakenData.confitureNb);
    toggleImageColor = formatImagePath(awakenData.confitureColor);
  }

  // Si pas d'images trouvées dans Supabase ou en fallback, on n'affiche rien
  if (!toggleImageNb || !toggleImageColor) return;

  // Gestion du Favicon
  const faviconLink = document.querySelector("link[rel='icon']") || document.createElement('link');
  faviconLink.rel = 'icon';
  document.head.appendChild(faviconLink); // S'assure qu'il est dans le head

  // Sauvegarde du favicon d'origine (icon_tete ou favicon par défaut)
  // On priorise icon_tete de Supabase s'il existe
  const originalFavicon = data.icon_tete ? formatImagePath(data.icon_tete) : faviconLink.href;

  // Appliquer icon_tete par défaut au chargement si disponible
  if (data.icon_tete) {
    faviconLink.href = originalFavicon;
  }

  // Création du bouton-image Toggle
  const toggleImg = document.createElement('img');
  toggleImg.id = 'awaken-toggle';
  toggleImg.className = 'awaken-toggle';
  toggleImg.alt = "Marquer l'Éveil obtenu";
  toggleImg.width = 96;
  toggleImg.height = 96;
  toggleImg.src = toggleImageNb; // Par défaut en NB
  toggleImg.dataset.state = 'nb'; // État initial
  if (data.illustration_eveil) {
    toggleImg.dataset.awakenedSrc = formatImagePath(data.illustration_eveil);
  }

  // Création du bouton lien (Visible mais désactivé)
  const btnEveil = document.createElement('a');
  btnEveil.id = 'btn-open-awakened';
  btnEveil.className = 'btn-eveil';
  btnEveil.href = `../pages/${awakenData.eveilUrl}`;
  btnEveil.textContent = awakenData.buttonLabel;
  btnEveil.hidden = false; // Toujours visible
  btnEveil.setAttribute('aria-disabled', 'true'); // Toujours désactivé (visuellement)
  btnEveil.style.opacity = '0.5'; // Départ grisé
  btnEveil.style.pointerEvents = 'none'; // Désactiver le clic

  // --- INITIALISATION DE L'ÉTAT (Si sauvegardé) ---
  const mainIllustration = document.querySelector('.illustration-cookie img');
  const root = document.documentElement; // Pour changer la variable CSS
  const defaultLobby = getComputedStyle(root).getPropertyValue('--bg-image'); // Sauvegarder la valeur par défaut

  if (data.isAwakened) {
    toggleImg.src = toggleImageColor;
    toggleImg.classList.add('active-glow');
    toggleImg.dataset.state = 'color';
    btnEveil.style.opacity = '1';

    // Favicon
    if (data.icon_tete_eveil) {
      faviconLink.href = formatImagePath(data.icon_tete_eveil);
    }

    // Illustration Principale
    const awakenedIllu = (data.costumeEveil && data.costumeEveil.illustrationReplace)
      ? formatImagePath(data.costumeEveil.illustrationReplace)
      : (data.illustration_eveil ? formatImagePath(data.illustration_eveil) : null);

    // Ne remplacer l'illustration QUE SI aucun autre costume n'est sélectionné
    let shouldOverrideWithAwakened = false;
    if (mainIllustration) {
      const activeCostumeName = mainIllustration.dataset.costumeName || '';
      if (!activeCostumeName || activeCostumeName.includes('original') || activeCostumeName.includes('défaut') || activeCostumeName.includes('defaut') || activeCostumeName.includes('eveille') || activeCostumeName.includes('éveillé')) {
        shouldOverrideWithAwakened = true;
      }
    }

    if (shouldOverrideWithAwakened && mainIllustration && awakenedIllu) {
      mainIllustration.src = awakenedIllu;

      // Appliquer les styles du costume éveillé SI DISPONIBLES
      if (data.costumeEveil && data.costumeEveil.style) {
        if (data.costumeEveil.style.top) mainIllustration.dataset.styleTop = data.costumeEveil.style.top;
        if (data.costumeEveil.style.left) mainIllustration.dataset.styleLeft = data.costumeEveil.style.left;
        if (data.costumeEveil.style.width) mainIllustration.dataset.styleWidth = data.costumeEveil.style.width;
        if (data.costumeEveil.style.height) mainIllustration.dataset.styleHeight = data.costumeEveil.style.height;
      }
    }

    // Lobby (Arrière-plan)
    if (data.lobby_eveil) {
      root.style.setProperty('--bg-image', `url('${formatImagePath(data.lobby_eveil)}')`);
    }
  }

  // Création du conteneur pour grouper bouton et icône (facilite le layout mobile)
  const awakenContainer = document.createElement('div');
  awakenContainer.className = 'awaken-container';
  
  // Ajout au DOM (dans le conteneur puis le conteneur dans le bloc)
  awakenContainer.appendChild(btnEveil);
  awakenContainer.appendChild(toggleImg);
  container.appendChild(awakenContainer);

  // Logique du Toggle au clic
  toggleImg.addEventListener('click', () => {
    // Animation 'pop'
    toggleImg.classList.remove('pop');
    void toggleImg.offsetWidth; // Trigger reflow
    toggleImg.classList.add('pop');

    let isAwakenedState = false;

    if (toggleImg.dataset.state === 'nb') {
      // Activer l'éveil (Visuel uniquement)
      toggleImg.src = toggleImageColor;
      toggleImg.classList.add('active-glow');
      toggleImg.dataset.state = 'color';

      // Bouton : Devient coloré mais reste non-cliquable (demande utilisateur)
      btnEveil.style.opacity = '1';

      // Favicon : Changer pour icon_tete_eveil si disponible
      if (data.icon_tete_eveil) {
        faviconLink.href = formatImagePath(data.icon_tete_eveil);
      }

      // Illustration Principale : Changer pour illustration_eveil (ou celle du costume si définie)
      const awakenedIllustrationSrc = (data.costumeEveil && data.costumeEveil.illustrationReplace)
        ? formatImagePath(data.costumeEveil.illustrationReplace)
        : (data.illustration_eveil ? formatImagePath(data.illustration_eveil) : null);

      let shouldOverrideToggle = false;
      if (mainIllustration) {
        const activeCostumeName = mainIllustration.dataset.costumeName || '';
        if (!activeCostumeName || activeCostumeName.includes('original') || activeCostumeName.includes('défaut') || activeCostumeName.includes('defaut') || activeCostumeName.includes('eveille') || activeCostumeName.includes('éveillé')) {
          shouldOverrideToggle = true;
        }
      }

      if (shouldOverrideToggle && mainIllustration && awakenedIllustrationSrc) {
        mainIllustration.classList.remove('illustration-swap-anim');
        void mainIllustration.offsetWidth; // Trigger reflow
        mainIllustration.src = awakenedIllustrationSrc;
        mainIllustration.classList.add('illustration-swap-anim');

        // Initialiser les backups si nécessaire
        // On sauvegarde les dataset qui pilotent applyIllustrationStyles
        if (!mainIllustration.dataset.originalStyleTop && mainIllustration.dataset.styleTop) mainIllustration.dataset.originalStyleTop = mainIllustration.dataset.styleTop;
        if (!mainIllustration.dataset.originalStyleLeft && mainIllustration.dataset.styleLeft) mainIllustration.dataset.originalStyleLeft = mainIllustration.dataset.styleLeft;
        if (!mainIllustration.dataset.originalStyleWidth && mainIllustration.dataset.styleWidth) mainIllustration.dataset.originalStyleWidth = mainIllustration.dataset.styleWidth;
        if (!mainIllustration.dataset.originalStyleHeight && mainIllustration.dataset.styleHeight) mainIllustration.dataset.originalStyleHeight = mainIllustration.dataset.styleHeight;

        // Appliquer les styles du costume éveillé via dataset
        if (data.costumeEveil && data.costumeEveil.style) {
          if (data.costumeEveil.style.top) mainIllustration.dataset.styleTop = data.costumeEveil.style.top;
          if (data.costumeEveil.style.left) mainIllustration.dataset.styleLeft = data.costumeEveil.style.left;
          if (data.costumeEveil.style.width) mainIllustration.dataset.styleWidth = data.costumeEveil.style.width;
          if (data.costumeEveil.style.height) mainIllustration.dataset.styleHeight = data.costumeEveil.style.height;
        }
      }

      // Lobby (Arrière-plan)
      if (data.lobby_eveil) {
        root.style.setProperty('--bg-image', `url('${formatImagePath(data.lobby_eveil)}')`);
      }

      isAwakenedState = true;

    } else {
      // Désactiver l'éveil
      toggleImg.src = toggleImageNb;
      toggleImg.classList.remove('active-glow');
      toggleImg.dataset.state = 'nb';

      // Bouton : Redevient grisé
      btnEveil.style.opacity = '0.5';

      // Favicon : Revenir à l'original
      faviconLink.href = originalFavicon;

      let shouldRestoreOriginalToggle = false;
      if (mainIllustration) {
        const activeCostumeName = mainIllustration.dataset.costumeName || '';
        if (!activeCostumeName || activeCostumeName.includes('original') || activeCostumeName.includes('défaut') || activeCostumeName.includes('defaut') || activeCostumeName.includes('eveille') || activeCostumeName.includes('éveillé')) {
          shouldRestoreOriginalToggle = true;
        }
      }

      // Illustration Principale : Revenir à l'original (base)
      if (shouldRestoreOriginalToggle && mainIllustration && window._cookieOriginalImage) {
        mainIllustration.classList.remove('illustration-swap-anim');
        void mainIllustration.offsetWidth; // Trigger reflow
        mainIllustration.src = window._cookieOriginalImage;
        mainIllustration.classList.add('illustration-swap-anim');

        // Restaurer les styles originaux (dataset)
        if (mainIllustration.dataset.originalStyleTop !== undefined) mainIllustration.dataset.styleTop = mainIllustration.dataset.originalStyleTop; else delete mainIllustration.dataset.styleTop;
        if (mainIllustration.dataset.originalStyleLeft !== undefined) mainIllustration.dataset.styleLeft = mainIllustration.dataset.originalStyleLeft; else delete mainIllustration.dataset.styleLeft;
        if (mainIllustration.dataset.originalStyleWidth !== undefined) mainIllustration.dataset.styleWidth = mainIllustration.dataset.originalStyleWidth; else delete mainIllustration.dataset.styleWidth;
        if (mainIllustration.dataset.originalStyleHeight !== undefined) mainIllustration.dataset.styleHeight = mainIllustration.dataset.originalStyleHeight; else delete mainIllustration.dataset.styleHeight;

        // Nettoyer les backups (optionnel)
        // Mais important pour re-permettre le backup si l'user re-clique
        delete mainIllustration.dataset.originalStyleTop;
        delete mainIllustration.dataset.originalStyleLeft;
        delete mainIllustration.dataset.originalStyleWidth;
        delete mainIllustration.dataset.originalStyleHeight;
      }

      // Lobby (Arrière-plan) : Retour à la valeur par défaut
      if (defaultLobby && defaultLobby.trim()) {
        root.style.setProperty('--bg-image', defaultLobby);
      } else {
        root.style.removeProperty('--bg-image');
      }

      isAwakenedState = false;
    }

    // --- SWAP COSTUME ORIGINAL <-> ÉVEILLÉ dans le DOM ---
    if (data.costumeEveil) {
      const gallery = document.getElementById('popup-costume-gallery');
      if (gallery) {
        // Trouver le costume-toggle du costume "Original" (ou "Costume éveillé" si déjà swappé)
        const allToggles = gallery.querySelectorAll('.costume-toggle');
        allToggles.forEach(toggle => {
          const toggleName = toggle.alt?.toLowerCase() || '';
          // Si le nom contient "original" OU si on a déjà swappé (data-original-image0 présent)
          if (toggleName.includes('original') || toggle.dataset.originalImage0) {
            const images = JSON.parse(toggle.dataset.images || '[]');
            const costumeItem = toggle.closest('.costume-item');
            const iconImg = costumeItem?.querySelector('.costume-icon img');

            if (isAwakenedState && data.costumeEveil.images?.length >= 1) {
              // Sauvegarder les valeurs originales si pas déjà fait
              if (!toggle.dataset.originalImage0) {
                toggle.dataset.originalImage0 = images[0] || '';
              }
              if (iconImg && !iconImg.dataset.originalRareteIcon) {
                iconImg.dataset.originalRareteIcon = iconImg.src;
              }
              // Remplacer image[0] avec celle du costume éveillé
              images[0] = formatImagePath(data.costumeEveil.images[0]);
              toggle.dataset.images = JSON.stringify(images);
              // Si le toggle est actuellement sur step 0, mettre à jour le src affiché
              const currentStep = parseInt(toggle.dataset.step || 0);
              if (currentStep === 0) {
                toggle.src = formatImagePath(data.costumeEveil.images[0]);
              }
              // Remplacer l'icône de rareté
              if (iconImg && data.costumeEveil.rareteIcon) {
                iconImg.src = formatImagePath(data.costumeEveil.rareteIcon);
              }

              // Remplacer le nom
              const nameEl = costumeItem.querySelector('.costume-name');
              if (nameEl) {
                // Sauvegarde du nom original si pas déjà fait
                if (!nameEl.dataset.originalName) {
                  nameEl.dataset.originalName = nameEl.innerHTML; // Utiliser innerHTML pour garder l'image mythique si présente
                }
                nameEl.textContent = "Costume éveillé";
              }

              // Agrandissement spécifique
              costumeItem.classList.add('is-awakened-swap');

              // --- MISE À JOUR DES ATTRIBUTS DE STYLE & ILLUSTRATION ---
              // Sauvegarde
              if (!toggle.dataset.originalIllustrationReplace) toggle.dataset.originalIllustrationReplace = toggle.dataset.illustrationReplace || '';
              if (!toggle.dataset.originalStyleWidth) toggle.dataset.originalStyleWidth = toggle.dataset.styleWidth || '';
              if (!toggle.dataset.originalStyleHeight) toggle.dataset.originalStyleHeight = toggle.dataset.styleHeight || '';
              if (!toggle.dataset.originalStyleTop) toggle.dataset.originalStyleTop = toggle.dataset.styleTop || '';
              if (!toggle.dataset.originalStyleLeft) toggle.dataset.originalStyleLeft = toggle.dataset.styleLeft || '';

              // Remplacement
              if (data.costumeEveil.illustrationReplace) {
                toggle.dataset.illustrationReplace = formatImagePath(data.costumeEveil.illustrationReplace);
              }
              if (data.costumeEveil.style) {
                toggle.dataset.styleWidth = data.costumeEveil.style.width || '';
                toggle.dataset.styleHeight = data.costumeEveil.style.height || '';
                toggle.dataset.styleTop = data.costumeEveil.style.top || '';
                toggle.dataset.styleLeft = data.costumeEveil.style.left || ''; // C'est ici que le 'left' est appliqué !
              }

            } else {
              // Restaurer les valeurs originales
              if (toggle.dataset.originalImage0) {
                images[0] = toggle.dataset.originalImage0;
                toggle.dataset.images = JSON.stringify(images);
                const currentStep = parseInt(toggle.dataset.step || 0);
                if (currentStep === 0) {
                  toggle.src = toggle.dataset.originalImage0;
                }
              }
              if (iconImg && iconImg.dataset.originalRareteIcon) {
                iconImg.src = iconImg.dataset.originalRareteIcon;
              }

              // Restaurer le nom
              const nameEl = costumeItem.querySelector('.costume-name');
              if (nameEl && nameEl.dataset.originalName) {
                nameEl.innerHTML = nameEl.dataset.originalName;
              }

              // RESTAURATION DES ATTRIBUTS DE STYLE
              if (toggle.dataset.originalIllustrationReplace !== undefined) toggle.dataset.illustrationReplace = toggle.dataset.originalIllustrationReplace;
              if (toggle.dataset.originalStyleWidth !== undefined) toggle.dataset.styleWidth = toggle.dataset.originalStyleWidth;
              if (toggle.dataset.originalStyleHeight !== undefined) toggle.dataset.styleHeight = toggle.dataset.originalStyleHeight;
              if (toggle.dataset.originalStyleTop !== undefined) toggle.dataset.styleTop = toggle.dataset.originalStyleTop;
              if (toggle.dataset.originalStyleLeft !== undefined) toggle.dataset.styleLeft = toggle.dataset.originalStyleLeft;

              // Retrait agrandissement spécifique
              costumeItem.classList.remove('is-awakened-swap');
            }
          }
        });
      }
    }

    // Sauvegarder l'état dans Supabase
    saveAwakenedStateToSupabase(data.id, isAwakenedState);
  });

}

function setupCostumeLogic(data) {
  // Rendre les costumes dans le popup
  renderCostumes(data.costumes);

  // Configurer l'ouverture/fermeture du popup
  setupCostumePopup();

  // Configurer les cycles d'images (pour costumes et autres éléments)
  setupImageCycles(data);
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

  const costumesHTML = costumes.map(c => {
    const isMythicClass = (c.icon_mythique || c.image3) ? ' is-mythic' : '';
    const step = c.selectedStep || 0;
    const currentSrc = c.images && c.images[step] ? formatImagePath(c.images[step]) : formatImagePath(c.images[0]);
    const rareteIcon = (step === 2) 
      ? "https://res.cloudinary.com/dkgfa4apm/image/upload/v1769035463/mythique_costume_ia9ohj.webp"
      : formatImagePath(c.rareteIcon || 'assets/images/rarete/normal_costume.webp');

    return `
    <div class="costume-item ${c.isAwakenedSwap ? 'is-awakened-swap' : ''}">
        <div class="costume-toggle-wrapper">
          <img alt="${c.nom}" class="costume-toggle" 
               data-id="${c.id || 'costume-' + Math.random()}" 
               data-images='${safeJsonStringify(c.images)}'
               ${c.illustrationReplace ? `data-illustration-replace="${formatImagePath(c.illustrationReplace)}"` : ''}
               ${c.illustrationReplaceOr ? `data-illustration-replace-or="${formatImagePath(c.illustrationReplaceOr)}"` : ''}
               data-style-width="${c.style?.width || ''}"
               data-style-height="${c.style?.height || ''}"
               data-style-top="${c.style?.top || ''}"
               data-style-left="${c.style?.left || ''}"
               data-step="${step}" 
               ${c._originalImage0 ? `data-original-image0="${formatImagePath(c._originalImage0)}"` : ''}
               src="${currentSrc}"/>
        </div>
        <div class="costume-icon">
            <img alt="Rareté" 
                 ${c._originalRareteIcon ? `data-original-rarete-icon="${formatImagePath(c._originalRareteIcon)}"` : ''}
                 src="${rareteIcon}"/>
        </div>
        <p class="costume-name${isMythicClass}" ${c._originalName ? `data-original-name="${c._originalName.replace(/"/g, '&quot;')}"` : ''}>
            ${c.nom}
            ${c.iconMythique ? `<img src="${formatImagePath(c.iconMythique)}" class="mythic-icon-small" alt="Mythique" />` : ''}
        </p>
      </div>
    `;
  }).join('');

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

  let attempts = 0;
  function attachListeners() {
    const cycles = document.querySelectorAll('.garniture-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle, .ascension-cycle, .bonbon-cycle, .pierre-cycle, .eveil-cycle, .costume-toggle');

    if (cycles.length === 0 && attempts < 50) {
      attempts++;
      setTimeout(attachListeners, 100);
      return;
    }

    cycles.forEach(element => {
      // Eviter d'attacher plusieurs fois
      if (element.dataset.listenerAttached) return;
      element.dataset.listenerAttached = 'true';

      const id = element.dataset.id;
      const images = JSON.parse(element.dataset.images || '[]');

      // Restaure l'état sauvegardé au chargement (si pas déjà fait par le HTML)
      // Utilise 0 comme valeur par défaut si data-step n'est pas défini
      const initialStep = parseInt(element.dataset.step || 0);
      element.dataset.step = initialStep;
      element.src = images[initialStep];

      element.addEventListener('click', function () {
        let step = parseInt(this.dataset.step || 0);
        if (images.length > 1) {
          step = (step + 1) % images.length;
          this.dataset.step = step;
          this.src = images[step];
          // Sauvegarde l'état (nouvelle clé)
          if (id)

            if (this.dataset.id) {
              const page = document.getElementById('page-cookie');
              const cookieId = page?.getAttribute('data-cookie-id') || window.cookieId;
              // On sauvegarde le step dans 'builds' pour TOUS les éléments SAUF costumes (géré par saveSelectionToSupabase)
              if (cookieId && !this.classList.contains('costume-toggle')) {
                saveBuildToSupabase(cookieId, this.dataset.id, step);
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
            const isThisCostumeActive = currentIllustration === this.dataset.illustrationReplace || currentIllustration === this.dataset.illustrationReplaceOr;

            if (isThisCostumeActive && window._cookieOriginalImage) {

              // Vérifier si le mode Éveillé est actif
              const awakenToggle = document.getElementById('awaken-toggle');
              if (awakenToggle && awakenToggle.dataset.state === 'color' && awakenToggle.dataset.awakenedSrc) {
                illustration.src = awakenToggle.dataset.awakenedSrc;
              } else {
                illustration.src = window._cookieOriginalImage;
              }

              illustrationChanged = true;

              if (cookieId) {
                saveSelectionToSupabase(cookieId, null);
                localStorage.removeItem(`cookie-illustration:${cookieId}`);
              }

              // Réappliquer les styles dynamiques et sortir du handler
              // pour ne pas re-sauvegarder le costume_id avec step 0
              applyIllustrationStyles();
              return;
            }
          } else if (this.dataset.illustrationReplaceOr && illustration && step === 2) {
            // Si on passe en Mythique (image3 / step 2), on utilise l'illustration OR
            illustration.src = this.dataset.illustrationReplaceOr;
            illustrationChanged = true;

          } else if (this.dataset.illustrationReplace && illustration) {
            // Si on passe en Couleur, on définit comme illustration active
            illustration.src = this.dataset.illustrationReplace;
            illustrationChanged = true;
          }

          // GESTION ICONE RARETE DYNAMIQUE
          // Si step 2 (Mythique), on change l'icone
          const iconImg = this.closest('.costume-item').querySelector('.costume-icon img');
          if (iconImg) {
            if (step === 2) {
              // Sauvegarde l'original si pas déjà fait
              if (!iconImg.dataset.originalSrc) iconImg.dataset.originalSrc = iconImg.src;
              iconImg.src = "https://res.cloudinary.com/dkgfa4apm/image/upload/v1769035463/mythique_costume_ia9ohj.webp";
            } else {
              // Restaure l'original si on n'est pas en step 2
              if (iconImg.dataset.originalSrc) iconImg.src = iconImg.dataset.originalSrc;
            }
          }

          if (cookieId) {
            // Synchronisation Supabase consolidée (Costume ID + Step) pour éviter race condition
            saveSelectionToSupabase(cookieId, this.dataset.id, this.dataset.id, step);

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

  // Démarrer l'attachement des listeners
  attachListeners();
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

    // Ne garder que les 6 plus récents
    const recentCookies = data.slice(0, 6);

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
        }
      } catch (err) {
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
          icon.src = "https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034040/icon_new_oxzqna.webp";
          icon.alt = "New";
        } else if (cookie.type === "update") {
          icon.src = "https://res.cloudinary.com/dkgfa4apm/image/upload/v1769034041/icon_up_ancrwo.webp";
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
