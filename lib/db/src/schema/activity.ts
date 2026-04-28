import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const activityTable = pgTable("activity", {
  id: varchar("id", { length: 64 }).primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  companyId: varchar("company_id", { length: 64 }),
  investorId: varchar("investor_id", { length: 64 }),
});

export type ActivityRow = typeof activityTable.$inferSelect;
