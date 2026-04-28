import {
  pgTable,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export type UseOfFundsItem = { label: string; percent: number };
export type FinancialItem = { year: number; revenue: number; ebitda: number };
export type TeamItem = { name: string; title: string; bio: string; avatarUrl: string };
export type DocumentItem = {
  name: string;
  kind: "pitch_deck" | "financials" | "term_sheet" | "due_diligence" | "legal";
};

export const companiesTable = pgTable("companies", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  industry: text("industry").notNull(),
  stage: text("stage").notNull(),
  headquarters: text("headquarters").notNull(),
  foundedYear: integer("founded_year").notNull(),
  logoUrl: text("logo_url").notNull(),
  heroImageUrl: text("hero_image_url").notNull(),
  annualRevenue: numeric("annual_revenue", { precision: 18, scale: 2 }).notNull(),
  ebitdaMargin: numeric("ebitda_margin", { precision: 6, scale: 2 }).notNull(),
  growthRate: numeric("growth_rate", { precision: 6, scale: 2 }).notNull(),
  raiseAmount: numeric("raise_amount", { precision: 18, scale: 2 }).notNull(),
  valuation: numeric("valuation", { precision: 18, scale: 2 }).notNull(),
  minimumInvestment: numeric("minimum_investment", { precision: 18, scale: 2 }).notNull(),
  committedAmount: numeric("committed_amount", { precision: 18, scale: 2 }).notNull().default("0"),
  investorCount: integer("investor_count").notNull().default(0),
  deadline: date("deadline").notNull(),
  featured: boolean("featured").notNull().default(false),
  overview: text("overview").notNull(),
  useOfFunds: jsonb("use_of_funds").$type<UseOfFundsItem[]>().notNull().default([]),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  financials: jsonb("financials").$type<FinancialItem[]>().notNull().default([]),
  team: jsonb("team").$type<TeamItem[]>().notNull().default([]),
  documents: jsonb("documents").$type<DocumentItem[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Company = typeof companiesTable.$inferSelect;
