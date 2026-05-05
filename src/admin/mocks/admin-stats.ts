import type { AdminStats } from "@/admin/types";
import { companies, investors } from "@/mocks/data";

function series(seed: number, base: number, jitter = 0.2): number[] {
  const arr: number[] = [];
  let v = base * (1 - jitter);
  let s = seed;
  for (let i = 0; i < 30; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = (s / 233280 - 0.5) * jitter * base;
    v = Math.max(0, v + r + base * 0.012);
    arr.push(Math.round(v));
  }
  return arr;
}

export const adminStats: AdminStats = {
  listedBusinesses: { value: companies.length + 184, deltaPct: 8.4, series: series(1, companies.length + 170) },
  listedFunds: { value: investors.length + 70, deltaPct: 4.2, series: series(2, investors.length + 64) },
  pendingReviews: { value: 14, deltaPct: -3.1, series: series(3, 16, 0.5) },
  activeUsers: { value: 1248, deltaPct: 12.6, series: series(4, 1100) },
};

export function aggregateByCity(): { city: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const c of companies) {
    counts[c.headquarters] = (counts[c.headquarters] ?? 0) + 1;
  }
  // Pad with synthetic cities so the chart looks rich.
  const synthetic: Record<string, number> = {
    "New York, NY": 18,
    "San Francisco, CA": 24,
    "Boston, MA": 11,
    "Austin, TX": 9,
    "Seattle, WA": 7,
    "Chicago, IL": 6,
    "Los Angeles, CA": 8,
    "Miami, FL": 5,
    "Denver, CO": 4,
    "Atlanta, GA": 4,
    "Portland, OR": 3,
    "Minneapolis, MN": 3,
  };
  for (const [k, v] of Object.entries(synthetic)) {
    counts[k] = (counts[k] ?? 0) + v;
  }
  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function fundsByStrategy(): { name: string; value: number; fill: string }[] {
  const counts: Record<string, number> = {};
  for (const inv of investors) {
    counts[inv.type] = (counts[inv.type] ?? 0) + 1;
  }
  const labels: Record<string, string> = {
    venture_capital: "Venture Capital",
    private_equity: "Private Equity",
    hedge_fund: "Hedge Fund",
    family_office: "Family Office",
    syndicate: "Syndicate",
    individual: "Individual",
  };
  // Pad
  const padded = {
    venture_capital: (counts.venture_capital ?? 0) + 24,
    private_equity: (counts.private_equity ?? 0) + 18,
    hedge_fund: (counts.hedge_fund ?? 0) + 12,
    family_office: (counts.family_office ?? 0) + 16,
    syndicate: (counts.syndicate ?? 0) + 9,
    individual: (counts.individual ?? 0) + 8,
  };
  const fills = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
  ];
  return Object.entries(padded).map(([k, v], i) => ({
    name: labels[k] ?? k,
    value: v,
    fill: fills[i % fills.length],
  }));
}
