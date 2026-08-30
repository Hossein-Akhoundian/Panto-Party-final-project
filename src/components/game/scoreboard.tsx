import { Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Team } from "@/types/game";

interface ScoreboardProps {
  teams: Team[];
  currentTeamIndex?: number;
  compact?: boolean;
}

export function Scoreboard({ teams, currentTeamIndex, compact = false }: ScoreboardProps) {
  return (
    <Card className={cn("overflow-hidden", compact && "rounded-2xl shadow-none")}>
      <CardHeader className={cn("flex-row items-center justify-between space-y-0", compact ? "p-4" : "pb-4")}>
        <CardTitle className={cn("flex items-center gap-2", compact ? "text-sm" : "text-base")}>
          <Crown className="h-4 w-4 text-amber-500" aria-hidden="true" />
          Live scores
        </CardTitle>
        <Badge variant="secondary">{teams.length} teams</Badge>
      </CardHeader>
      <CardContent className={cn("space-y-2", compact && "p-4 pt-0")}>
        {teams.map((team, index) => {
          const isActive = index === currentTeamIndex;
          return (
            <div
              key={team.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition",
                isActive ? "border-primary/20 bg-primary/[0.065]" : "bg-secondary/45",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{team.name}</p>
                {isActive && <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Acting now</p>}
              </div>
              <span className={cn("min-w-8 text-right text-xl font-black tabular-nums", isActive && "text-primary")}>
                {team.score}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
