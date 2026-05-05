import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  deltaPct: number;
  series: number[];
  accent?: "primary" | "secondary" | "amber" | "rose";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  amber: "hsl(var(--chart-4))",
  rose: "hsl(var(--chart-5))",
};

export function StatCard({ label, value, deltaPct, series, accent = "primary" }: StatCardProps) {
  const positive = deltaPct >= 0;
  const data = series.map((v, i) => ({ i, v }));
  const stroke = accentMap[accent];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl md:text-3xl font-semibold mt-1 tracking-tight">{value}</p>
            <p
              className={cn(
                "mt-1 inline-flex items-center text-xs font-medium",
                positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
              )}
            >
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(deltaPct).toFixed(1)}% vs last month
            </p>
          </div>
          <div className="h-12 w-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
