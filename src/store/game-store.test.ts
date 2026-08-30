import { afterEach, describe, expect, it } from "vitest";

import { getActorIndex } from "@/lib/game-engine";
import { useGameStore } from "@/store/game-store";
import type { GameConfiguration } from "@/types/game";

const configuration: GameConfiguration = {
  gameName: " Test Night ",
  rounds: 3,
  turnDuration: 30,
  teams: [
    {
      id: "a",
      name: " Team A ",
      players: [
        { id: "a1", name: "Alex" },
        { id: "a2", name: "Sarah" },
        { id: "a3", name: "Mike" },
      ],
    },
    { id: "b", name: "Team B", players: [{ id: "b1", name: "John" }] },
  ],
};

function startActiveTurn() {
  const actions = useGameStore.getState();
  actions.confirmHandoff();
  useGameStore.getState().revealWord();
  useGameStore.getState().startTurn();
}

function finishAndContinue() {
  useGameStore.getState().endTurn();
  useGameStore.getState().continueToNextTurn();
}

describe("game store", () => {
  afterEach(() => useGameStore.getState().returnHome());

  it("scores correct answers, records skips, and never resets the timer", () => {
    useGameStore.getState().startGame(configuration);
    expect(useGameStore.getState().phase).toBe("handoff");
    expect(useGameStore.getState().settings?.gameName).toBe("Test Night");
    startActiveTurn();

    const initialWordId = useGameStore.getState().currentWord!.id;
    const deadline = useGameStore.getState().turnEndsAt;
    useGameStore.getState().correctAnswer(initialWordId);
    expect(useGameStore.getState().teams[0].score).toBe(1);
    expect(useGameStore.getState().currentWord?.id).not.toBe(initialWordId);
    expect(useGameStore.getState().turnEndsAt).toBe(deadline);

    useGameStore.getState().correctAnswer(initialWordId);
    expect(useGameStore.getState().teams[0].score).toBe(1);

    const skippedWordId = useGameStore.getState().currentWord!.id;
    useGameStore.getState().skipWord(skippedWordId);
    expect(useGameStore.getState().teams[0].score).toBe(1);
    expect(useGameStore.getState().turnStats.skippedWords).toHaveLength(1);
    expect(useGameStore.getState().turnEndsAt).toBe(deadline);

    useGameStore.getState().syncTimer(Number.MAX_SAFE_INTEGER);
    expect(useGameStore.getState().phase).toBe("turn-summary");
    expect(useGameStore.getState().turnHistory[0].points).toBe(1);
  });

  it("rejects answers after the absolute deadline", () => {
    useGameStore.getState().startGame(configuration);
    startActiveTurn();
    const wordId = useGameStore.getState().currentWord!.id;
    useGameStore.setState({ turnEndsAt: Date.now() - 1 });

    useGameStore.getState().correctAnswer(wordId);
    expect(useGameStore.getState().phase).toBe("turn-summary");
    expect(useGameStore.getState().teams[0].score).toBe(0);
  });

  it("rotates uneven teams and reaches game over after the final summary", () => {
    useGameStore.getState().startGame(configuration);

    for (let turn = 0; turn < 6; turn += 1) {
      const state = useGameStore.getState();
      const expectedRound = Math.floor(turn / 2) + 1;
      const expectedTeam = turn % 2;
      expect(state.currentRound).toBe(expectedRound);
      expect(state.currentTeamIndex).toBe(expectedTeam);
      const team = state.teams[expectedTeam];
      expect(getActorIndex(expectedRound, team.players.length)).toBe(expectedTeam === 0 ? expectedRound - 1 : 0);
      startActiveTurn();
      finishAndContinue();
    }

    expect(useGameStore.getState().phase).toBe("game-over");
    expect(useGameStore.getState().turnHistory).toHaveLength(6);
  });

  it("play again preserves configuration and new game clears it", () => {
    useGameStore.getState().startGame(configuration);
    startActiveTurn();
    const wordId = useGameStore.getState().currentWord!.id;
    useGameStore.getState().correctAnswer(wordId);
    useGameStore.getState().endTurn();
    useGameStore.setState({ phase: "game-over" });

    useGameStore.getState().playAgain();
    expect(useGameStore.getState().phase).toBe("handoff");
    expect(useGameStore.getState().teams[0].score).toBe(0);
    expect(useGameStore.getState().settings?.gameName).toBe("Test Night");

    useGameStore.getState().newGame();
    expect(useGameStore.getState().phase).toBe("setup");
    expect(useGameStore.getState().settings).toBeNull();
    expect(useGameStore.getState().teams).toHaveLength(0);
  });
});
