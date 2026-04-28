import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const dealsTable = pgTable("deals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  companyId: varchar("company_id", { length: 64 }).notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  raiseAmount: numeric("raise_amount", { precision: 18, scale: 2 }).notNull(),
  committedAmount: numeric("committed_amount", { precision: 18, scale: 2 }).notNull().default("0"),
  status: text("status").notNull(),
  openedAt: timestamp("opened_at", { withTimezone: true }).notNull().defaultNow(),
  closesAt: timestamp("closes_at", { withTimezone: true }),
});

export type Deal = typeof dealsTable.$inferSelect;
