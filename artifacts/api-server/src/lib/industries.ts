export const INDUSTRIES = [
  { slug: "saas", name: "SaaS", description: "B2B and vertical software platforms" },
  { slug: "fintech", name: "Fintech", description: "Payments, lending, and capital markets" },
  { slug: "consumer", name: "Consumer", description: "Direct-to-consumer brands and marketplaces" },
  { slug: "healthcare", name: "Healthcare", description: "Care delivery, devices, and digital health" },
  { slug: "industrial", name: "Industrial", description: "Manufacturing, logistics, and supply chain" },
  { slug: "energy", name: "Energy & Climate", description: "Clean energy, grid, and decarbonization" },
  { slug: "real_estate", name: "Real Estate", description: "Proptech and operating real estate" },
  { slug: "ai", name: "AI & Data", description: "AI infrastructure and applied intelligence" },
] as const;

export type IndustrySlug = (typeof INDUSTRIES)[number]["slug"];

export const INDUSTRY_NAME_BY_SLUG: Record<string, string> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.slug, i.name]),
);
