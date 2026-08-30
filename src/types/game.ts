export const ROUND_OPTIONS = [3, 5, 7] as const;
export const DURATION_OPTIONS = [30, 60, 90] as const;

export type RoundCount = (typeof ROUND_OPTIONS)[number];
export type TurnDuration = (typeof DURATION_OPTIONS)[number];

export type GamePhase =
  | "home"
  | "setup"
  | "handoff"
  | "word-hidden"
  | "word-revealed"
  | "playing"
  | "turn-summary"
  | "game-over";

export interface Player {
  id: string;
  name: string;
}

export interface TeamInput {
  id: string;
  name: string;
  players: Player[];
}

export interface Team extends TeamInput {
  score: number;
}

export interface GameSettings {
  gameName: string;
  rounds: RoundCount;
  turnDuration: TurnDuration;
}

export interface GameConfiguration extends GameSettings {
  teams: TeamInput[];
}

export interface Word {
  id: string;
  text: string;
  category: "action" | "animal" | "character" | "food" | "object" | "place";
}

export interface TurnStats {
  correctWords: Word[];
  skippedWords: Word[];
}

export interface TurnResult extends TurnStats {
  id: string;
  round: number;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  points: number;
}

export interface TurnPosition {
  round: number;
  teamIndex: number;
  isGameOver: boolean;
}
