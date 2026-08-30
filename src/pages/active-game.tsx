import { Check, FastForward, Sparkles, UserRound } from "lucide-react";
import { useRef } from "react";

import { Scoreboard } from "@/components/game/scoreboard";
import { TimerDisplay } from "@/components/game/timer-display";
import { GameContextHeader } from "@/components/shared/game-context-header";
import { PageShell } from "@/components/shared/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import { getActorIndex } from "@/lib/game-engine";
import { useGameStore } from "@/store/game-store";

export function ActiveGame() {
  const settings = useGameStore((state) => state.settings);
  const teams = useGameStore((state) => state.teams);
  const currentRound = useGameStore((state) => state.currentRound);
  const currentTeamIndex = useGameStore((state) => state.currentTeamIndex);
  const currentWord = useGameStore((state) => state.currentWord);
  const remainingSeconds = useGameStore((state) => state.remainingSeconds);
  const turnStats = useGameStore((state) => state.turnStats);
  const correctAnswer = useGameStore((state) => state.correctAnswer);
  const skipWord = useGameStore((state) => state.skipWord);
  const lastActionAt = useRef(Number.NEGATIVE_INFINITY);

  useCountdown(true);

  const team = teams[currentTeamIndex];
  const player = team?.players[getActorIndex(currentRound, team.players.length)];

  if (!settings || !team || !player || !currentWord) return null;

  const runWordAction = (action: (wordId: string) => void) => {
    const now = performance.now();
    if (now - lastActionAt.current < 220) return;
    lastActionAt.current = now;
    action(currentWord.id);
  };

  const actionsDisabled = remainingSeconds <= 0;

  return (
    <PageShell className="pb-28 lg:pb-8">
      <GameContextHeader settings={settings} currentRound={currentRound} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-primary/[0.045] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-base font-black text-primary">{team.name}&apos;s turn</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            {player.name} is acting
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">{turnStats.correctWords.length} correct</Badge>
          <Badge variant="outline">{turnStats.skippedWords.length} skipped</Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
        <div className="grid gap-5 md:grid-cols-[210px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
          <TimerDisplay remainingSeconds={remainingSeconds} duration={settings.turnDuration} />

          <Card className="min-h-64 overflow-hidden border-primary/15">
            <CardContent className="flex h-full min-h-64 flex-col items-center justify-center p-6 text-center sm:p-9">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Secret word
              </div>
              <div key={currentWord.id} className="animate-fade-up">
                <Badge variant="secondary" className="mt-5 capitalize">{currentWord.category}</Badge>
                <h1 className="mt-3 text-balance text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl xl:text-6xl">
                  {currentWord.text}
                </h1>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">Act it out—no speaking or spelling.</p>
            </CardContent>
          </Card>

          <div className="hidden gap-3 md:col-span-2 md:grid md:grid-cols-2">
            <Button
              size="lg"
              variant="success"
              disabled={actionsDisabled}
              onClick={() => runWordAction(correctAnswer)}
              className="h-16 text-lg"
            >
              <Check className="h-6 w-6 stroke-[3]" aria-hidden="true" />
              Correct +1
            </Button>
            <Button
              size="lg"
              variant="outline"
              disabled={actionsDisabled}
              onClick={() => runWordAction(skipWord)}
              className="h-16 border-2 text-lg"
            >
              <FastForward className="h-6 w-6" aria-hidden="true" />
              Skip word
            </Button>
          </div>
        </div>

        <Scoreboard teams={teams} currentTeamIndex={currentTeamIndex} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <Button
          size="lg"
          variant="success"
          disabled={actionsDisabled}
          onClick={() => runWordAction(correctAnswer)}
          className="h-14 px-3 text-base"
        >
          <Check className="h-5 w-5 stroke-[3]" aria-hidden="true" />
          Correct +1
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={actionsDisabled}
          onClick={() => runWordAction(skipWord)}
          className="h-14 border-2 px-3 text-base"
        >
          <FastForward className="h-5 w-5" aria-hidden="true" />
          Skip
        </Button>
      </div>
    </PageShell>
  );
}
