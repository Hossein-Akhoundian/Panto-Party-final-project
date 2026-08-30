import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SettingChoiceProps {
  name: string;
  label: string;
  detail: string;
  checked: boolean;
  onChange: () => void;
  icon?: LucideIcon;
}

export function SettingChoice({ name, label, detail, checked, onChange, icon: Icon }: SettingChoiceProps) {
  return (
    <label
      className={cn(
        "relative flex min-h-20 cursor-pointer items-center gap-3 rounded-2xl border bg-background p-3.5 transition hover:border-primary/40 hover:bg-accent/30",
        checked && "border-primary bg-primary/[0.055] ring-2 ring-primary/15",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {Icon && (
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground", checked && "bg-primary text-primary-foreground")}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      )}
      <span>
        <span className="block text-sm font-bold">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
      </span>
      <span
        className={cn(
          "absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-muted-foreground/35",
          checked && "border-primary bg-primary ring-2 ring-primary/15",
        )}
        aria-hidden="true"
      />
    </label>
  );
}
