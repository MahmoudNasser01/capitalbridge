import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import {
  db,
  companiesTable,
  investorsTable,
  activityTable,
  dealsTable,
} from "@workspace/db";
import {
  GetPlatformSummaryResponse,
  GetRecentActivityQueryParams,
  GetRecentActivityResponse,
} from "@workspace/api-zod";
import { serializeActivity } from "../lib/serializers";

const router: IRouter = Router();

router.get("/platform/summary", async (_req, res): Promise<void> => {
  const [companies, investors, deals] = await Promise.all([
    db.select().from(companiesTable),
    db.select().from(investorsTable),
    db.select().from(dealsTable),
  ]);

  const totalCapitalRaised = deals
    .filter((d) => d.status === "funded" || d.status === "closed")
    .reduce((s, d) => s + Number(d.committedAmount), 0);

  const dealsClosedYtd = deals.filter(
    (d) =>
      (d.status === "funded" || d.status === "closed") &&
      d.openedAt.getFullYear() === new Date().getFullYear(),
  ).length;

  const closedDealValues = deals
    .filter((d) => d.status === "funded" || d.status === "closed")
    .map((d) => Number(d.committedAmount));
  const averageDealSize = closedDealValues.length
    ? closedDealValues.reduce((a, b) => a + b, 0) / closedDealValues.length
    : 0;

  const typeMap = new Map<string, number>();
  for (const i of investors) {
    typeMap.set(i.type, (typeMap.get(i.type) ?? 0) + 1);
  }

  const indMap = new Map<string, number>();
  for (const c of companies) {
    indMap.set(
      c.industry,
      (indMap.get(c.industry) ?? 0) + Number(c.raiseAmount),
    );
  }

  res.json(
    GetPlatformSummaryResponse.parse({
      totalCapitalRaised,
      companiesListed: companies.length,
      activeInvestors: investors.length,
      dealsClosedYtd,
      averageDealSize,
      investorsByType: Array.from(typeMap.entries()).map(([type, count]) => ({
        type,
        count,
      })),
      capitalByIndustry: Array.from(indMap.entries()).map(
        ([industry, capital]) => ({ industry, capital }),
      ),
    }),
  );
});

router.get("/platform/activity", async (req, res): Promise<void> => {
  const parsed = GetRecentActivityQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const limit = parsed.data.limit ?? 12;
  const rows = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.timestamp))
    .limit(limit);
  res.json(GetRecentActivityResponse.parse(rows.map(serializeActivity)));
});

export default router;
