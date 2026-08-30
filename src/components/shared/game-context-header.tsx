import { Clock3, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Brand } from "@/components/shared/brand";
import type { GameSettings } from "@/types/game";

interface GameContextHeaderProps {
  settings: GameSettings;
  currentRound: number;
}

export function GameContextHeader({ settings, currentRound }: GameContextHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-5 sm:py-7">
      <Brand />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          Round {currentRound} / {settings.rounds}
        </Badge>
        <Badge variant="secondary" className="hidden gap-1.5 py-1.5 sm:inline-flex">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {settings.turnDuration}s turns
        </Badge>
      </div>
      <p className="basis-full truncate text-xs font-medium text-muted-foreground sm:text-sm">{settings.gameName}</p>
    </header>
  );
}
