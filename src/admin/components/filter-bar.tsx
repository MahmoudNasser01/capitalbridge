import React from "react";
import { Filter as FilterIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
  defaultValue?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters: FilterDef[];
  trailing?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  trailing,
  className,
}: FilterBarProps) {
  const isDefault = (f: FilterDef) => f.value === (f.defaultValue ?? "all");
  const activeFilters = filters.filter((f) => !isDefault(f));
  const hasAnyActive = activeFilters.length > 0 || searchValue.length > 0;

  const clearAll = () => {
    onSearchChange("");
    for (const f of filters) f.onChange(f.defaultValue ?? "all");
  };

  return (
    <div className={cn("bg-card border rounded-xl shadow-sm overflow-hidden", className)}>
      <div className="px-3 py-2.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 pr-9 h-9 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-input"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground pl-1 pr-1 shrink-0">
            <FilterIcon className="h-3.5 w-3.5" />
            Filter
          </span>
          {filters.map((f) => {
            const Icon = f.icon;
            const def = isDefault(f);
            const opt = f.options.find((o) => o.value === f.value);
            return (
              <Select key={f.key} value={f.value} onValueChange={f.onChange}>
                <SelectTrigger
                  className={cn(
                    "h-9 gap-1.5 px-3 text-sm font-medium border w-auto min-w-0 [&>svg:last-child]:opacity-60",
                    def
                      ? "bg-background text-muted-foreground hover:text-foreground"
                      : "bg-primary/10 text-primary border-primary/40 hover:bg-primary/15",
                  )}
                  aria-label={f.label}
                >
                  {Icon ? <Icon className={cn("h-3.5 w-3.5 shrink-0", def && "text-muted-foreground")} /> : null}
                  {def ? (
                    <span className="truncate">{f.label}</span>
                  ) : (
                    <span className="truncate flex items-center gap-1">
                      <span className="text-muted-foreground/80 text-xs uppercase tracking-wide font-normal">{f.label}</span>
                      <span>{opt?.label}</span>
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
          {hasAnyActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-9 px-2 gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        {trailing ? <div className="md:ml-auto flex items-center gap-2 shrink-0">{trailing}</div> : null}
      </div>

      {activeFilters.length > 0 && (
        <div className="px-3 py-2 border-t bg-muted/30 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">Active</span>
          {activeFilters.map((f) => {
            const opt = f.options.find((o) => o.value === f.value);
            return (
              <Badge
                key={f.key}
                variant="secondary"
                className="h-6 gap-1 cursor-pointer hover:bg-muted pl-2 pr-1"
                onClick={() => f.onChange(f.defaultValue ?? "all")}
              >
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</span>
                <span className="text-xs font-medium">{opt?.label}</span>
                <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-sm hover:bg-background/60">
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
