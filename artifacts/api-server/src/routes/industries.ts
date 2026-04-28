import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, companiesTable } from "@workspace/db";
import { ListIndustriesResponse } from "@workspace/api-zod";
import { INDUSTRIES } from "../lib/industries";

const router: IRouter = Router();

router.get("/industries", async (_req, res): Promise<void> => {
  const counts = await db
    .select({
      industry: companiesTable.industry,
      count: sql<number>`count(*)::int`,
    })
    .from(companiesTable)
    .groupBy(companiesTable.industry);
  const countMap = new Map(counts.map((r) => [r.industry, Number(r.count)]));

  const data = INDUSTRIES.map((i) => ({
    slug: i.slug,
    name: i.name,
    companyCount: countMap.get(i.slug) ?? 0,
    description: i.description,
  }));
  res.json(ListIndustriesResponse.parse(data));
});

export default router;
