import { Router, type IRouter } from "express";
import { eq, desc, asc, and, ilike, gte, sql } from "drizzle-orm";
import { db, companiesTable } from "@workspace/db";
import {
  ListCompaniesQueryParams,
  ListCompaniesResponse,
  ListFeaturedCompaniesResponse,
  GetCompanyParams,
  GetCompanyResponse,
  GetCompanyStatsResponse,
  CreateCompanyBody,
} from "@workspace/api-zod";
import {
  serializeCompany,
  serializeCompanyDetail,
} from "../lib/serializers";

const router: IRouter = Router();

router.get("/companies", async (req, res): Promise<void> => {
  const parsed = ListCompaniesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, industry, stage, minRevenue, sort } = parsed.data;
  const conditions = [];
  if (search) conditions.push(ilike(companiesTable.name, `%${search}%`));
  if (industry) conditions.push(eq(companiesTable.industry, industry));
  if (stage) conditions.push(eq(companiesTable.stage, stage));
  if (minRevenue != null) {
    conditions.push(gte(companiesTable.annualRevenue, String(minRevenue)));
  }

  let orderBy;
  switch (sort) {
    case "newest":
      orderBy = desc(companiesTable.createdAt);
      break;
    case "raise_size":
      orderBy = desc(companiesTable.raiseAmount);
      break;
    case "revenue":
      orderBy = desc(companiesTable.annualRevenue);
      break;
    case "trending":
    default:
      orderBy = desc(companiesTable.investorCount);
      break;
  }

  const rows = await db
    .select()
    .from(companiesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy);
  res.json(ListCompaniesResponse.parse(rows.map(serializeCompany)));
});

router.get("/companies/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(companiesTable)
    .where(eq(companiesTable.featured, true))
    .orderBy(desc(companiesTable.committedAmount));
  res.json(ListFeaturedCompaniesResponse.parse(rows.map(serializeCompany)));
});

router.get("/companies/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(companiesTable);
  const totalRaiseTarget = all.reduce((s, c) => s + Number(c.raiseAmount), 0);
  const totalCommitted = all.reduce((s, c) => s + Number(c.committedAmount), 0);

  const stageMap = new Map<string, { count: number; raiseTarget: number }>();
  for (const c of all) {
    const m = stageMap.get(c.stage) ?? { count: 0, raiseTarget: 0 };
    m.count += 1;
    m.raiseTarget += Number(c.raiseAmount);
    stageMap.set(c.stage, m);
  }

  const indMap = new Map<string, { count: number; raiseTarget: number }>();
  for (const c of all) {
    const m = indMap.get(c.industry) ?? { count: 0, raiseTarget: 0 };
    m.count += 1;
    m.raiseTarget += Number(c.raiseAmount);
    indMap.set(c.industry, m);
  }

  res.json(
    GetCompanyStatsResponse.parse({
      totalRaiseTarget,
      totalCommitted,
      byStage: Array.from(stageMap.entries()).map(([stage, v]) => ({
        stage,
        count: v.count,
        raiseTarget: v.raiseTarget,
      })),
      byIndustry: Array.from(indMap.entries()).map(([industry, v]) => ({
        industry,
        count: v.count,
        raiseTarget: v.raiseTarget,
      })),
    }),
  );
});

router.get("/companies/:id", async (req, res): Promise<void> => {
  const params = GetCompanyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(companiesTable)
    .where(eq(companiesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json(GetCompanyResponse.parse(serializeCompanyDetail(row)));
});

router.post("/companies", async (req, res): Promise<void> => {
  const parsed = CreateCompanyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const id = `co_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const [row] = await db
    .insert(companiesTable)
    .values({
      id,
      name: d.name,
      tagline: d.tagline,
      industry: d.industry,
      stage: d.stage,
      headquarters: d.headquarters,
      foundedYear: d.foundedYear,
      logoUrl:
        "https://api.dicebear.com/9.x/shapes/svg?seed=" + encodeURIComponent(d.name),
      heroImageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200",
      annualRevenue: String(d.annualRevenue),
      ebitdaMargin: String(d.ebitdaMargin ?? 0),
      growthRate: String(d.growthRate ?? 0),
      raiseAmount: String(d.raiseAmount),
      valuation: String(d.valuation),
      minimumInvestment: String(d.minimumInvestment),
      committedAmount: "0",
      investorCount: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      featured: false,
      overview: d.overview,
      useOfFunds: [],
      highlights: [],
      financials: [],
      team: [],
      documents: [],
    })
    .returning();
  res.status(201).json(serializeCompany(row));
});

export default router;
