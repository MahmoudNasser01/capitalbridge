import type { AdminActivityItem } from "@/admin/types";

export const adminActivity: AdminActivityItem[] = [
  { id: "act-1", kind: "listing_approved", title: "Beacon Insurance approved", subtitle: "Listing moved to Live", actor: { name: "Marcus Reyes", avatarUrl: "https://i.pravatar.cc/150?img=12" }, timestamp: "2026-05-05T13:42:00Z", amount: 110_000_000 },
  { id: "act-2", kind: "ticket_replied", title: "Reply on T-1042", subtitle: "Helix Robotics — upload error", actor: { name: "Julia Chen", avatarUrl: "https://i.pravatar.cc/150?img=45" }, timestamp: "2026-05-05T13:12:00Z" },
  { id: "act-3", kind: "fund_approved", title: "Atlas Family Office approved", subtitle: "Fund visible to platform", actor: { name: "Elena Park", avatarUrl: "https://i.pravatar.cc/150?img=47" }, timestamp: "2026-05-05T12:50:00Z" },
  { id: "act-4", kind: "announcement_sent", title: "Q2 platform update sent", subtitle: "Audience: businesses (248)", actor: { name: "Marcus Reyes", avatarUrl: "https://i.pravatar.cc/150?img=12" }, timestamp: "2026-05-05T10:00:00Z" },
  { id: "act-5", kind: "listing_submitted", title: "Helix Robotics submitted listing", subtitle: "Pending review", actor: { name: "Avery Wong", avatarUrl: "https://i.pravatar.cc/150?img=4" }, timestamp: "2026-05-05T09:18:00Z", amount: 32_000_000 },
  { id: "act-6", kind: "doc_uploaded", title: "Cobalt Health uploaded financials", subtitle: "Audited 2024 statement", actor: { name: "Jamie Liu", avatarUrl: "https://i.pravatar.cc/150?img=33" }, timestamp: "2026-05-05T08:42:00Z" },
  { id: "act-7", kind: "listing_rejected", title: "Pinecone Logistics rejected", subtitle: "Below platform criteria", actor: { name: "Marcus Reyes", avatarUrl: "https://i.pravatar.cc/150?img=12" }, timestamp: "2026-05-04T17:01:00Z" },
  { id: "act-8", kind: "ticket_resolved", title: "T-1038 resolved", subtitle: "Drift Mobility — co-admin question", actor: { name: "Julia Chen", avatarUrl: "https://i.pravatar.cc/150?img=45" }, timestamp: "2026-05-04T15:20:00Z" },
  { id: "act-9", kind: "user_invited", title: "Invited Ravi Patel", subtitle: "Role: viewer", actor: { name: "Elena Park", avatarUrl: "https://i.pravatar.cc/150?img=47" }, timestamp: "2026-05-04T14:00:00Z" },
  { id: "act-10", kind: "fund_rejected", title: "Lighthouse Hedge rejected", subtitle: "Liquidity terms incompatible", actor: { name: "Elena Park", avatarUrl: "https://i.pravatar.cc/150?img=47" }, timestamp: "2026-05-04T11:00:00Z" },
  { id: "act-11", kind: "settings_changed", title: "Branding updated", subtitle: "Logo asset replaced", actor: { name: "Elena Park", avatarUrl: "https://i.pravatar.cc/150?img=47" }, timestamp: "2026-05-04T09:30:00Z" },
  { id: "act-12", kind: "announcement_sent", title: "Verified fund badge announcement", subtitle: "Audience: funds (92)", actor: { name: "Elena Park", avatarUrl: "https://i.pravatar.cc/150?img=47" }, timestamp: "2026-05-02T14:30:00Z" },
  { id: "act-13", kind: "listing_approved", title: "Tessera Cloud approved", subtitle: "Series B SaaS listing", actor: { name: "Marcus Reyes", avatarUrl: "https://i.pravatar.cc/150?img=12" }, timestamp: "2026-05-01T16:18:00Z", amount: 55_000_000 },
  { id: "act-14", kind: "doc_uploaded", title: "Polaris Bio data room", subtitle: "Phase II clinical results", actor: { name: "Diane Krause", avatarUrl: "https://i.pravatar.cc/150?img=24" }, timestamp: "2026-05-01T11:45:00Z" },
  { id: "act-15", kind: "ticket_replied", title: "Reply on T-1039", subtitle: "Loft Labs — visibility bug", actor: { name: "Marcus Reyes", avatarUrl: "https://i.pravatar.cc/150?img=12" }, timestamp: "2026-05-04T10:30:00Z" },
];
