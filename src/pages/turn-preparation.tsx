import { ArrowRight, Hand, ShieldCheck } from "lucide-react";

import { GameContextHeader } from "@/components/shared/game-context-header";
import { PageShell } from "@/components/shared/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getActorIndex } from "@/lib/game-engine";
import { useGameStore } from "@/store/game-store";

export function TurnPreparation() {
  const settings = useGameStore((state) => state.settings);
  const teams = useGameStore((state) => state.teams);
  const currentRound = useGameStore((state) => state.currentRound);
  const currentTeamIndex = useGameStore((state) => state.currentTeamIndex);
  const confirmHandoff = useGameStore((state) => state.confirmHandoff);
  const team = teams[currentTeamIndex];
  const player = team?.players[getActorIndex(currentRound, team.players.length)];

  if (!settings || !team || !player) return null;

  return (
    <PageShell compact>
      <GameContextHeader settings={settings} currentRound={currentRound} />
      <section className="grid min-h-[calc(100dvh-150px)] place-items-center pb-12">
        <Card className="w-full max-w-xl animate-fade-up overflow-hidden border-0 bg-hero text-white shadow-glow">
          <CardContent className="p-6 text-center sm:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/15 bg-white/10 text-violet-100">
              <Hand className="h-8 w-8" aria-hidden="true" />
            </div>
            <Badge className="mt-6 border-white/10 bg-white/10 text-violet-100">{team.name}&apos;s turn</Badge>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] sm:text-5xl">Pass to {player.name}</h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-violet-100/75">
              {player.name} is acting this turn. Everyone else, look away while the secret word is revealed.
            </p>
            <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-2 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              The word is still safely hidden
            </div>
            <Button
              size="lg"
              onClick={confirmHandoff}
              className="mt-8 w-full bg-white text-slate-950 hover:bg-violet-50"
            >
              I&apos;m {player.name} — I&apos;m ready
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
