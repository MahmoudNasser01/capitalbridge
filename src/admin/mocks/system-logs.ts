import type { LogLevel, LogSource, SystemLogEntry } from "@/admin/types";

const levels: LogLevel[] = ["info", "info", "info", "info", "warn", "warn", "error", "critical"];
const sources: LogSource[] = ["auth", "api", "db", "job", "payment", "webhook"];

const messages: Record<LogSource, string[]> = {
  auth: [
    "User login succeeded",
    "User login failed: invalid password",
    "Password reset email dispatched",
    "MFA challenge issued",
    "Session token revoked",
    "OAuth callback verified",
  ],
  api: [
    "GET /v1/companies — 200",
    "POST /v1/listings — 201",
    "GET /v1/funds — 200",
    "DELETE /v1/listings/:id — 403 forbidden",
    "PATCH /v1/users/:id — 200",
    "Rate limit threshold reached",
  ],
  db: [
    "Slow query detected (1842ms)",
    "Replica lag exceeded 5s",
    "Connection pool saturated",
    "Vacuum completed on listings table",
    "Index rebuild started",
    "Foreign key constraint violation",
  ],
  job: [
    "Daily metrics rollup completed",
    "Email digest job dispatched",
    "Document scan queued",
    "Scheduled cleanup ran",
    "Failed retry exceeded max attempts",
    "Worker heartbeat missing",
  ],
  payment: [
    "Stripe webhook received",
    "Subscription renewal succeeded",
    "Payment refunded",
    "Charge declined: insufficient_funds",
    "Invoice finalized",
    "Customer portal session created",
  ],
  webhook: [
    "Inbound webhook signature verified",
    "Webhook delivery succeeded",
    "Webhook delivery failed (timeout)",
    "Replay detected and skipped",
    "Webhook endpoint disabled",
    "New endpoint registered",
  ],
};

const actorNames = [
  "Elena Park",
  "Marcus Reyes",
  "Priya Shah",
  "Sam Okafor",
  "Julia Chen",
  "Avery Wong",
  "Hugo Marin",
  "Riley Chen",
  "system",
  "scheduler",
];

const ips = ["10.0.4.21", "192.168.1.103", "172.16.0.55", "203.0.113.27", "198.51.100.8"];

const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/124.0",
  "okhttp/4.12.0",
  "curl/8.5.0",
];

function rng(seed: number) {
  let t = seed;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function makeTrace(idx: number, r: () => number) {
  const hex = (Math.floor(r() * 0xffffffff) ^ idx).toString(16).padStart(8, "0");
  return `trace-${hex}`;
}

const r = rng(42);

const baseDate = new Date("2026-05-05T14:00:00Z").getTime();

export const systemLogs: SystemLogEntry[] = Array.from({ length: 120 }, (_, i) => {
  const level = levels[Math.floor(r() * levels.length)];
  const source = sources[Math.floor(r() * sources.length)];
  const msgs = messages[source];
  const actor = actorNames[Math.floor(r() * actorNames.length)];
  const offsetMin = Math.floor(r() * 60 * 24 * 7);
  const ts = new Date(baseDate - offsetMin * 60_000).toISOString();
  const isUser = actor !== "system" && actor !== "scheduler";
  return {
    id: `log-${pad(i + 1)}`,
    ts,
    level,
    source,
    actor: { type: isUser ? "user" : "system", id: isUser ? `u-${actor.split(" ")[0].toLowerCase()}` : "system", name: actor },
    message: msgs[Math.floor(r() * msgs.length)],
    traceId: makeTrace(i, r),
    ip: source === "auth" || source === "api" ? ips[Math.floor(r() * ips.length)] : undefined,
    userAgent: source === "auth" || source === "api" ? userAgents[Math.floor(r() * userAgents.length)] : undefined,
    durationMs: source === "api" || source === "db" ? Math.floor(r() * 2500) : undefined,
    payload: {
      requestId: `req-${Math.floor(r() * 1e9).toString(16)}`,
      env: "production",
      region: ["us-east-1", "us-west-2", "eu-west-1"][Math.floor(r() * 3)],
      meta: {
        retryable: level === "error" || level === "critical",
        sampled: r() > 0.7,
      },
    },
  };
});
