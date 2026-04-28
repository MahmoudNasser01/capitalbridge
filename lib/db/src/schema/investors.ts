import {
  pgTable,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export type NotableInvestment = {
  companyName: string;
  year: number;
  outcome: string;
};
export type PartnerItem = { name: string; title: string; avatarUrl: string };

export const investorsTable = pgTable("investors", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  tagline: text("tagline").notNull(),
  location: text("location").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  aum: numeric("aum", { precision: 18, scale: 2 }).notNull(),
  dealsCompleted: integer("deals_completed").notNull().default(0),
  checkSizeMin: numeric("check_size_min", { precision: 18, scale: 2 }).notNull(),
  checkSizeMax: numeric("check_size_max", { precision: 18, scale: 2 }).notNull(),
  focusSectors: jsonb("focus_sectors").$type<string[]>().notNull().default([]),
  stagePreferences: jsonb("stage_preferences").$type<string[]>().notNull().default([]),
  verified: boolean("verified").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  bio: text("bio").notNull(),
  thesis: text("thesis").notNull(),
  notableInvestments: jsonb("notable_investments").$type<NotableInvestment[]>().notNull().default([]),
  partners: jsonb("partners").$type<PartnerItem[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Investor = typeof investorsTable.$inferSelect;
