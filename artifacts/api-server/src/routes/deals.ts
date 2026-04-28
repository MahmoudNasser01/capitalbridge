import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, dealsTable } from "@workspace/db";
import {
  ListDealsQueryParams,
  ListDealsResponse,
} from "@workspace/api-zod";
import { serializeDeal } from "../lib/serializers";

const router: IRouter = Router();

router.get("/deals", async (req, res): Promise<void> => {
  const parsed = ListDealsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, limit } = parsed.data;
  const rows = await db
    .select()
    .from(dealsTable)
    .where(status ? eq(dealsTable.status, status) : undefined)
    .orderBy(desc(dealsTable.openedAt))
    .limit(limit ?? 20);
  res.json(ListDealsResponse.parse(rows.map(serializeDeal)));
});

export default router;
