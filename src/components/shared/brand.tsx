import { Drama } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandProps {
  light?: boolean;
  compact?: boolean;
  className?: string;
}

export function Brand({ light = false, compact = false, className }: BrandProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)} aria-label="Panto Party">
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-2xl",
          light ? "bg-white/12 text-white ring-1 ring-white/15" : "bg-primary text-primary-foreground shadow-md",
        )}
      >
        <Drama aria-hidden="true" className="h-5 w-5" />
      </span>
      {!compact && (
        <span className={cn("text-lg font-black tracking-[-0.03em]", light ? "text-white" : "text-foreground")}>
          Panto <span className={light ? "text-violet-200" : "text-primary"}>Party</span>
        </span>
      )}
    </div>
  );
}
