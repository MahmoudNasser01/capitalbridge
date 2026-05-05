import { useState } from "react";
import { Send, Calendar, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { INDUSTRIES } from "@/lib/constants";
import type { AnnouncementScope } from "@/admin/types";

interface AnnouncementComposerProps {
  onSent?: (data: {
    title: string;
    body: string;
    scope: AnnouncementScope;
    filterValue?: string;
  }) => void;
}

export function AnnouncementComposer({ onSent }: AnnouncementComposerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scope, setScope] = useState<AnnouncementScope>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const { toast } = useToast();

  const reset = () => {
    setTitle("");
    setBody("");
    setScope("all");
    setFilterValue("");
  };

  const handle = (action: "send" | "schedule" | "draft") => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Title and body required", description: "Fill in both fields before sending.", variant: "destructive" });
      return;
    }
    if ((scope === "industry" || scope === "status") && !filterValue) {
      toast({ title: "Audience filter required", description: "Pick a value for the selected audience scope.", variant: "destructive" });
      return;
    }
    const verbs = { send: "sent", schedule: "scheduled", draft: "saved as draft" };
    toast({ title: `Announcement ${verbs[action]}`, description: title });
    onSent?.({ title, body, scope, filterValue: filterValue || undefined });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New announcement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ann-title">Title</Label>
          <Input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q2 platform update" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ann-body">Message</Label>
          <Textarea id="ann-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write the body of the announcement…" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Audience</Label>
            <Select value={scope} onValueChange={(v) => { setScope(v as AnnouncementScope); setFilterValue(""); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="businesses">All businesses</SelectItem>
                <SelectItem value="funds">All funds</SelectItem>
                <SelectItem value="industry">By industry</SelectItem>
                <SelectItem value="status">By listing status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scope === "industry" && (
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(INDUSTRIES).map(([k, v]) => (
                    <SelectItem key={k} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {scope === "status" && (
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="pending">Pending review</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button onClick={() => handle("send")} className="gap-1.5">
            <Send className="h-4 w-4" /> Send now
          </Button>
          <Button variant="outline" onClick={() => handle("schedule")} className="gap-1.5">
            <Calendar className="h-4 w-4" /> Schedule
          </Button>
          <Button variant="ghost" onClick={() => handle("draft")} className="gap-1.5">
            <Save className="h-4 w-4" /> Save draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
