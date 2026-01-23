# 🍪 Marche à suivre - Projet CookieRun Kingdom

## ✅ Ce qui est déjà fait

1. **Corrections effectuées** :
   - ✅ Table "Cookies" renommée en "cookies" dans `cookie_supabase.js`
   - ✅ Table "Cookies" renommée en "cookies" dans `app.js`
   - ✅ Suppression des fallbacks pour les tables majuscules
   - ✅ Utilisation exclusive de "cookies" et "costumes" en minuscule

2. **Structure existante** :
   - ✅ Page HTML unique : `pages/cookie_detail.html` (page principale)
   - ✅ JavaScript dynamique : `assets/js/cookie_supabase.js`
   - ✅ CSS dynamique : `assets/css/cookie_dynamic.css`
   - ✅ Tables Supabase : `cookies` et `costumes`
   - ✅ Nettoyage effectué : suppression de `cookie.html` (obsolète) et `migrate.js` (utilisait JSON)

## 📋 Prochaines étapes

### Étape 1 : Tester avec le Cookie Téméraire

1. **Vérifier les données dans Supabase** :
   - Ouvrez votre projet Supabase
   - Vérifiez que la table `cookies` contient le Cookie Téméraire
   - Vérifiez que la table `costumes` contient les costumes liés au Cookie Téméraire
   - Notez l'UUID ou l'ID du Cookie Téméraire

2. **Tester la page** :
   - Ouvrez `pages/cookie_detail.html?id=<UUID_DU_COOKIE_TEMERAIRE>`
   - Ou modifiez la valeur par défaut dans `cookie_supabase.js` ligne 13
   - Vérifiez que les données s'affichent correctement

### Étape 2 : Créer les tables manquantes dans Supabase

Vous avez actuellement `cookies` et `costumes`. Il vous faut créer les tables suivantes pour les données complètes :

#### Table `toppings` (Garnitures)
```sql
CREATE TABLE toppings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cookie_id UUID REFERENCES cookies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  images JSONB NOT NULL, -- Array de chemins d'images
  position INTEGER, -- Position dans l'ordre d'affichage
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `tartelettes`
```sql
CREATE TABLE tartelettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cookie_id UUID REFERENCES cookies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  images JSONB NOT NULL, -- Array de chemins d'images
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `biscuits`
```sql
CREATE TABLE biscuits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cookie_id UUID REFERENCES cookies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  images JSONB NOT NULL, -- Array de chemins d'images
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `promotions`
```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cookie_id UUID REFERENCES cookies(id) ON DELETE CASCADE,
  niveau INTEGER NOT NULL,
  images JSONB NOT NULL, -- Array de chemins d'images
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `ascension`
```sql
CREATE TABLE ascension (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cookie_id UUID REFERENCES cookies(id) ON DELETE CASCADE,
  etoiles JSONB NOT NULL, -- Array de chemins d'images pour les étoiles
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Étape 3 : Insérer les données du Cookie Téméraire dans Supabase

**⚠️ Important : Tout se fait directement dans Supabase, pas via des fichiers JSON**

#### Option A : Via l'interface Supabase (Table Editor)

1. **Insérer dans la table `cookies`** :
   - Ouvrez Supabase → Table Editor → `cookies`
   - Cliquez sur "Insert" → "Insert row"
   - Remplissez les champs (nom, illustration, badges, etc.)
   - Pour les champs JSONB (badges, navigation), utilisez le format JSON : `{"rarete": "...", "classe": "..."}`
   - Notez l'UUID généré automatiquement

2. **Insérer dans les tables liées** :
   - Répétez pour chaque table (`costumes`, `toppings`, `tartelettes`, `biscuits`, `promotions`, `ascension`)
   - Utilisez le même `cookie_id` (UUID du cookie) pour toutes les entrées liées
   - Pour les colonnes `images` (JSONB), insérez un tableau : `["../assets/images/...", "../assets/images/..."]`

#### Option B : Via SQL (plus rapide pour plusieurs entrées)

```sql
-- 1. Insérer le cookie principal
INSERT INTO cookies (nom, pageTitle, illustration, badges, icon_tete)
VALUES (
  'Cookie Téméraire',
  'Cookie Téméraire',
  '../assets/images/cookies/cookie_temeraire/cookie_temeraire_gif.webp',
  '{"rarete": "../assets/images/rarete/normal.webp", "classe": "../assets/images/classe/assaut.webp", "element": null}'::jsonb,
  '../assets/images/icones/...'
) RETURNING id;

-- 2. Notez l'UUID retourné, puis insérez les costumes
INSERT INTO costumes (cookie_id, nom, image, rareteIcon)
VALUES 
  ('<UUID_DU_COOKIE>', 'Costume original', '["../assets/images/..."]'::jsonb, '../assets/images/rarete/original_costume.webp'),
  ('<UUID_DU_COOKIE>', 'Fée des fleurs nocturnes', '["../assets/images/..."]'::jsonb, '../assets/images/rarete/legendaire_costume.webp');

-- 3. Répétez pour toppings, tartelettes, biscuits, promotions, ascension
```

3. **Adapter `cookie_supabase.js` pour charger les nouvelles tables** :
   - Ajouter des requêtes pour charger `toppings`, `tartelettes`, `biscuits`, `promotions`, `ascension`
   - Les intégrer dans l'objet `cookieData` avant le rendu

### Étape 4 : Structure de la table `cookies` recommandée

Assurez-vous que votre table `cookies` contient au minimum ces colonnes :

```sql
-- Colonnes essentielles
id UUID PRIMARY KEY
nom TEXT NOT NULL
pageTitle TEXT
illustration TEXT -- Chemin vers l'image principale
icon_tete TEXT -- Pour la favicon

-- Badges (peuvent être des chemins ou des JSON)
badges JSONB -- { "rarete": "...", "classe": "...", "element": "..." }

-- Navigation
navigation JSONB -- { "precedent": {...}, "suivant": {...} }

-- Thème dynamique (optionnel)
theme_primary TEXT
theme_secondary TEXT
theme_accent TEXT
theme_text TEXT
bg_color TEXT
bg_image TEXT
title_color TEXT
pos_illustration_top TEXT
pos_illustration_left TEXT

-- Métadonnées
cssFile TEXT -- Pour compatibilité si nécessaire
jsFile TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### Étape 5 : Mettre à jour `cookie_supabase.js`

Ajouter le chargement des nouvelles tables dans la fonction `loadCookieData()` :

```javascript
// Après le chargement des costumes (ligne ~108)
// Charger les toppings
const { data: toppings } = await supabase
  .from('toppings')
  .select('*')
  .eq('cookie_id', cookieData.uuid || cookieData.id)
  .order('position');
if (toppings) cookieData.toppings = toppings.map(t => ({
  id: t.id,
  type: t.type,
  images: Array.isArray(t.images) ? t.images : JSON.parse(t.images)
}));

// Répéter pour tartelettes, biscuits, promotions, ascension
```

### Étape 6 : Tester avec tous les cookies

Une fois que le Cookie Téméraire fonctionne :

1. **Insérer les autres cookies dans Supabase** :
   - Répétez le processus pour chaque cookie
   - Insérez directement dans Supabase via l'interface ou SQL
   - **Gain d'espace disque** : Plus besoin de fichiers JSON locaux, tout est dans Supabase

2. **Vérifier la navigation** :
   - S'assurer que les liens "Cookie précédent" et "Cookie suivant" fonctionnent
   - Utiliser les UUIDs des cookies dans les URLs : `cookie_detail.html?id=<UUID>`

## 🔧 Points d'attention

1. **Chemins d'images** :
   - Vérifier que les chemins dans Supabase correspondent à votre structure de fichiers
   - Les chemins peuvent être relatifs (`../assets/images/...`) ou absolus

2. **Format JSON** :
   - Les colonnes `images` peuvent être stockées en JSONB (recommandé) ou TEXT
   - Si TEXT, utiliser `JSON.parse()` lors du chargement

3. **Relations** :
   - Utiliser `cookie_id` pour lier les tables enfants à `cookies`
   - S'assurer que les foreign keys sont bien configurées

4. **Performance** :
   - Utiliser `.select()` avec des colonnes spécifiques si nécessaire
   - Ajouter des index sur `cookie_id` dans toutes les tables enfants

## 📝 Checklist finale

- [ ] Cookie Téméraire s'affiche correctement avec données de base
- [ ] Table `toppings` créée et testée
- [ ] Table `tartelettes` créée et testée
- [ ] Table `biscuits` créée et testée
- [ ] Table `promotions` créée et testée
- [ ] Table `ascension` créée et testée
- [ ] Données du Cookie Téméraire insérées directement dans Supabase (toutes les tables)
- [ ] `cookie_supabase.js` charge toutes les données
- [ ] Tous les éléments s'affichent correctement sur la page
- [ ] Les interactions (clic sur images, costumes) fonctionnent
- [ ] Navigation entre cookies fonctionne

## 🚀 Une fois terminé

Vous aurez une page unique (`cookie_detail.html`) qui :
- Charge dynamiquement les données depuis Supabase
- S'adapte à n'importe quel cookie
- Affiche tous les éléments (illustration, badges, toppings, tartelettes, biscuits, promotions, ascension, costumes)
- Permet la navigation entre cookies
- Sauvegarde l'état dans le localStorage

---

**Note** : Si vous avez besoin d'aide pour une étape spécifique, n'hésitez pas à demander !
