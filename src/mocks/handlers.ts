import { http, HttpResponse } from "msw";
import {
  companies,
  companyDetails,
  companyStats,
  deals,
  health,
  industries,
  investorDetails,
  investorStats,
  investors,
  platformSummary,
  recentActivity,
} from "./data";
import type {
  Company,
  CreateCompanyInput,
  CreateInvestorInput,
  Investor,
} from "@/lib/api-client";

const SORT_BY_REVENUE = (a: Company, b: Company) => b.annualRevenue - a.annualRevenue;
const SORT_BY_RAISE = (a: Company, b: Company) => b.raiseAmount - a.raiseAmount;
const SORT_BY_NEWEST = (a: Company, b: Company) => b.foundedYear - a.foundedYear;

function applyCompanyFilters(url: URL, list: Company[]): Company[] {
  const search = url.searchParams.get("search")?.toLowerCase() ?? "";
  const industry = url.searchParams.get("industry");
  const stage = url.searchParams.get("stage");
  const minRevenue = url.searchParams.get("minRevenue");
  const sort = url.searchParams.get("sort");

  let result = list.slice();

  if (search) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.tagline.toLowerCase().includes(search) ||
        c.industry.toLowerCase().includes(search),
    );
  }
  if (industry) {
    const slug = industry.toLowerCase();
    result = result.filter((c) => c.industry.toLowerCase().replace(/[^a-z]/g, "") === slug.replace(/[^a-z]/g, "") || c.industry.toLowerCase().includes(slug));
  }
  if (stage) result = result.filter((c) => c.stage === stage);
  if (minRevenue) {
    const min = Number(minRevenue);
    if (!Number.isNaN(min)) result = result.filter((c) => c.annualRevenue >= min);
  }
  switch (sort) {
    case "newest":
      result.sort(SORT_BY_NEWEST);
      break;
    case "raise_size":
      result.sort(SORT_BY_RAISE);
      break;
    case "revenue":
      result.sort(SORT_BY_REVENUE);
      break;
    case "trending":
    default:
      result.sort((a, b) => b.committedAmount / b.raiseAmount - a.committedAmount / a.raiseAmount);
  }
  return result;
}

function applyInvestorFilters(url: URL, list: Investor[]): Investor[] {
  const search = url.searchParams.get("search")?.toLowerCase() ?? "";
  const type = url.searchParams.get("type");
  const focus = url.searchParams.get("focus")?.toLowerCase();
  const minCheckSize = url.searchParams.get("minCheckSize");
  const sort = url.searchParams.get("sort");

  let result = list.slice();

  if (search) {
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(search) ||
        i.tagline.toLowerCase().includes(search) ||
        i.location.toLowerCase().includes(search),
    );
  }
  if (type) result = result.filter((i) => i.type === type);
  if (focus) result = result.filter((i) => i.focusSectors.some((s) => s.toLowerCase().includes(focus)));
  if (minCheckSize) {
    const min = Number(minCheckSize);
    if (!Number.isNaN(min)) result = result.filter((i) => i.checkSizeMax >= min);
  }
  switch (sort) {
    case "newest":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "aum":
      result.sort((a, b) => b.aum - a.aum);
      break;
    case "deals":
      result.sort((a, b) => b.dealsCompleted - a.dealsCompleted);
      break;
    case "trending":
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return result;
}

export const handlers = [
  http.get("/api/healthz", () => HttpResponse.json(health)),

  http.get("/api/platform/summary", () => HttpResponse.json(platformSummary)),
  http.get("/api/platform/activity", ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? recentActivity.length);
    return HttpResponse.json(recentActivity.slice(0, limit));
  }),

  http.get("/api/industries", () => HttpResponse.json(industries)),

  http.get("/api/companies", ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(applyCompanyFilters(url, companies));
  }),
  http.post("/api/companies", async ({ request }) => {
    const input = (await request.json()) as CreateCompanyInput;
    const created: Company = {
      id: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: input.name,
      tagline: input.tagline,
      industry: input.industry,
      stage: input.stage,
      headquarters: input.headquarters,
      foundedYear: input.foundedYear,
      logoUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      heroImageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200",
      annualRevenue: input.annualRevenue,
      ebitdaMargin: input.ebitdaMargin ?? 0,
      growthRate: input.growthRate ?? 0,
      raiseAmount: input.raiseAmount,
      valuation: input.valuation,
      minimumInvestment: input.minimumInvestment,
      committedAmount: 0,
      investorCount: 0,
      deadline: "2026-12-31",
      featured: false,
    };
    return HttpResponse.json(created, { status: 201 });
  }),
  http.get("/api/companies/featured", () =>
    HttpResponse.json(companies.filter((c) => c.featured)),
  ),
  http.get("/api/companies/stats", () => HttpResponse.json(companyStats)),
  http.get("/api/companies/:id", ({ params }) => {
    const detail = companyDetails[params.id as string];
    if (!detail) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),

  http.get("/api/investors", ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(applyInvestorFilters(url, investors));
  }),
  http.post("/api/investors", async ({ request }) => {
    const input = (await request.json()) as CreateInvestorInput;
    const created: Investor = {
      id: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: input.name,
      type: input.type,
      tagline: input.tagline ?? "",
      location: input.location,
      avatarUrl: "https://i.pravatar.cc/150?img=68",
      aum: input.aum ?? 0,
      dealsCompleted: 0,
      checkSizeMin: input.checkSizeMin,
      checkSizeMax: input.checkSizeMax,
      focusSectors: input.focusSectors,
      stagePreferences: input.stagePreferences ?? [],
      verified: false,
      featured: false,
    };
    return HttpResponse.json(created, { status: 201 });
  }),
  http.get("/api/investors/featured", () =>
    HttpResponse.json(investors.filter((i) => i.featured)),
  ),
  http.get("/api/investors/stats", () => HttpResponse.json(investorStats)),
  http.get("/api/investors/:id", ({ params }) => {
    const detail = investorDetails[params.id as string];
    if (!detail) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),

  http.get("/api/deals", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const limit = Number(url.searchParams.get("limit") ?? deals.length);
    let result = deals.slice();
    if (status) result = result.filter((d) => d.status === status);
    return HttpResponse.json(result.slice(0, limit));
  }),
];
