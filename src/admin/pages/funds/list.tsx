import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Plus, ClipboardList, BadgeCheck, CircleDot, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatUSD } from "@/lib/format";
import { INVESTOR_TYPES } from "@/lib/constants";
import { DataTable, type DataTableColumn } from "@/admin/components/data-table";
import { FilterBar } from "@/admin/components/filter-bar";
import { StatusBadge } from "@/admin/components/status-badge";
import { adminFunds, type AdminFund } from "@/admin/mocks/business-status";
import type { ListingStatus } from "@/admin/types";
import { formatDistanceToNow } from "date-fns";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "live", label: "Live" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];
const typeOptions = [
  { value: "all", label: "All types" },
  ...Object.entries(INVESTOR_TYPES).map(([k, v]) => ({ value: k, label: v })),
];
const verifiedOptions = [
  { value: "all", label: "All funds" },
  { value: "verified", label: "Verified only" },
  { value: "unverified", label: "Unverified only" },
];

export function FundsList() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [verified, setVerified] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return adminFunds.filter((f) => {
      if (search && !`${f.name} ${f.tagline}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (status !== "all" && f.status !== (status as ListingStatus)) return false;
      if (type !== "all" && f.type !== type) return false;
      if (verified === "verified" && !f.verified) return false;
      if (verified === "unverified" && f.verified) return false;
      return true;
    });
  }, [search, status, type, verified]);

  const columns: DataTableColumn<AdminFund>[] = [
    {
      key: "name",
      header: "Fund",
      sortValue: (f) => f.name,
      render: (f) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={f.avatarUrl} alt={f.name} />
            <AvatarFallback>{f.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate flex items-center gap-1.5">
              {f.name}
              {f.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
            </p>
            <p className="text-xs text-muted-foreground truncate">{f.tagline}</p>
          </div>
        </div>
      ),
    },
    { key: "type", header: "Strategy", sortValue: (f) => f.type, render: (f) => INVESTOR_TYPES[f.type] ?? f.type },
    {
      key: "aum",
      header: "AUM",
      sortValue: (f) => f.aum,
      render: (f) => <span className="font-medium">{formatUSD(f.aum)}</span>,
    },
    {
      key: "ticket",
      header: "Ticket size",
      render: (f) => (
        <span className="text-sm">
          {formatUSD(f.checkSizeMin)} – {formatUSD(f.checkSizeMax)}
        </span>
      ),
    },
    { key: "vintage", header: "Vintage", sortValue: (f) => f.vintage, render: (f) => f.vintage },
    { key: "deals", header: "Deals", sortValue: (f) => f.dealsCompleted, render: (f) => f.dealsCompleted },
    { key: "status", header: "Status", sortValue: (f) => f.status, render: (f) => <StatusBadge status={f.status} /> },
    {
      key: "updated",
      header: "Updated",
      sortValue: (f) => f.updatedAt,
      render: (f) => <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(f.updatedAt), { addSuffix: true })}</span>,
    },
  ];

  return (
    <div className="space-y-4 max-w-[1500px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <p className="text-sm text-muted-foreground">{filtered.length} of {adminFunds.length} funds</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/funds/requests")} className="gap-1.5">
            <ClipboardList className="h-4 w-4" /> Listing requests
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5"><Plus className="h-4 w-4" /> Add fund</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add a new fund listing</DialogTitle>
                <DialogDescription>Manually onboard a fund outside the public submission flow.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="fn">Fund name</Label>
                  <Input id="fn" placeholder="e.g. Cascade Growth Partners" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="ft">Tagline</Label>
                  <Input id="ft" placeholder="One-line strategy" />
                </div>
                <div className="space-y-1.5">
                  <Label>Strategy</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select strategy" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(INVESTOR_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fau">AUM (USD)</Label>
                  <Input id="fau" type="number" placeholder="500000000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fcm">Min ticket</Label>
                  <Input id="fcm" type="number" placeholder="500000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fcx">Max ticket</Label>
                  <Input id="fcx" type="number" placeholder="10000000" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="fnotes">Notes</Label>
                  <Textarea id="fnotes" rows={3} placeholder="Internal notes for this fund…" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { setOpen(false); toast({ title: "Fund draft saved", description: "Visible only to admins until published." }); }}>
                  Save as draft
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search funds by name or thesis…"
        filters={[
          { key: "status", label: "Status", icon: CircleDot, value: status, options: statusOptions, onChange: setStatus },
          { key: "type", label: "Strategy", icon: Briefcase, value: type, options: typeOptions, onChange: setType },
          { key: "verified", label: "Verification", icon: ShieldCheck, value: verified, options: verifiedOptions, onChange: setVerified },
        ]}
      />

      <DataTable
        rows={filtered}
        columns={columns}
        rowKey={(f) => f.id}
        pageSize={10}
        onRowClick={(f) => navigate(`/admin/funds/${f.id}`)}
      />
    </div>
  );
}
