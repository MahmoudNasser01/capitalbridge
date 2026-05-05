export type AdminRole = "owner" | "admin" | "reviewer" | "support" | "viewer";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string;
  lastActiveAt: string;
  twoFactor: boolean;
}

export type ListingKind = "business" | "fund";
export type ListingStatus = "live" | "pending" | "approved" | "rejected" | "suspended" | "draft" | "changes_requested";

export interface ListingRequest {
  id: string;
  kind: ListingKind;
  entityName: string;
  entityId?: string;
  submitter: { name: string; email: string; avatarUrl: string };
  submittedAt: string;
  status: Exclude<ListingStatus, "live" | "suspended" | "draft">;
  completeness: number;
  reviewer?: AdminUser;
  industry?: string;
  stage?: string;
  raiseAmount?: number;
  documents: { name: string; size: string; uploadedAt: string }[];
  notes: AdminNote[];
}

export interface AdminNote {
  id: string;
  author: AdminUser;
  body: string;
  createdAt: string;
}

export type AnnouncementScope = "all" | "businesses" | "funds" | "industry" | "status";
export type AnnouncementStatus = "draft" | "scheduled" | "sent";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: { scope: AnnouncementScope; filterValue?: string };
  scheduledAt?: string;
  sentAt?: string;
  status: AnnouncementStatus;
  author: AdminUser;
  recipientCount: number;
}

export type LogLevel = "info" | "warn" | "error" | "critical";
export type LogSource = "auth" | "api" | "db" | "job" | "payment" | "webhook";

export interface SystemLogEntry {
  id: string;
  ts: string;
  level: LogLevel;
  source: LogSource;
  actor?: { type: "user" | "system"; id: string; name: string };
  message: string;
  traceId: string;
  ip?: string;
  userAgent?: string;
  payload?: Record<string, unknown>;
  durationMs?: number;
}

export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "med" | "high" | "urgent";
export type TicketCategory = "billing" | "onboarding" | "verification" | "tech" | "compliance" | "other";

export interface TicketMessage {
  id: string;
  authorKind: "requester" | "agent" | "system";
  authorName: string;
  authorAvatarUrl?: string;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  requester: { name: string; email: string; company?: string; avatarUrl: string };
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee?: AdminUser;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  internalNotes: AdminNote[];
  slaBreachAt?: string;
}

export interface AdminActivityItem {
  id: string;
  kind:
    | "listing_approved"
    | "listing_rejected"
    | "listing_submitted"
    | "fund_approved"
    | "fund_rejected"
    | "ticket_replied"
    | "ticket_resolved"
    | "announcement_sent"
    | "user_invited"
    | "settings_changed"
    | "doc_uploaded";
  title: string;
  subtitle: string;
  amount?: number;
  actor?: { name: string; avatarUrl?: string };
  timestamp: string;
}

export interface AdminStats {
  listedBusinesses: { value: number; deltaPct: number; series: number[] };
  listedFunds: { value: number; deltaPct: number; series: number[] };
  pendingReviews: { value: number; deltaPct: number; series: number[] };
  activeUsers: { value: number; deltaPct: number; series: number[] };
}

export interface IntegrationCard {
  id: string;
  name: string;
  description: string;
  category: "comms" | "payments" | "email" | "analytics" | "storage";
  connected: boolean;
  lastSyncAt?: string;
}

export interface ApiKey {
  id: string;
  label: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  createdBy: string;
}
