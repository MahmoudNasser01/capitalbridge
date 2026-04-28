# CapitalBridge

A two-sided private capital marketplace inspired by linqto.com. Profitable businesses raising capital meet individual investors and PE/VC funds.

## Stack

- pnpm monorepo with TypeScript project references
- Frontend: React + Vite (artifact `capitalbridge`, served at `/`)
- Backend: Express 5 + Drizzle ORM (artifact `api-server`)
- Database: Postgres (Replit-managed via `DATABASE_URL`)
- API contract: OpenAPI 3 in `lib/api-spec/openapi.yaml`, codegen via Orval
  - `@workspace/api-client-react` — typed React Query hooks
  - `@workspace/api-zod` — runtime validation schemas
- Routing: wouter, with `<WouterRouter base={BASE_URL}>`
- UI: shadcn/ui + Tailwind v4 + recharts + framer-motion + react-hook-form

## Domain model

- **Companies** — profitable businesses raising capital. Have financials, team, documents, use of funds, raise progress.
- **Investors** — individuals (angels) and institutional (family_office, venture_capital, private_equity, hedge_fund, syndicate). Have AUM, check size, focus sectors, notable investments, partners.
- **Deals** — denormalized live raise events with status (open/closing_soon/funded/closed).
- **Activity** — recent platform events (listing_created, deal_funded, investor_joined, milestone, deal_opened).
- **Industries** — static taxonomy in `artifacts/api-server/src/lib/industries.ts` (saas, fintech, consumer, healthcare, industrial, energy, real_estate, ai).

## Routes (frontend)

- `/` — Marketing homepage with hero, platform stats, featured companies/investors, deal feed, recent activity
- `/companies`, `/companies/:id` — Browse + company profile with financials chart
- `/investors`, `/investors/:id` — Browse + investor profile
- `/deals` — Live deal flow table with status filters
- `/raise-capital` — Sales page + listing form (POST /companies)
- `/invest` — Sales page + investor signup form (POST /investors)
- `/how-it-works`, `/about`

## API endpoints (`/api`)

- `GET /platform/summary`, `GET /platform/activity`
- `GET /industries`
- `GET /companies` (filters: search, industry, stage, minRevenue, sort), `GET /companies/featured`, `GET /companies/stats`, `GET /companies/:id`, `POST /companies`
- `GET /investors` (filters: search, type, focus, minCheckSize, sort), `GET /investors/featured`, `GET /investors/stats`, `GET /investors/:id`, `POST /investors`
- `GET /deals?status=&limit=`

## Conventions

- Drizzle schemas in `lib/db/src/schema/*.ts`. Numeric columns serialize as strings from PG; `artifacts/api-server/src/lib/serializers.ts` converts back to numbers and dates to ISO strings.
- All API responses are validated with `@workspace/api-zod` schemas before sending.
- Form validation uses `@hookform/resolvers/zod` with `CreateCompanyBody` / `CreateInvestorBody` from `@workspace/api-zod`.
- Frontend calls API via the typed hooks from `@workspace/api-client-react` — never via `fetch` directly.
- Industry / stage / investor-type slug → display name mappings in `artifacts/capitalbridge/src/lib/constants.ts`.
- Money formatting in `artifacts/capitalbridge/src/lib/format.ts` (`formatUSD`).
- No emojis in UI.

## Seed data

Seeded via `pnpm --filter @workspace/scripts run seed` (script at `scripts/src/seed.ts`):
- 12 companies across all industries and stages
- 12 investors mixing all 6 types
- 20 deals (mix of statuses)
- 12 activity events
