import { ArrowRight, CheckCircle2, Clock3, FastForward, Flag, PartyPopper, UserRound } from "lucide-react";

import { Scoreboard } from "@/components/game/scoreboard";
import { GameContextHeader } from "@/components/shared/game-context-header";
import { PageShell } from "@/components/shared/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getActorIndex, getNextTurnPosition } from "@/lib/game-engine";
import { useGameStore } from "@/store/game-store";

export function TurnSummary() {
  const settings = useGameStore((state) => state.settings);
  const teams = useGameStore((state) => state.teams);
  const currentRound = useGameStore((state) => state.currentRound);
  const currentTeamIndex = useGameStore((state) => state.currentTeamIndex);
  const turnHistory = useGameStore((state) => state.turnHistory);
  const continueToNextTurn = useGameStore((state) => state.continueToNextTurn);
  const result = turnHistory.at(-1);

  if (!settings || !result) return null;

  const next = getNextTurnPosition(currentRound, currentTeamIndex, settings.rounds, teams.length);
  const nextTeam = next.isGameOver ? null : teams[next.teamIndex];
  const nextPlayer = nextTeam?.players[getActorIndex(next.round, nextTeam.players.length)];

  return (
    <PageShell>
      <GameContextHeader settings={settings} currentRound={currentRound} />
      <div className="grid gap-5 pb-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <Card className="animate-fade-up overflow-hidden">
          <div className="bg-hero px-6 py-8 text-center text-white sm:px-10 sm:py-10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-party-yellow">
              <Clock3 className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-violet-200">Time&apos;s up</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              {result.points} {result.points === 1 ? "point" : "points"}!
            </h1>
            <p className="mt-3 text-violet-100/70">{result.teamName} • {result.playerName} acting</p>
          </div>

          <CardContent className="p-5 sm:p-8">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <p className="mt-3 text-3xl font-black tabular-nums">{result.correctWords.length}</p>
                <p className="text-sm font-semibold">Correct</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-amber-800">
                <FastForward className="h-5 w-5" aria-hidden="true" />
                <p className="mt-3 text-3xl font-black tabular-nums">{result.skippedWords.length}</p>
                <p className="text-sm font-semibold">Skipped</p>
              </div>
            </div>

            {(result.correctWords.length > 0 || result.skippedWords.length > 0) && (
              <div className="mt-6 space-y-4">
                {result.correctWords.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Nailed it</p>
                    <div className="flex flex-wrap gap-2">
                      {result.correctWords.map((word) => <Badge key={word.id} variant="success">{word.text}</Badge>)}
                    </div>
                  </div>
                )}
                {result.skippedWords.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Passed on</p>
                    <div className="flex flex-wrap gap-2">
                      {result.skippedWords.map((word) => <Badge key={word.id} variant="warning">{word.text}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Separator className="my-6" />

            <div className="rounded-2xl border border-border bg-secondary/35 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  {next.isGameOver ? "All turns complete" : "Up next"}
                </p>
                {next.isGameOver ? (
                  <p className="mt-1 flex items-center gap-2 text-lg font-black">
                    <Flag className="h-5 w-5 text-primary" aria-hidden="true" />
                    Final scores are ready
                  </p>
                ) : (
                  <p className="mt-1 text-lg font-black">
                    {nextTeam?.name} <span className="font-medium text-muted-foreground">— {nextPlayer?.name}</span>
                  </p>
                )}
              </div>
              <Button size="lg" onClick={continueToNextTurn} className="mt-4 w-full sm:mt-0 sm:w-auto">
                {next.isGameOver ? (
                  <><PartyPopper className="h-5 w-5" aria-hidden="true" />See results</>
                ) : (
                  <><UserRound className="h-5 w-5" aria-hidden="true" />Next turn<ArrowRight className="h-5 w-5" aria-hidden="true" /></>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Scoreboard teams={teams} currentTeamIndex={currentTeamIndex} />
      </div>
    </PageShell>
  );
}
