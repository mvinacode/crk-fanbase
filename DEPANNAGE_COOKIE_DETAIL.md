# 🔧 Dépannage - Page cookie_detail.html

## Problèmes courants et solutions

### 1. ❌ Erreur : "Failed to load module" ou "Cannot use import statement"

**Cause** : La page utilise des modules ES6 qui nécessitent un serveur HTTP.

**Solution** : Vous devez démarrer le serveur Vite :

```bash
npm run dev
```

Puis ouvrez : `http://localhost:3000/pages/cookie_detail.html?id=<UUID_DU_COOKIE>`

⚠️ **Ne pas ouvrir directement le fichier HTML** (file://), cela ne fonctionnera pas avec les modules ES6.

---

### 2. ❌ Erreur : "Supabase is not defined" ou variables d'environnement manquantes

**Cause** : Les clés Supabase ne sont pas configurées.

**Solution** : Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

**Où trouver ces valeurs** :
1. Ouvrez votre projet Supabase
2. Allez dans **Settings** → **API**
3. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

⚠️ **Important** : Après avoir créé/modifié le fichier `.env`, **redémarrez le serveur Vite** :
```bash
# Arrêtez le serveur (Ctrl+C) puis relancez :
npm run dev
```

---

### 3. ❌ Erreur : "Cookie non trouvé" ou données vides

**Causes possibles** :
- L'UUID dans l'URL ne correspond à aucun cookie dans Supabase
- La colonne utilisée pour l'ID n'est pas la bonne (`uuid` vs `id`)

**Solution** :
1. Vérifiez dans Supabase que votre cookie existe
2. Vérifiez si votre table utilise `id` ou `uuid` comme colonne principale
3. Utilisez l'URL avec le bon ID :
   ```
   http://localhost:3000/pages/cookie_detail.html?id=<UUID_OU_ID>
   ```

**Pour tester avec l'ID par défaut** :
- Si vous n'avez pas d'ID dans l'URL, le code utilise par défaut : `fa4da28e-bff9-441e-b466-a6464c1d266a`
- Assurez-vous que ce cookie existe dans votre table Supabase

---

### 4. ❌ Erreur : "Failed to fetch" ou erreur CORS

**Cause** : Problème de connexion à Supabase ou clés incorrectes.

**Solution** :
1. Vérifiez que vos clés Supabase sont correctes dans `.env`
2. Vérifiez que votre projet Supabase est actif
3. Vérifiez la console du navigateur (F12) pour les détails de l'erreur

---

### 5. ❌ La page s'ouvre mais reste blanche

**Causes possibles** :
- Erreur JavaScript silencieuse
- Le header ne se charge pas
- Les données ne se chargent pas

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs dans l'onglet **Console**
3. Regardez l'onglet **Network** pour voir si les requêtes échouent
4. Vérifiez que le fichier `includes/header_cookie.html` existe

---

## ✅ Checklist de vérification

- [ ] Le serveur Vite est démarré (`npm run dev`)
- [ ] Le fichier `.env` existe avec les bonnes clés Supabase
- [ ] Le serveur a été redémarré après la création/modification de `.env`
- [ ] La page est ouverte via `http://localhost:3000/...` (pas file://)
- [ ] L'UUID du cookie dans l'URL existe dans Supabase
- [ ] La table `cookies` existe dans Supabase
- [ ] La console du navigateur (F12) ne montre pas d'erreurs

---

## 🚀 Marche à suivre complète

1. **Créer le fichier `.env`** (à la racine du projet) :
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

3. **Ouvrir la page** :
   ```
   http://localhost:3000/pages/cookie_detail.html?id=<UUID_DU_COOKIE>
   ```

4. **Vérifier la console** (F12) pour voir les logs :
   - Vous devriez voir : "Supabase est prêt !"
   - Puis : "Tentative de chargement pour ID: ..."
   - Puis : "✅ Données Cookie chargées: ..."

---

## 📝 Note importante

Le fichier `cookie_detail.html` utilise des **modules ES6** (`import/export`), ce qui signifie qu'il **DOIT** être servi via un serveur HTTP (Vite). 

**Ne fonctionne PAS** :
- ❌ Ouvrir directement le fichier HTML (double-clic)
- ❌ Utiliser `file:///` dans l'URL

**Fonctionne** :
- ✅ `http://localhost:3000/pages/cookie_detail.html`
- ✅ Serveur de production

---

Si le problème persiste, vérifiez la console du navigateur (F12) et partagez les erreurs que vous voyez.
