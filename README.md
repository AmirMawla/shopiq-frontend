# ShopIQ — Frontend (Angular)

Customer-facing **ShopIQ** web app: product browsing, cart, checkout, orders, account, seller and admin areas. Built with **Angular 21** (standalone components), **RxJS**, and **Bootstrap 5** for layout utilities, plus custom ShopIQ styling (`styles.css`, CSS variables).

## Requirements

- **Node.js** 18+ (LTS recommended)
- **npm** (see `packageManager` in `package.json`)

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **API URL**

   The app reads the backend base URL from Angular environments:

   - `src/environments/environment.development.ts` — default `apiUrl` for local dev (e.g. `http://localhost:1234` or `http://localhost:3000` depending on your API `PORT`)

   Align `apiUrl` with whatever port your **E_CommerceBack_(Node)** server uses.

3. **Run the dev server**

   ```bash
   npm start
   ```

   Opens at **http://localhost:4200** (Angular default).

4. **Production build**

   ```bash
   npm run build
   ```

   Output under `dist/shopiq-frontend/`.

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm start` / `ng serve` | Dev server with live reload |
| `npm run build` | Production build |
| `npm run watch` | Development build in watch mode |
| `npm test` | Unit tests (Karma/Vitest per project setup) |

## Project layout (high level)

| Path | Role |
|------|------|
| `src/app/app.routes.ts` | Route configuration |
| `src/app/components/features/customer/` | Shop, product list, product details, cart, orders, etc. |
| `src/app/components/features/seller/` | Seller dashboard and products |
| `src/app/components/features/admin/` | Admin dashboard and management |
| `src/app/components/layouts/` | Customer / seller / admin shells (nav, sidebar) |
| `src/app/components/shared/` | Shared UI (e.g. navbar, product card) |
| `src/app/services/` | HTTP services (API, cart, auth, …) |
| `src/app/guards/` | Route guards (auth, roles) |
| `src/app/models/` | TypeScript interfaces for API models |
| `src/environments/` | `apiUrl` and environment flags |

## Backend

This UI expects the **ShopIQ Node API** (sibling folder `E_CommerceBack_(Node)`). CORS must allow the frontend origin (e.g. `http://localhost:4200`). Authenticated calls send `Authorization: Bearer <token>` from `localStorage` where applicable.

## Conventions

- **Standalone components** — `imports` in each component.
- **Signals** used in some shared components (e.g. navbar).
- Styling uses CSS variables such as `--primary`, `--panel`, `--border` (see `src/styles.css`).

## License

Private / project use unless otherwise specified.
