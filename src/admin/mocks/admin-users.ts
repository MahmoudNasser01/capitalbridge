import type { AdminUser } from "@/admin/types";

export const adminUsers: AdminUser[] = [
  {
    id: "u-elena",
    name: "Elena Park",
    email: "elena.park@lync.io",
    role: "owner",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    lastActiveAt: "2026-05-05T14:12:00Z",
    twoFactor: true,
  },
  {
    id: "u-marcus",
    name: "Marcus Reyes",
    email: "marcus.reyes@lync.io",
    role: "admin",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    lastActiveAt: "2026-05-05T13:48:00Z",
    twoFactor: true,
  },
  {
    id: "u-priya",
    name: "Priya Shah",
    email: "priya.shah@lync.io",
    role: "reviewer",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    lastActiveAt: "2026-05-05T11:30:00Z",
    twoFactor: true,
  },
  {
    id: "u-sam",
    name: "Sam Okafor",
    email: "sam.okafor@lync.io",
    role: "reviewer",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    lastActiveAt: "2026-05-04T22:01:00Z",
    twoFactor: false,
  },
  {
    id: "u-julia",
    name: "Julia Chen",
    email: "julia.chen@lync.io",
    role: "support",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    lastActiveAt: "2026-05-05T14:02:00Z",
    twoFactor: true,
  },
  {
    id: "u-ravi",
    name: "Ravi Patel",
    email: "ravi.patel@lync.io",
    role: "viewer",
    avatarUrl: "https://i.pravatar.cc/150?img=22",
    lastActiveAt: "2026-05-03T09:18:00Z",
    twoFactor: false,
  },
];

export const currentAdmin: AdminUser = adminUsers[0];

export function findAdminByEmail(email: string): AdminUser | undefined {
  return adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
