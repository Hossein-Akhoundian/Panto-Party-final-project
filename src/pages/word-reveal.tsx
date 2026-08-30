import { Eye, EyeOff, Play, ShieldAlert } from "lucide-react";

import { GameContextHeader } from "@/components/shared/game-context-header";
import { PageShell } from "@/components/shared/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGameStore } from "@/store/game-store";

export function WordReveal() {
  const settings = useGameStore((state) => state.settings);
  const phase = useGameStore((state) => state.phase);
  const currentRound = useGameStore((state) => state.currentRound);
  const currentWord = useGameStore((state) => state.currentWord);
  const revealWord = useGameStore((state) => state.revealWord);
  const startTurn = useGameStore((state) => state.startTurn);
  const isRevealed = phase === "word-revealed";

  if (!settings || !currentWord) return null;

  return (
    <PageShell compact>
      <GameContextHeader settings={settings} currentRound={currentRound} />
      <section className="grid min-h-[calc(100dvh-150px)] place-items-center pb-12">
        <Card className="w-full max-w-xl animate-fade-up overflow-hidden">
          <CardContent className="p-6 text-center sm:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
              {isRevealed ? <Eye className="h-8 w-8" aria-hidden="true" /> : <EyeOff className="h-8 w-8" aria-hidden="true" />}
            </div>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-primary">Secret word</p>

            {isRevealed ? (
              <div className="mt-5 rounded-3xl border-2 border-primary/15 bg-primary/[0.045] px-5 py-10 sm:px-8">
                <Badge variant="secondary" className="mb-4 capitalize">{currentWord.category}</Badge>
                <h1 className="text-balance text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
                  {currentWord.text}
                </h1>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border-2 border-dashed border-border bg-secondary/40 px-5 py-12">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Make sure no one is peeking</h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Hold the screen close. Your {settings.turnDuration}-second timer will not start until you say so.
                </p>
              </div>
            )}

            {isRevealed ? (
              <>
                <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  Remember it—then start acting without speaking.
                </p>
                <Button size="lg" onClick={startTurn} className="mt-6 w-full">
                  <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                  Start the timer
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={revealWord} className="mt-7 w-full">
                <Eye className="h-5 w-5" aria-hidden="true" />
                Reveal my word
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
