# `packages/app`

This document describes how the frontend package is organized and how its files work together.

## High-Level Layout

```text
packages/app/
├── index.html              # Main app shell entry (served for /app)
├── package.json            # Frontend scripts/dependencies
├── tsconfig.json           # TypeScript settings (bundler mode)
├── vite.config.js          # Build output + dev server/proxy configuration
├── public/
│   ├── login.html          # Standalone login page
│   ├── signup.html         # Standalone signup page
│   ├── icons/              # UI icon assets
│   ├── images/             # Image assets
│   └── styles/
│       ├── auth.css        # Login/signup styling
│       └── styles.css      # App-wide styling
└── src/
		├── main.ts             # App bootstrap + Mustang providers + startup auth check
		├── router.ts           # Route table and route-to-view mapping
		├── model.ts            # App state model definition + initial state
		├── messages.ts         # Typed message union for MVU updates
		├── update.ts           # MVU update function (state transitions + side effects)
		├── components/         # Reusable custom elements
		└── views/              # Page-level custom elements
```

## Architectural Layers

### 1) Bootstrap Layer (`src/main.ts`)

- Validates any stored JWT by calling `/api/auth/me` before app initialization.
- Registers Mustang providers and app primitives:
	- `mu-auth` (authentication context)
	- `mu-history` (history/navigation context)
	- `mu-store` (MVU store using `update` + `init`)
	- `mu-switch` (route switching using `routes`)

### 2) Routing Layer (`src/router.ts`)

- Defines path-to-view mapping for the app shell under `/app`.
- Imports and exposes all page views used by the route switch.
- Uses `requiresAuth(...)` guard to redirect unauthenticated users to `login.html`.
- Supports route modes such as aggregate and all-runs tracking views.

### 3) State Layer (MVU)

- `model.ts`: canonical app state shape (`Model`) and `init` value.
- `messages.ts`: typed `Msg` union for all supported store messages.
- `update.ts`: handles message effects/state changes:
	- loads current user (`user/load`)
	- sets current user (`user/set`)
	- clears user (`user/clear`)

> **Attention**: The MVU pattern was started by the previous team and is continued here for consistency. Very few elements of the current iteration of the app use the MVU store, but it provides a clear path for future state management as the app grows in complexity.

### 4) UI Composition Layer

- `components/` = reusable UI building blocks:
- `views/` = page-level composition for each route.

## Runtime Flow

Typical app startup/request flow:

1. `main.ts` checks local token validity.
2. Providers and route switch are defined.
3. Router renders the matched view.
4. Protected routes call `requiresAuth` and redirect when needed.
5. Views/components dispatch MVU messages; `update.ts` applies state updates.

## Build and Dev Structure

- Development server: `npm run dev` (Vite on port `5173`).
- API proxy: `/api` requests forwarded to backend on `http://localhost:3000`.
- Production build: `npm run build` outputs static bundle in `dist/`.
- Multi-entry build inputs: `index.html`, `public/login.html`, `public/signup.html`.

## Design Summary

`packages/app` follows a modular frontend layout:

- **Entry/bootstrap** (`main.ts`)
- **Navigation/routing** (`router.ts`)
- **Centralized state updates** (`model.ts`, `messages.ts`, `update.ts`)
- **Reusable UI components** (`components/`)
- **Page-level views** (`views/`)

