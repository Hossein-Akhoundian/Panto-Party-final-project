import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export function PageShell({ children, className, compact = false }: PageShellProps) {
  return (
    <main className={cn("min-h-dvh overflow-x-hidden bg-background text-foreground", className)}>
      <div className={cn("mx-auto w-full px-4 sm:px-6", compact ? "max-w-4xl" : "max-w-6xl")}>{children}</div>
    </main>
  );
}
