import { describe, expect, it } from "vitest";

import { drawWord, getActorIndex, getNextTurnPosition, getWinningTeams } from "@/lib/game-engine";
import type { Team, Word } from "@/types/game";

describe("turn rotation", () => {
  it("rotates players by round, including one-player teams", () => {
    expect([1, 2, 3, 4, 5].map((round) => getActorIndex(round, 3))).toEqual([0, 1, 2, 0, 1]);
    expect([1, 2, 7].map((round) => getActorIndex(round, 1))).toEqual([0, 0, 0]);
  });

  it("advances teams, rounds, and the final game state exactly once", () => {
    expect(getNextTurnPosition(1, 0, 3, 3)).toEqual({ round: 1, teamIndex: 1, isGameOver: false });
    expect(getNextTurnPosition(1, 2, 3, 3)).toEqual({ round: 2, teamIndex: 0, isGameOver: false });
    expect(getNextTurnPosition(3, 2, 3, 3)).toEqual({ round: 3, teamIndex: 2, isGameOver: true });
  });
});

describe("word selection", () => {
  const words: Word[] = [
    { id: "1", text: "One", category: "object" },
    { id: "2", text: "Two", category: "object" },
    { id: "3", text: "Three", category: "object" },
  ];

  it("uses unseen game words before recycling and avoids the current turn", () => {
    const unseen = drawWord(words, ["1"], ["1"], () => 0);
    expect(unseen?.word.id).toBe("2");
    expect(unseen?.usedWordIds).toEqual(["1", "2"]);

    const recycled = drawWord(words, ["1", "2", "3"], ["1", "2"], () => 0);
    expect(recycled?.word.id).toBe("3");
    expect(recycled?.usedWordIds).toEqual(["3"]);
  });
});

describe("winner calculation", () => {
  const makeTeam = (id: string, score: number): Team => ({ id, name: id, score, players: [{ id: `${id}-p`, name: "Player" }] });

  it("returns every team tied for first", () => {
    expect(getWinningTeams([makeTeam("A", 4), makeTeam("B", 7), makeTeam("C", 7)]).map((team) => team.id)).toEqual(["B", "C"]);
  });
});
