# CapitalBridge + Lync

A single Vite/React app hosting two surfaces:

- **CapitalBridge** — the public marketplace (companies, funds, deals, marketing pages) at `/`.
- **Lync** — the internal admin / operations console at `/admin`.

The Lync side is a feature-rich demo built entirely on static mock data: listing reviews, fund management, system logs, support tickets, announcements, and configurable settings.

## Quick start

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. Open:

- `/` — public marketing site
- `/admin` — Lync admin (will redirect to `/admin/login` first time)

## Demo credentials

The Lync admin uses a **mock** login persisted in `localStorage`. There is no backend.

| Field | Value |
|---|---|
| Email | `admin@lync.io` |
| Password | `admin123` |

The credentials are also displayed on the login screen for convenience.

## Build & preview

```bash
npm run build        # outputs dist/
npm run preview      # serves the production build locally
```

Type-check only (no emit):

```bash
npm run typecheck
```

## Project structure

```
src/
├── App.tsx                 # root router (marketing vs admin split)
├── pages/                  # public marketing pages
├── components/
│   ├── layout.tsx          # public marketing shell
│   └── ui/                 # shadcn/ui primitives (shared)
├── lib/                    # format helpers, constants, utils, generated API hooks
├── mocks/                  # public marketing mock data + msw
├── hooks/                  # use-mobile, use-toast
└── admin/                  # all Lync admin code
    ├── auth/               # mock auth gate + provider
    ├── layout/             # admin shell (sidebar, topbar)
    ├── components/         # admin shared components
    ├── pages/              # admin pages (login, home, businesses, funds, …)
    ├── mocks/              # admin mock data (pure TS)
    └── types.ts            # admin domain types
```

## Routes

### Public

| Path | Page |
|---|---|
| `/` | Home |
| `/companies` | Browse companies |
| `/companies/:id` | Company profile |
| `/investors` | Browse investors |
| `/investors/:id` | Investor profile |
| `/deals` | Live deals |
| `/raise-capital` | Raise capital form |
| `/invest` | Investor onboarding |
| `/how-it-works`, `/about` | Marketing pages |

### Lync admin

| Path | Page | Description |
|---|---|---|
| `/admin/login` | Login | Mock auth screen |
| `/admin` | Home | KPIs, locations chart, funds-by-strategy, recent activity, announcements, pending listings banner |
| `/admin/businesses` | Businesses list | Filterable table of all listed businesses, with `Add business` modal |
| `/admin/businesses/requests` | Business listing requests | Pending / Changes requested / Approved / Rejected tabs |
| `/admin/businesses/:id` | Business profile | Overview, financials chart, documents, team, internal notes, admin timeline |
| `/admin/funds` | Funds list | Same shape as businesses, fund-specific columns (AUM, strategy, vintage, ticket size) |
| `/admin/funds/requests` | Fund listing requests | Same tabbed flow |
| `/admin/funds/:id` | Fund profile | Overview, thesis, portfolio, partners, admin timeline |
| `/admin/logs` | System logs | Filterable log feed with severity counts and a JSON detail drawer |
| `/admin/support` | Support inbox | Two-pane ticket inbox with thread, reply, assignee/status/priority controls |
| `/admin/settings` | Settings | Tabbed: Profile · Team · Notifications · Integrations · Branding · Billing · API Keys · Security |

## Tech stack

- **Build**: Vite 7, TypeScript 5.9
- **UI**: React 19, Tailwind v4, shadcn/ui (Radix primitives)
- **Routing**: wouter 3
- **Data**: `@tanstack/react-query` (public side); pure TS mocks (admin side)
- **Charts**: recharts 2
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Dates**: date-fns
- **Mocks**: msw (public side only)

No new runtime dependencies were added for Lync — everything reuses what was already in the project.

## Mock data

All Lync data is static and lives in `src/admin/mocks/*.ts`. Pages import the arrays directly; there's no service worker or HTTP mock for the admin surface. Edit the files in place to change what you see.

The admin layer reuses the existing public mock data (`src/mocks/data.ts`) for businesses (companies) and funds (investors), and overlays admin-specific fields (status, vintage, updatedAt) via `src/admin/mocks/business-status.ts`.

## Deployment

Vercel config in `vercel.json` (already present). Build output is `dist/`. Static SPA — no server functions required.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). No IE.

## Notes

- The login is a cosmetic gate; clearing `localStorage` resets it.
- The "Add business" / "Add fund" modals don't persist new entities — they show a toast and close. Wire up real persistence when a backend lands.
- Approving / rejecting listings updates local component state only; refresh to reset.
- `system-logs.ts` deterministically generates ~120 entries from a seed so the UI looks populated.
