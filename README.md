# CRK Site - Collection Cookie Run Kingdom

Ce projet est une application web privée permettant de gérer et visualiser une collection de cookies pour le jeu **CookieRun Kingdom**. Il utilise **Supabase** pour la gestion des données et de l'authentification.

## 🚀 Fonctionnalités

- **Tableau de bord** : Visualisation des derniers ajouts et modifications de cookies.
- **Liste des Cookies** : Affichage complet de la collection avec système de filtrage (Rareté, Rôle, Type de dégâts).
- **Détails des Cookies** : Fiches détaillées incluant les costumes, les niveaux d'éveil et les illustrations dynamiques.
- **Authentification** : Système de connexion pour sauvegarder l'état de sa collection personnelle.

## 🛠️ Stack Technique

- **Frontend** : HTML5, CSS3, JavaScript (ES6+).
- **Outil de Build** : [Vite](https://vitejs.dev/) pour le développement et la compilation.
- **Backend** : [Supabase](https://supabase.com/) (Base de données PostgreSQL & Authentification).
- **Design** : Maquette Figma dédiée.

## 📁 Structure du Projet

```
crk-fanbase/
├── assets/             # Logique JavaScript (traitée par Vite)
├── pages/              # Pages HTML secondaires (Détails, Liste, Login)
├── public/             # Assets statiques servis directement
│   └── assets/         # CSS, Données JSON (maj, navigation) et Polices
├── index.html          # Page d'accueil principale
├── vite.config.js      # Configuration de l'outil Vite
└── package.json        # Configuration du projet et dépendances
```

---
*Projet privé réalisé pour la gestion de collection de CookieRun Kingdom.*
