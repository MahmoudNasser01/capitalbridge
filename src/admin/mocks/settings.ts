import type { ApiKey, IntegrationCard } from "@/admin/types";

export const integrations: IntegrationCard[] = [
  { id: "slack", name: "Slack", description: "Send notifications to channels for new listings, ticket SLAs, and outages.", category: "comms", connected: true, lastSyncAt: "2026-05-05T13:50:00Z" },
  { id: "stripe", name: "Stripe", description: "Process subscription payments, refunds, and connected account onboarding.", category: "payments", connected: true, lastSyncAt: "2026-05-05T14:00:00Z" },
  { id: "sendgrid", name: "SendGrid", description: "Transactional email delivery for system messages and announcements.", category: "email", connected: true, lastSyncAt: "2026-05-05T13:42:00Z" },
  { id: "segment", name: "Segment", description: "Stream user analytics events to your warehouse and downstream tools.", category: "analytics", connected: false },
  { id: "datadog", name: "Datadog", description: "Application performance monitoring and synthetic checks.", category: "analytics", connected: true, lastSyncAt: "2026-05-05T14:01:00Z" },
  { id: "s3", name: "AWS S3", description: "Encrypted document storage for diligence rooms and uploads.", category: "storage", connected: true, lastSyncAt: "2026-05-05T13:58:00Z" },
  { id: "intercom", name: "Intercom", description: "Mirror support tickets bi-directionally with your existing helpdesk.", category: "comms", connected: false },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics with funnel and retention reports.", category: "analytics", connected: false },
];

export const apiKeys: ApiKey[] = [
  { id: "k-001", label: "Production — primary", prefix: "lync_live_8a4f2c", scopes: ["read:listings", "write:listings", "read:funds", "write:funds"], createdAt: "2026-01-12T10:00:00Z", lastUsedAt: "2026-05-05T14:01:00Z", createdBy: "Elena Park" },
  { id: "k-002", label: "Staging — CI", prefix: "lync_test_4b1d09", scopes: ["read:listings", "read:funds"], createdAt: "2026-02-04T09:30:00Z", lastUsedAt: "2026-05-05T11:15:00Z", createdBy: "Marcus Reyes" },
  { id: "k-003", label: "Analytics warehouse", prefix: "lync_live_e72c81", scopes: ["read:analytics"], createdAt: "2026-03-21T16:20:00Z", lastUsedAt: "2026-05-05T08:00:00Z", createdBy: "Elena Park" },
  { id: "k-004", label: "Webhook signer (legacy)", prefix: "lync_live_27aa55", scopes: ["webhook:sign"], createdAt: "2025-09-01T12:00:00Z", lastUsedAt: "2026-04-20T10:00:00Z", createdBy: "Marcus Reyes" },
];

export const notificationPrefs = {
  listingSubmitted: { email: true, slack: true, inApp: true },
  listingApproved: { email: true, slack: false, inApp: true },
  ticketSlaBreach: { email: true, slack: true, inApp: true },
  fundVerified: { email: false, slack: true, inApp: true },
  weeklyDigest: { email: true, slack: false, inApp: false },
  securityAlerts: { email: true, slack: true, inApp: true },
};

export const branding = {
  productName: "Lync",
  tagline: "Internal operations console for CapitalBridge",
  primaryColor: "#1f6feb",
  secondaryColor: "#0aa372",
  logoUrl: "",
  emailFooter: "© 2026 CapitalBridge. Sent from the Lync operations console.",
  supportEmail: "support@capitalbridge.example",
};

export const billing = {
  plan: "Enterprise",
  seats: { used: 6, total: 20 },
  renewsAt: "2026-12-01",
  amount: 24_000,
  paymentMethod: { brand: "Visa", last4: "4242", exp: "08/29" },
  invoices: [
    { id: "inv-2026-05", date: "2026-05-01", amount: 2000, status: "paid" },
    { id: "inv-2026-04", date: "2026-04-01", amount: 2000, status: "paid" },
    { id: "inv-2026-03", date: "2026-03-01", amount: 2000, status: "paid" },
  ],
};
