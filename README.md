# Kasa

Plateforme de location de logements entre particuliers. Le site permet de parcourir les logements, de consulter le détail de chacun (galerie photos avec lightbox, description, équipements, note, tags), de gérer une liste de favoris et de se connecter à son compte.

## Description du projet

Le projet est un monorepo composé de deux applications indépendantes (il n'y a pas de `package.json` à la racine) :

| Dossier | Rôle | Stack | Port |
|---|---|---|---|
| `api/` | Backend REST | Express 5 + SQLite | 3000 |
| `app/` | Frontend | Next.js 16 (App Router) + React 19 | 3001 |

### Fonctionnalités

- **Accueil** (`/`) — liste des logements sous forme de cartes
- **Détail d'un logement** (`/logement/[id]`) — carrousel/lightbox d'images, description, équipements, hôte, note, tags
- **Favoris** (`/favoris`) — ajout/retrait par le bouton ♥, persistés dans le `localStorage` (aucun compte requis)
- **Connexion** (`/connexion`) — authentification par email + mot de passe (JWT, hachage scrypt côté API), message d'erreur en cas d'identifiants invalides
- **Messagerie** (`/messagerie`) — démonstration visuelle (conversations fictives, envoi local) : aucun backend de messagerie n'existe à ce stade
- **À propos** (`/a-propos`) et **page 404** personnalisée

### Architecture

- Le backend suit un découpage strict **routes → controllers → services → base de données**. La base SQLite (`api/data/kasa.sqlite3`) est créée et alimentée automatiquement au premier démarrage à partir de `api/data/properties.json`.
- Le frontend utilise des **Server Components** qui appellent l'API directement côté serveur (`app/src/lib/api.js`). Côté navigateur, les appels passent par des rewrites Next (`/api/*`, `/auth/*`, `/uploads/*` → port 3000), donc tout reste en same-origin (pas de CORS).
- Les favoris et la session de connexion sont gérés par des contextes React (`FavoritesContext`, `AuthContext`) persistés dans le `localStorage` (clés `kasa:favorites` et `kasa:auth`).
- Styles en **CSS Modules** (pas de framework CSS), maquettes Figma dans `app/figma/`.
- Tests unitaires avec **Vitest + Testing Library** (carrousel/lightbox et système de favoris).

## Pré-requis pour l'installation

- **Node.js ≥ 20.9** (testé avec Node 23) — Next.js 16 ne fonctionne pas avec les versions antérieures
- **npm** (fourni avec Node.js)

Aucune base de données à installer : SQLite est embarqué et le fichier de données est créé automatiquement.

## Installation

Installer les dépendances de chaque partie séparément :

```bash
# Backend
cd api
npm install

# Frontend
cd ../app
npm install
```

Configuration optionnelle (les valeurs par défaut suffisent en local) :

- `api/` : `PORT` (défaut `3000`), `JWT_SECRET` (défaut `change-me-in-prod` — à changer en production), `JWT_EXPIRES_IN` (défaut `7d`)
- `app/.env.local` : `API_URL` (défaut `http://localhost:3000`)

## Lancement du projet

Les deux serveurs doivent tourner en même temps, dans deux terminaux :

```bash
# Terminal 1 — API (port 3000)
cd api
npm start
```

```bash
# Terminal 2 — Frontend (port 3001)
cd app
npm run dev
```

Le site est alors accessible sur **http://localhost:3001**.

- Documentation interactive de l'API : http://localhost:3000/docs.html
- Compte de démonstration pour la page de connexion : `test@kasa.fr` / `Kasa#2026!Test`

### Commandes utiles (frontend)

```bash
npm test          # lance les tests unitaires (Vitest)
npm run test:watch
npm run lint      # ESLint
npm run build     # build de production
```

### Réinitialiser la base de données

Arrêter l'API, supprimer `api/data/kasa.sqlite3`, puis relancer : le schéma est recréé et les logements rechargés depuis `api/data/properties.json`. (Le compte de démonstration devra être recréé via `POST /auth/register`.)

## Déploiement (Vercel)

Le back-end (serveur persistant + SQLite sur disque) n'est pas hébergé : conformément aux consignes, la version en ligne fonctionne en **mode mock**. Avec la variable d'environnement `NEXT_PUBLIC_MOCK_DATA=1` :

- les logements proviennent d'un snapshot des réponses réelles de l'API (`app/src/lib/mock/properties.json`) ;
- la connexion est simulée côté client avec le compte de démonstration (`test@kasa.fr` / `Kasa#2026!Test`), y compris le message d'erreur en cas d'identifiants invalides.

Déploiement : projet Vercel pointé sur le dossier `app/` avec `NEXT_PUBLIC_MOCK_DATA=1` dans les variables d'environnement. En local, la variable n'est pas définie et l'application utilise la vraie API.
