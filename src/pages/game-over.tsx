import { BarChart3, Crown, Medal, PartyPopper, RotateCcw, Settings2, Trophy } from "lucide-react";

import { Brand } from "@/components/shared/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getWinningTeams } from "@/lib/game-engine";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

export function GameOver() {
  const settings = useGameStore((state) => state.settings);
  const teams = useGameStore((state) => state.teams);
  const turnHistory = useGameStore((state) => state.turnHistory);
  const playAgain = useGameStore((state) => state.playAgain);
  const newGame = useGameStore((state) => state.newGame);

  if (!settings || teams.length === 0) return null;

  const winners = getWinningTeams(teams);
  const isDraw = winners.length > 1;
  const topScore = winners[0]?.score ?? 0;
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);
  const totalCorrect = turnHistory.reduce((sum, turn) => sum + turn.correctWords.length, 0);
  const totalSkipped = turnHistory.reduce((sum, turn) => sum + turn.skippedWords.length, 0);

  return (
    <main className="min-h-dvh bg-hero px-4 py-5 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <Brand light />
          <Badge className="border-white/10 bg-white/10 text-violet-100">{settings.gameName}</Badge>
        </header>

        <section className="py-10 text-center sm:py-14">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.75rem] border border-amber-200/20 bg-amber-300/15 text-party-yellow shadow-[0_20px_60px_-20px_rgba(250,204,21,0.65)]">
            {isDraw ? <PartyPopper className="h-10 w-10" aria-hidden="true" /> : <Trophy className="h-10 w-10" aria-hidden="true" />}
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-violet-200">Game over</p>
          <h1 className="mt-3 text-balance text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">
            {isDraw ? "It's a draw!" : `${winners[0]?.name} win!`}
          </h1>
          <p className="mt-3 text-xl font-bold text-party-yellow">
            {isDraw ? `${winners.map((team) => team.name).join(" & ")} share the crown` : `${topScore} ${topScore === 1 ? "point" : "points"}`}
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="border-white/10 bg-white text-foreground">
            <CardContent className="p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black"><Crown className="h-5 w-5 text-amber-500" aria-hidden="true" />Final standings</h2>
                <Badge variant="secondary">{settings.rounds} rounds</Badge>
              </div>
              <div className="space-y-2.5">
                {rankedTeams.map((team, index) => (
                  <div
                    key={team.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3.5",
                      winners.some((winner) => winner.id === team.id) ? "border-amber-200 bg-amber-50" : "border-border bg-secondary/35",
                    )}
                  >
                    <span className={cn("grid h-9 w-9 place-items-center rounded-xl text-sm font-black", index === 0 ? "bg-amber-400 text-amber-950" : "bg-background text-muted-foreground")}>
                      {index === 0 ? <Medal className="h-5 w-5" aria-hidden="true" /> : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{team.name}</p>
                      <p className="text-xs text-muted-foreground">{team.players.length} {team.players.length === 1 ? "player" : "players"}</p>
                    </div>
                    <p className="text-2xl font-black tabular-nums">{team.score}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.08] text-white shadow-none backdrop-blur">
            <CardContent className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-black"><BarChart3 className="h-5 w-5 text-violet-300" aria-hidden="true" />Game snapshot</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1">
                <div className="rounded-2xl bg-white/[0.08] p-4">
                  <p className="text-3xl font-black tabular-nums">{totalCorrect}</p>
                  <p className="mt-1 text-xs font-semibold text-violet-200/70">Words guessed</p>
                </div>
                <div className="rounded-2xl bg-white/[0.08] p-4">
                  <p className="text-3xl font-black tabular-nums">{totalSkipped}</p>
                  <p className="mt-1 text-xs font-semibold text-violet-200/70">Words skipped</p>
                </div>
              </div>
              <Separator className="my-5 bg-white/10" />
              <p className="text-sm leading-6 text-violet-100/65">{turnHistory.length} turns played across {teams.length} teams.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button size="lg" onClick={playAgain} className="bg-party-yellow text-slate-950 hover:bg-yellow-300">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Play again
          </Button>
          <Button size="lg" variant="outline" onClick={newGame} className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <Settings2 className="h-5 w-5" aria-hidden="true" />
            New game setup
          </Button>
        </div>
      </div>
    </main>
  );
}
