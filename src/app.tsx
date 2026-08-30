import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActiveGame } from "@/pages/active-game";
import { GameOver } from "@/pages/game-over";
import { HomePage } from "@/pages/home-page";
import { SetupPage } from "@/pages/setup-page";
import { TurnPreparation } from "@/pages/turn-preparation";
import { TurnSummary } from "@/pages/turn-summary";
import { WordReveal } from "@/pages/word-reveal";
import { useGameStore } from "@/store/game-store";

function RecoveryScreen() {
  const newGame = useGameStore((state) => state.newGame);
  return (
    <main className="grid min-h-dvh place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-7 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-black tracking-tight">Let&apos;s reset this round</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The active game is missing some team or turn information. Your screen won&apos;t be left stuck.
          </p>
          <Button onClick={newGame} className="mt-6 w-full">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Return to game setup
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default function App() {
  const phase = useGameStore((state) => state.phase);
  const settings = useGameStore((state) => state.settings);
  const teams = useGameStore((state) => state.teams);
  const currentTeamIndex = useGameStore((state) => state.currentTeamIndex);
  const currentWord = useGameStore((state) => state.currentWord);
  const turnHistory = useGameStore((state) => state.turnHistory);

  if (phase === "home") return <HomePage />;
  if (phase === "setup") return <SetupPage />;

  const hasValidConfiguration = Boolean(
    settings &&
      teams.length >= 2 &&
      teams.every((team) => team.name && team.players.length > 0) &&
      teams[currentTeamIndex],
  );
  const needsWord = ["handoff", "word-hidden", "word-revealed", "playing"].includes(phase);
  const needsSummary = phase === "turn-summary";

  if (
    !hasValidConfiguration ||
    (needsWord && !currentWord) ||
    (needsSummary && turnHistory.length === 0)
  ) {
    return <RecoveryScreen />;
  }

  switch (phase) {
    case "handoff":
      return <TurnPreparation />;
    case "word-hidden":
    case "word-revealed":
      return <WordReveal />;
    case "playing":
      return <ActiveGame />;
    case "turn-summary":
      return <TurnSummary />;
    case "game-over":
      return <GameOver />;
    default:
      return <RecoveryScreen />;
  }
}
