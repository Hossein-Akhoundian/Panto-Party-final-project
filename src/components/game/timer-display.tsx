import { Clock3 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  remainingSeconds: number;
  duration: number;
}

export function TimerDisplay({ remainingSeconds, duration }: TimerDisplayProps) {
  const isUrgent = remainingSeconds <= 10;
  const percentage = duration > 0 ? (remainingSeconds / duration) * 100 : 0;

  return (
    <div className={cn("rounded-3xl border bg-card p-5 text-center shadow-soft", isUrgent && "border-rose-200 bg-rose-50/70")}>
      <div className={cn("mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-secondary sm:h-36 sm:w-36", isUrgent && "animate-soft-pulse border-rose-100")}>
        <span
          role="timer"
          aria-label={`${remainingSeconds} seconds remaining`}
          className={cn("text-5xl font-black tabular-nums tracking-[-0.06em] sm:text-6xl", isUrgent && "text-rose-600")}
        >
          {remainingSeconds}
        </span>
        <span className={cn("mt-1 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground", isUrgent && "text-rose-500")}>
          <Clock3 className="h-3 w-3" aria-hidden="true" />
          seconds
        </span>
      </div>
      <Progress
        value={percentage}
        aria-label="Turn time remaining"
        className="mt-5 h-2.5"
        indicatorClassName={isUrgent ? "bg-rose-500" : "bg-primary"}
      />
    </div>
  );
}
