# CLAUDE.md

This repo hosts two apps in one Vite/React tree:

1. **CapitalBridge marketing** — public site at `/` (companies, investors, deals, marketing pages).
2. **Lync admin** — internal ops console at `/admin` (listing review, support, logs, settings).

Marketing and admin share UI primitives, design tokens, and mock data. Admin has its own layout shell, auth gate, and admin-specific mock data.

## Stack

- **Build**: Vite 7, TypeScript 5.9 (`tsc --noEmit` for typecheck only)
- **UI**: React 19, Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (Radix primitives in `src/components/ui/*`)
- **Routing**: wouter 3 (`Switch`, `Route`, `Link`, `useLocation`, `useRoute`)
- **State / data**: `@tanstack/react-query` 5 (marketing public data only)
- **Charts**: recharts 2 (wrap with `src/components/ui/chart.tsx` `ChartContainer` when possible)
- **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers` + `Form*` primitives in `src/components/ui/form.tsx`
- **Dates**: `date-fns` (`formatDistanceToNow` for relative)
- **Icons**: `lucide-react`
- **Toasts**: in-app `useToast` from `src/hooks/use-toast.ts` (not sonner — sonner exists but isn't wired)
- **Mocks (marketing)**: `msw` worker in `public/`, handlers in `src/mocks/handlers.ts`, data in `src/mocks/data.ts`
- **Path alias**: `@/*` → `src/*` (configured in `tsconfig.json` and `vite.config.ts`)

No new deps may be added without flagging it in the PR/plan.

## Directory map

```
src/
├── App.tsx                       # root router — splits marketing vs admin
├── main.tsx
├── index.css                     # Tailwind v4 + theme tokens (HSL)
├── pages/                        # public marketing pages
├── components/
│   ├── layout.tsx                # public marketing shell (header/footer)
│   └── ui/                       # shared shadcn/ui primitives
├── hooks/                        # use-mobile, use-toast
├── lib/
│   ├── api-client/               # generated react-query hooks for public API
│   ├── format.ts                 # formatUSD
│   ├── constants.ts              # STAGES, INDUSTRIES, INVESTOR_TYPES
│   └── utils.ts                  # cn() helper
├── mocks/                        # public marketing mock data + msw handlers
└── admin/                        # all Lync admin code
    ├── types.ts                  # admin domain types
    ├── auth/
    │   ├── auth-gate.tsx         # redirect to /admin/login if no session
    │   └── use-admin-auth.tsx    # AdminAuthProvider + useAdminAuth hook
    ├── layout/
    │   ├── admin-layout.tsx      # outer shell composing sidebar + topbar
    │   ├── sidebar.tsx           # left nav rail
    │   └── topbar.tsx            # search, notifications, user menu
    ├── components/               # admin-only reusable components
    │   ├── data-table.tsx        # sortable, paginated table primitive
    │   ├── filter-bar.tsx        # search + select group
    │   ├── status-badge.tsx      # canonical listing-status badge
    │   ├── stat-card.tsx         # KPI card with sparkline
    │   ├── pending-banner.tsx
    │   ├── activity-feed.tsx
    │   ├── locations-bar-chart.tsx
    │   └── announcement-composer.tsx
    ├── pages/
    │   ├── login.tsx
    │   ├── home.tsx
    │   ├── businesses/{list,detail,requests}.tsx
    │   ├── funds/{list,detail,requests}.tsx
    │   ├── logs.tsx
    │   ├── support.tsx
    │   └── settings.tsx
    └── mocks/                    # admin mock data (pure TS modules, no msw)
        ├── admin-users.ts
        ├── admin-activity.ts
        ├── admin-stats.ts        # also exports aggregateByCity(), fundsByStrategy()
        ├── announcements.ts
        ├── business-status.ts    # adds admin-only status overlays to public companies/investors
        ├── listing-requests.ts
        ├── settings.ts
        ├── system-logs.ts
        └── tickets.ts
```

## Routing

`src/App.tsx` uses wouter's `useLocation()` at the root to dispatch:

- `/admin/login` → `<AdminLogin />` (no shell)
- `/admin` or `/admin/...` → `<AdminAuthGate>` → `<AdminLayout>` → inner `<Switch>`
- everything else → `<Layout>` (marketing shell) → marketing `<Switch>`

Admin route table:

| Path | Component |
|---|---|
| `/admin` | AdminHome |
| `/admin/businesses` | BusinessesList |
| `/admin/businesses/requests` | BusinessRequests |
| `/admin/businesses/:id` | BusinessDetail |
| `/admin/funds` | FundsList |
| `/admin/funds/requests` | FundRequests |
| `/admin/funds/:id` | FundDetail |
| `/admin/logs` | SystemLogs |
| `/admin/support` | SupportInbox |
| `/admin/settings/:tab?` | AdminSettings |

Order matters in wouter `<Switch>` — `requests` comes before `:id` so the literal segment wins over the dynamic one. Keep this ordering when adding routes.

## Admin auth (mock)

- Storage: `localStorage` key `lync.admin.session` (JSON `{ userId, signedInAt }`).
- Demo creds: `admin@lync.io` / `admin123` — exposed on the login screen on purpose; this is a demo build.
- `AdminAuthProvider` wraps the app at the root so the login page can call `useAdminAuth().login()`. Don't move it inside `AdminAuthGate`.
- `AdminAuthGate` redirects to `/admin/login` when there's no session. While the provider is loading from localStorage it shows a spinner.
- `logout()` clears the localStorage key and unsets the user; the topbar's user menu calls it.

## Mock data conventions

- All admin mock data is **pure TS** modules in `src/admin/mocks/*.ts`. **No MSW** for admin — pages import the arrays directly.
- Marketing mock data (`src/mocks/data.ts`) is shared. Admin pages reuse `companies`, `investors`, `companyDetails`, `investorDetails` from there.
- `business-status.ts` overlays admin-only fields (status, updatedAt, vintage) onto the marketing entities → exports `adminBusinesses` and `adminFunds`. Always import these in admin pages, not the raw marketing arrays.
- "Funds" in the admin UI = the existing public `Investor` type. Don't introduce a parallel Fund type unless funds and investors genuinely diverge.

## Adding a new admin page

1. Create `src/admin/pages/<area>/<name>.tsx`. Import primitives from `@/components/ui/*`, admin shared components from `@/admin/components/*`.
2. Register the route in `src/App.tsx` inside `AdminRouter()`'s `<Switch>` — keep literal-before-dynamic ordering.
3. Add a sidebar entry in `src/admin/layout/sidebar.tsx` if it's a top-level area.
4. If it needs new mock data, add a file under `src/admin/mocks/` and export typed arrays. Add a section to `src/admin/types.ts` if a new domain type is needed.
5. If you add a topbar title, edit the `titleMap` in `src/admin/layout/topbar.tsx` so the page header is correct.

## UI conventions

- Use shadcn primitives (`Card`, `Button`, `Input`, `Select`, `Tabs`, `Sheet`, `Dialog`, `Badge`, `Avatar`, etc.) — no raw HTML buttons/inputs in admin pages.
- Money: `formatUSD(n)` from `@/lib/format`.
- Relative time: `formatDistanceToNow(new Date(iso), { addSuffix: true })`.
- Listing status colors: always go through `<StatusBadge status={…} />` — don't add ad-hoc badges per page.
- Tables in admin: prefer `<DataTable>` from `@/admin/components/data-table` over raw `<Table>` (it gives sort + pagination for free).
- Filters: prefer `<FilterBar>` to keep search + selects consistent across list pages.
- Charts: recharts only; reuse the existing chart wrapper at `src/components/ui/chart.tsx` when feasible. The standalone uses in `LocationsBarChart` and the home pie are fine where the wrapper would add boilerplate.

## What NOT to do

- Don't install new runtime deps without proposing them first.
- Don't duplicate `companies` / `investors` mocks in admin — wrap with `business-status.ts`.
- Don't put admin pages under `src/pages/`. That folder is the public site.
- Don't bypass `AdminAuthGate` for admin pages.
- Don't rebuild table sort/pagination from scratch in pages — extend `DataTable`.
- Don't reach into recharts directly when the existing `ChartContainer` wrapper would do.
- Don't add route literals after dynamic ones (`:id` after `requests`).

## Commands

```
npm install
npm run dev          # http://localhost:5173
npm run build        # outputs dist/
npm run preview      # serves dist/
npm run typecheck    # tsc --noEmit
```

There's no lint script and no test suite at the moment. Treat `typecheck` + a successful `build` as the bar.

## Style

- Terse code, no premature abstraction. Match the surrounding file style.
- No comments on obvious code. Comments only for non-obvious *why*.
- Prefer composition over options-bag props. Lift to React Query / context only when prop drilling crosses three levels.
- Keep mock data files pure data (no JSX, no React). The exception is helper functions that derive shape (e.g. `aggregateByCity()`).
