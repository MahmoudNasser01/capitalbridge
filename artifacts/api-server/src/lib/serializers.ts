import type { Company, Investor, Deal, ActivityRow } from "@workspace/db";

const num = (v: unknown): number => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const serializeCompany = (c: Company) => ({
  id: c.id,
  name: c.name,
  tagline: c.tagline,
  industry: c.industry,
  stage: c.stage,
  headquarters: c.headquarters,
  foundedYear: c.foundedYear,
  logoUrl: c.logoUrl,
  heroImageUrl: c.heroImageUrl,
  annualRevenue: num(c.annualRevenue),
  ebitdaMargin: num(c.ebitdaMargin),
  growthRate: num(c.growthRate),
  raiseAmount: num(c.raiseAmount),
  valuation: num(c.valuation),
  minimumInvestment: num(c.minimumInvestment),
  committedAmount: num(c.committedAmount),
  investorCount: c.investorCount,
  deadline:
    c.deadline instanceof Date
      ? c.deadline.toISOString().slice(0, 10)
      : String(c.deadline),
  featured: c.featured,
});

export const serializeCompanyDetail = (c: Company) => ({
  ...serializeCompany(c),
  overview: c.overview,
  useOfFunds: c.useOfFunds ?? [],
  highlights: c.highlights ?? [],
  financials: c.financials ?? [],
  team: c.team ?? [],
  documents: c.documents ?? [],
});

export const serializeInvestor = (i: Investor) => ({
  id: i.id,
  name: i.name,
  type: i.type,
  tagline: i.tagline,
  location: i.location,
  avatarUrl: i.avatarUrl,
  aum: num(i.aum),
  dealsCompleted: i.dealsCompleted,
  checkSizeMin: num(i.checkSizeMin),
  checkSizeMax: num(i.checkSizeMax),
  focusSectors: i.focusSectors ?? [],
  stagePreferences: i.stagePreferences ?? [],
  verified: i.verified,
  featured: i.featured,
});

export const serializeInvestorDetail = (i: Investor) => ({
  ...serializeInvestor(i),
  bio: i.bio,
  thesis: i.thesis,
  notableInvestments: i.notableInvestments ?? [],
  partners: i.partners ?? [],
});

export const serializeDeal = (d: Deal) => ({
  id: d.id,
  companyId: d.companyId,
  companyName: d.companyName,
  industry: d.industry,
  raiseAmount: num(d.raiseAmount),
  committedAmount: num(d.committedAmount),
  status: d.status,
  openedAt: d.openedAt.toISOString(),
  closesAt: d.closesAt ? d.closesAt.toISOString() : null,
});

export const serializeActivity = (a: ActivityRow) => ({
  id: a.id,
  kind: a.kind,
  title: a.title,
  subtitle: a.subtitle,
  amount: a.amount == null ? null : num(a.amount),
  timestamp: a.timestamp.toISOString(),
  companyId: a.companyId,
  investorId: a.investorId,
});
