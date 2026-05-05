import type { ListingStatus } from "@/admin/types";
import { companies, investors } from "@/mocks/data";

const businessStatusOverlay: Record<string, ListingStatus> = {
  "atlas-pay": "live",
  "northwind-bio": "live",
  "pulse-grid": "live",
  "loom-logistics": "pending",
  "vertex-ml": "live",
  "harbor-foods": "draft",
};

const fundStatusOverlay: Record<string, ListingStatus> = {
  "meridian-capital": "live",
  "windward-ventures": "live",
  "ironwood-family": "live",
  "longhorn-syndicate": "pending",
  "ridge-hedge": "suspended",
};

export interface AdminBusiness {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  stage: string;
  headquarters: string;
  foundedYear: number;
  logoUrl: string;
  heroImageUrl: string;
  annualRevenue: number;
  ebitdaMargin: number;
  growthRate: number;
  raiseAmount: number;
  valuation: number;
  minimumInvestment: number;
  committedAmount: number;
  investorCount: number;
  deadline: string;
  featured: boolean;
  status: ListingStatus;
  updatedAt: string;
}

export interface AdminFund {
  id: string;
  name: string;
  tagline: string;
  type: string;
  location: string;
  avatarUrl: string;
  aum: number;
  dealsCompleted: number;
  checkSizeMin: number;
  checkSizeMax: number;
  focusSectors: string[];
  stagePreferences: string[];
  verified: boolean;
  featured: boolean;
  status: ListingStatus;
  vintage: number;
  updatedAt: string;
}

const updatedAtPool = [
  "2026-05-05T11:00:00Z",
  "2026-05-04T14:00:00Z",
  "2026-05-04T09:00:00Z",
  "2026-05-03T17:00:00Z",
  "2026-05-02T10:00:00Z",
  "2026-04-30T16:00:00Z",
];

export const adminBusinesses: AdminBusiness[] = companies.map((c, i) => ({
  ...c,
  status: businessStatusOverlay[c.id] ?? (i % 5 === 0 ? "pending" : "live"),
  updatedAt: updatedAtPool[i % updatedAtPool.length],
}));

const vintagePool = [2018, 2019, 2020, 2021, 2022, 2023];

export const adminFunds: AdminFund[] = investors.map((inv, i) => ({
  ...inv,
  status: fundStatusOverlay[inv.id] ?? (i % 4 === 0 ? "pending" : "live"),
  vintage: vintagePool[i % vintagePool.length],
  updatedAt: updatedAtPool[i % updatedAtPool.length],
}));
