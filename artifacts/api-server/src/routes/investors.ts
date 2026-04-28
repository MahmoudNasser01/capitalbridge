import { Router, type IRouter } from "express";
import { eq, desc, and, ilike, gte, sql } from "drizzle-orm";
import { db, investorsTable } from "@workspace/db";
import {
  ListInvestorsQueryParams,
  ListInvestorsResponse,
  ListFeaturedInvestorsResponse,
  GetInvestorParams,
  GetInvestorResponse,
  GetInvestorStatsResponse,
  CreateInvestorBody,
} from "@workspace/api-zod";
import {
  serializeInvestor,
  serializeInvestorDetail,
} from "../lib/serializers";

const router: IRouter = Router();

router.get("/investors", async (req, res): Promise<void> => {
  const parsed = ListInvestorsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, type, focus, minCheckSize, sort } = parsed.data;
  const conditions = [];
  if (search) conditions.push(ilike(investorsTable.name, `%${search}%`));
  if (type) conditions.push(eq(investorsTable.type, type));
  if (minCheckSize != null) {
    conditions.push(gte(investorsTable.checkSizeMax, String(minCheckSize)));
  }
  if (focus) {
    conditions.push(sql`${investorsTable.focusSectors} @> ${JSON.stringify([focus])}::jsonb`);
  }

  let orderBy;
  switch (sort) {
    case "newest":
      orderBy = desc(investorsTable.createdAt);
      break;
    case "aum":
      orderBy = desc(investorsTable.aum);
      break;
    case "deals":
      orderBy = desc(investorsTable.dealsCompleted);
      break;
    case "trending":
    default:
      orderBy = desc(investorsTable.dealsCompleted);
      break;
  }

  const rows = await db
    .select()
    .from(investorsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy);
  res.json(ListInvestorsResponse.parse(rows.map(serializeInvestor)));
});

router.get("/investors/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(investorsTable)
    .where(eq(investorsTable.featured, true))
    .orderBy(desc(investorsTable.aum));
  res.json(ListFeaturedInvestorsResponse.parse(rows.map(serializeInvestor)));
});

router.get("/investors/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(investorsTable);
  const totalAum = all.reduce((s, i) => s + Number(i.aum), 0);
  const totalInvestors = all.length;

  const typeMap = new Map<string, { count: number; aum: number }>();
  for (const i of all) {
    const m = typeMap.get(i.type) ?? { count: 0, aum: 0 };
    m.count += 1;
    m.aum += Number(i.aum);
    typeMap.set(i.type, m);
  }

  const focusMap = new Map<string, number>();
  for (const i of all) {
    for (const f of i.focusSectors ?? []) {
      focusMap.set(f, (focusMap.get(f) ?? 0) + 1);
    }
  }

  res.json(
    GetInvestorStatsResponse.parse({
      totalAum,
      totalInvestors,
      byType: Array.from(typeMap.entries()).map(([type, v]) => ({
        type,
        count: v.count,
        aum: v.aum,
      })),
      byFocus: Array.from(focusMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([focus, count]) => ({ focus, count })),
    }),
  );
});

router.get("/investors/:id", async (req, res): Promise<void> => {
  const params = GetInvestorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(investorsTable)
    .where(eq(investorsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Investor not found" });
    return;
  }
  res.json(GetInvestorResponse.parse(serializeInvestorDetail(row)));
});

router.post("/investors", async (req, res): Promise<void> => {
  const parsed = CreateInvestorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const id = `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const [row] = await db
    .insert(investorsTable)
    .values({
      id,
      name: d.name,
      type: d.type,
      tagline: d.tagline ?? "",
      location: d.location,
      avatarUrl:
        "https://api.dicebear.com/9.x/initials/svg?seed=" + encodeURIComponent(d.name),
      aum: String(d.aum ?? 0),
      dealsCompleted: 0,
      checkSizeMin: String(d.checkSizeMin),
      checkSizeMax: String(d.checkSizeMax),
      focusSectors: d.focusSectors ?? [],
      stagePreferences: d.stagePreferences ?? [],
      verified: false,
      featured: false,
      bio: d.bio,
      thesis: "",
      notableInvestments: [],
      partners: [],
    })
    .returning();
  res.status(201).json(serializeInvestor(row));
});

export default router;
