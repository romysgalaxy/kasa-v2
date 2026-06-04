# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Kasa is a two-part monorepo. There is **no root `package.json`** — each part is installed and run independently.

- `api/` — Express 5 + SQLite REST backend. Runs on **port 3000**.
- `app/` — Next.js 16 (App Router, React 19) frontend. Runs on **port 3001**.

The frontend talks to the backend in two ways depending on where the code runs (see "How the two parts connect" below), so both servers normally run at once during development.

## Commands

### Backend (`api/`)
- `npm install` — install dependencies
- `npm start` — start the server (`node ./bin/www`) on port 3000 (override with `PORT`)
- There is no test or lint script for the API.
- Env vars: `PORT` (default 3000), `JWT_SECRET` (default `change-me-in-prod` — set a strong value in prod), `JWT_EXPIRES_IN` (default `7d`).
- OpenAPI spec: `api/public/openapi.json`; interactive docs at http://localhost:3000/docs.html once running.

### Frontend (`app/`)
- `npm run dev` — dev server on port 3001
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm test` — run all Vitest tests once
- `npm run test:watch` — Vitest in watch mode
- Run a single test file: `npx vitest run src/components/Carousel.test.js`
- Env var: `API_URL` (default `http://localhost:3000`) in `app/.env.local`.

## How the two parts connect

This split is the single most important thing to understand before touching data-fetching code:

- **Server Components** (e.g. `app/src/app/page.js`) call the API directly via `API_URL` through helpers in `app/src/lib/api.js`. These run on the Next server, so they reach `http://localhost:3000` directly.
- **The browser** never calls port 3000 directly. `app/next.config.mjs` defines `rewrites()` that proxy `/api/*`, `/auth/*`, and `/uploads/*` from the Next origin (3001) to the Express server — same-origin, so no CORS. Client-side fetches must use these relative paths.

When adding a new API call, decide first whether it runs on the server (use `API_URL` / `lib/api.js`) or in the browser (use a relative `/api/...` path that hits the rewrite).

## Backend architecture

Strict **routes → controllers → services → db** layering:

- `routes/` — Express routers. `routes/api.js` is the main one (mounted at `/api`); also `auth.js` (`/auth`), `users.js`, `index.js`. Routes attach auth middleware and delegate to controllers.
- `controllers/` — HTTP glue: read `req`, call a service, map errors to status codes (`statusFromError` pattern — services throw `Error` objects with a `.status` property; `UNIQUE`/`PRIMARY KEY` violations become 409).
- `services/` — all business logic and SQL. Services receive `db` as their first argument; they never touch `req`/`res`.
- `db.js` — opens the SQLite file, promisifies `run`/`get`/`all`/`exec` (`db.runAsync`, etc.), creates the schema, and seeds from `data/properties.json` on first run if `properties` is empty.

The DB connection is created once at startup in `app.js` (`initialize()`) and stored on `app.locals.db`. Access it inside handlers as `req.app.locals.db`. The `dbReady` middleware (applied to all `/api` routes) returns 503 until the DB is ready.

### Auth & roles
JWT via `Authorization: Bearer <token>`. Roles: `client`, `owner`, `admin`. Middleware in `middlewares/auth.js`:
- `authenticate` — populates `req.user` if a valid token is present, never blocks.
- `requireAuth` — 401 if not logged in.
- `requireRole([...])` — 403 unless the user's role is in the list (e.g. `owner`/`admin` for property writes and uploads).
- `requireAdmin`, `requireSelfOrAdmin(param)` — admin-only, or "own resource or admin".

Passwords are hashed with `scrypt` and stored as `scrypt:<salt>:<hash>` (see `services/authService.js`).

### Database
SQLite file at `api/data/kasa.sqlite3` (persistent). Tables: `users`, `properties`, `property_pictures`, `property_equipments`, `property_tags`, `ratings`, `favorites`. Property slugs are auto-generated and unique. **To reset:** stop the server, delete `data/kasa.sqlite3`, restart (schema recreated + reseeded from `data/properties.json`).

Uploads go to `api/public/uploads/` (served statically) via `multer`.

## Frontend architecture

Next.js App Router under `app/src/app/`. Path alias `@/*` → `src/*` (`jsconfig.json`).

- Pages are **Server Components** by default and fetch via `lib/api.js`. Routes: `/` (home), `/logement/[id]` (property detail), `/favoris` (favorites), `/a-propos` (about), `/connexion` (login). Unknown routes render `app/not-found.js` (custom 404). Each route has a co-located `page.module.css`; loading UI comes from the root `loading.js` (plus a route-level one in `logement/[id]`).
- Reusable components live in `src/components/` with co-located CSS Modules (`*.module.css`) and tests (`*.test.js`).
- Favorites are **client-side only**, persisted to `localStorage` under key `kasa:favorites` via `src/context/FavoritesContext.js` (a `"use client"` context provider wrapping the app in `layout.js`). The provider guards hydration (`hydrated` flag) to avoid server/client mismatch — preserve that pattern when editing it.
- Login session follows the same pattern: `src/context/AuthContext.js` posts to `/auth/login` (through the rewrite) and persists `{ token, user }` to `localStorage` under `kasa:auth`, with the same `hydrated` guard. Only the login endpoint is wired up front-side (register/reset exist in the API but have no UI). A test account exists in the dev DB: `test@kasa.fr` / `Kasa#2026!Test` (created via `POST /auth/register`; recreate it after a DB reset).
- Styling is plain CSS Modules (no Tailwind). Global styles in `app/globals.css`; font is Montserrat via `next/font/google`.

### Testing
Vitest + Testing Library + jsdom. Config note: the project writes **JSX inside `.js` files**, so `vitest.config.mjs` forces the oxc transformer to treat `.js` as JSX — keep that in mind if adding test tooling. `vitest.setup.js` mocks `next/image` as a plain `<img>` and runs `cleanup()` after each test. Tests are co-located with components (`*.test.js`).

## Important: Next.js version

`app/AGENTS.md` (referenced by `app/CLAUDE.md`) warns that this is **Next.js 16**, which has breaking changes vs. older training data. Consult `app/node_modules/next/dist/docs/` before writing or changing Next-specific code, and heed deprecation notices.
