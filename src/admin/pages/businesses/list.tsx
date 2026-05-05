import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Plus, ClipboardList, CircleDot, Building2, Sprout } from "lucide-react";
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
import { INDUSTRIES, STAGES } from "@/lib/constants";
import { DataTable, type DataTableColumn } from "@/admin/components/data-table";
import { FilterBar } from "@/admin/components/filter-bar";
import { StatusBadge } from "@/admin/components/status-badge";
import { adminBusinesses, type AdminBusiness } from "@/admin/mocks/business-status";
import type { ListingStatus } from "@/admin/types";
import { formatDistanceToNow } from "date-fns";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "live", label: "Live" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "draft", label: "Draft" },
];

const industryOptions: { value: string; label: string }[] = [
  { value: "all", label: "All industries" },
  ...Array.from(new Set(adminBusinesses.map((b) => b.industry))).map((v) => ({ value: v, label: v })),
];

const stageOptions = [
  { value: "all", label: "All stages" },
  ...Object.entries(STAGES).map(([k, v]) => ({ value: k, label: v })),
];

export function BusinessesList() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [stage, setStage] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return adminBusinesses.filter((b) => {
      if (search && !`${b.name} ${b.tagline}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (status !== "all" && b.status !== (status as ListingStatus)) return false;
      if (industry !== "all" && b.industry !== industry) return false;
      if (stage !== "all" && b.stage !== stage) return false;
      return true;
    });
  }, [search, status, industry, stage]);

  const columns: DataTableColumn<AdminBusiness>[] = [
    {
      key: "name",
      header: "Business",
      sortValue: (b) => b.name,
      render: (b) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={b.logoUrl} alt={b.name} />
            <AvatarFallback>{b.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{b.name}</p>
            <p className="text-xs text-muted-foreground truncate">{b.tagline}</p>
          </div>
        </div>
      ),
    },
    { key: "industry", header: "Industry", sortValue: (b) => b.industry, render: (b) => b.industry },
    { key: "stage", header: "Stage", sortValue: (b) => b.stage, render: (b) => STAGES[b.stage] ?? b.stage },
    { key: "hq", header: "HQ", sortValue: (b) => b.headquarters, render: (b) => <span className="text-sm">{b.headquarters}</span> },
    {
      key: "raise",
      header: "Raise",
      sortValue: (b) => b.raiseAmount,
      render: (b) => (
        <div>
          <p className="text-sm font-medium">{formatUSD(b.raiseAmount)}</p>
          <p className="text-xs text-muted-foreground">{Math.round((b.committedAmount / b.raiseAmount) * 100)}% committed</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (b) => b.status,
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      sortValue: (b) => b.updatedAt,
      render: (b) => <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(b.updatedAt), { addSuffix: true })}</span>,
    },
  ];

  return (
    <div className="space-y-4 max-w-[1500px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{filtered.length} of {adminBusinesses.length} businesses</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/businesses/requests")} className="gap-1.5">
            <ClipboardList className="h-4 w-4" /> Listing requests
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5"><Plus className="h-4 w-4" /> Add business</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add a new business listing</DialogTitle>
                <DialogDescription>Manually onboard a business outside the public submission flow.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="bn">Business name</Label>
                  <Input id="bn" placeholder="e.g. Helix Robotics" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="bt">Tagline</Label>
                  <Input id="bt" placeholder="One-line description" />
                </div>
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(INDUSTRIES).map(([k, v]) => <SelectItem key={k} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Stage</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bhq">Headquarters</Label>
                  <Input id="bhq" placeholder="City, State" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bra">Raise amount (USD)</Label>
                  <Input id="bra" type="number" placeholder="25000000" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="bo">Notes</Label>
                  <Textarea id="bo" rows={3} placeholder="Internal notes for this listing…" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { setOpen(false); toast({ title: "Listing draft saved", description: "Visible only to admins until published." }); }}>
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
        searchPlaceholder="Search by name or keyword…"
        filters={[
          { key: "status", label: "Status", icon: CircleDot, value: status, options: statusOptions, onChange: setStatus },
          { key: "industry", label: "Industry", icon: Building2, value: industry, options: industryOptions, onChange: setIndustry },
          { key: "stage", label: "Stage", icon: Sprout, value: stage, options: stageOptions, onChange: setStage },
        ]}
      />

      <DataTable
        rows={filtered}
        columns={columns}
        rowKey={(b) => b.id}
        pageSize={10}
        onRowClick={(b) => navigate(`/admin/businesses/${b.id}`)}
      />
    </div>
  );
}
