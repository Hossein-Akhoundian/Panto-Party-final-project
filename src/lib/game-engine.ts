import type { Team, TurnPosition, Word } from "@/types/game";

export interface WordDraw {
  word: Word;
  usedWordIds: string[];
}

export function getActorIndex(round: number, playerCount: number): number {
  if (round < 1 || playerCount < 1) return 0;
  return (round - 1) % playerCount;
}

export function getNextTurnPosition(
  round: number,
  teamIndex: number,
  totalRounds: number,
  teamCount: number,
): TurnPosition {
  if (teamCount < 1 || round >= totalRounds && teamIndex >= teamCount - 1) {
    return { round, teamIndex, isGameOver: true };
  }

  if (teamIndex < teamCount - 1) {
    return { round, teamIndex: teamIndex + 1, isGameOver: false };
  }

  return { round: round + 1, teamIndex: 0, isGameOver: false };
}

export function getWinningTeams(teams: Team[]): Team[] {
  if (teams.length === 0) return [];
  const topScore = Math.max(...teams.map((team) => team.score));
  return teams.filter((team) => team.score === topScore);
}

export function drawWord(
  words: Word[],
  usedWordIds: string[],
  turnWordIds: string[],
  random: () => number = Math.random,
): WordDraw | null {
  if (words.length === 0) return null;

  const gameUnused = words.filter((word) => !usedWordIds.includes(word.id));
  const turnUnused = words.filter((word) => !turnWordIds.includes(word.id));
  const pool = gameUnused.length > 0 ? gameUnused : turnUnused.length > 0 ? turnUnused : words;
  const safeRandom = Math.min(Math.max(random(), 0), 0.999999999);
  const word = pool[Math.floor(safeRandom * pool.length)];

  return {
    word,
    usedWordIds: gameUnused.length > 0 ? [...usedWordIds, word.id] : [word.id],
  };
}
