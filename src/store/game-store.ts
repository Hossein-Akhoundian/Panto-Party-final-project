import { create } from "zustand";

import { WORD_BANK } from "@/data/words";
import { createId } from "@/lib/utils";
import { drawWord, getActorIndex, getNextTurnPosition } from "@/lib/game-engine";
import type {
  GameConfiguration,
  GamePhase,
  GameSettings,
  Player,
  Team,
  TurnResult,
  TurnStats,
  Word,
} from "@/types/game";

interface GameState {
  phase: GamePhase;
  settings: GameSettings | null;
  teams: Team[];
  currentRound: number;
  currentTeamIndex: number;
  currentWord: Word | null;
  usedWordIds: string[];
  turnWordIds: string[];
  turnStats: TurnStats;
  turnHistory: TurnResult[];
  remainingSeconds: number;
  turnEndsAt: number | null;
  openSetup: () => void;
  returnHome: () => void;
  startGame: (configuration: GameConfiguration) => void;
  confirmHandoff: () => void;
  revealWord: () => void;
  startTurn: () => void;
  syncTimer: (now?: number) => void;
  correctAnswer: (expectedWordId: string) => void;
  skipWord: (expectedWordId: string) => void;
  endTurn: () => void;
  continueToNextTurn: () => void;
  playAgain: () => void;
  newGame: () => void;
}

const EMPTY_STATS: TurnStats = { correctWords: [], skippedWords: [] };

function getCurrentPlayer(teams: Team[], teamIndex: number, round: number): Player | null {
  const team = teams[teamIndex];
  if (!team || team.players.length === 0) return null;
  return team.players[getActorIndex(round, team.players.length)] ?? null;
}

function firstTurnState(usedWordIds: string[] = []) {
  const draw = drawWord(WORD_BANK, usedWordIds, []);
  return {
    currentWord: draw?.word ?? null,
    usedWordIds: draw?.usedWordIds ?? usedWordIds,
    turnWordIds: draw ? [draw.word.id] : [],
    turnStats: { ...EMPTY_STATS },
  };
}

function normalizeConfiguration(configuration: GameConfiguration): {
  settings: GameSettings;
  teams: Team[];
} | null {
  const gameName = configuration.gameName.trim();
  const teams = configuration.teams
    .map((team) => ({
      id: team.id || createId("team"),
      name: team.name.trim(),
      score: 0,
      players: team.players.map((player) => ({
        id: player.id || createId("player"),
        name: player.name.trim(),
      })),
    }))
    .filter((team) => team.name && team.players.length > 0 && team.players.every((player) => player.name));

  if (!gameName || teams.length < 2) return null;

  return {
    settings: {
      gameName,
      rounds: configuration.rounds,
      turnDuration: configuration.turnDuration,
    },
    teams,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "home",
  settings: null,
  teams: [],
  currentRound: 1,
  currentTeamIndex: 0,
  currentWord: null,
  usedWordIds: [],
  turnWordIds: [],
  turnStats: { ...EMPTY_STATS },
  turnHistory: [],
  remainingSeconds: 0,
  turnEndsAt: null,

  openSetup: () => set({ phase: "setup" }),

  returnHome: () =>
    set({
      phase: "home",
      settings: null,
      teams: [],
      currentRound: 1,
      currentTeamIndex: 0,
      currentWord: null,
      usedWordIds: [],
      turnWordIds: [],
      turnStats: { ...EMPTY_STATS },
      turnHistory: [],
      remainingSeconds: 0,
      turnEndsAt: null,
    }),

  startGame: (configuration) => {
    const normalized = normalizeConfiguration(configuration);
    if (!normalized) return;
    const wordState = firstTurnState();

    set({
      phase: "handoff",
      settings: normalized.settings,
      teams: normalized.teams,
      currentRound: 1,
      currentTeamIndex: 0,
      ...wordState,
      turnHistory: [],
      remainingSeconds: normalized.settings.turnDuration,
      turnEndsAt: null,
    });
  },

  confirmHandoff: () => {
    if (get().phase === "handoff") set({ phase: "word-hidden" });
  },

  revealWord: () => {
    const state = get();
    if (state.phase === "word-hidden" && state.currentWord) set({ phase: "word-revealed" });
  },

  startTurn: () => {
    const state = get();
    if (state.phase !== "word-revealed" || !state.settings || !state.currentWord) return;
    set({
      phase: "playing",
      remainingSeconds: state.settings.turnDuration,
      turnEndsAt: Date.now() + state.settings.turnDuration * 1000,
    });
  },

  syncTimer: (now = Date.now()) => {
    const state = get();
    if (state.phase !== "playing" || state.turnEndsAt === null) return;

    const remainingSeconds = Math.max(0, Math.ceil((state.turnEndsAt - now) / 1000));
    if (remainingSeconds === 0) {
      get().endTurn();
      return;
    }

    if (remainingSeconds !== state.remainingSeconds) set({ remainingSeconds });
  },

  correctAnswer: (expectedWordId) => {
    const state = get();
    if (
      state.phase !== "playing" ||
      !state.currentWord ||
      state.currentWord.id !== expectedWordId ||
      state.remainingSeconds <= 0
    ) {
      return;
    }

    if (state.turnEndsAt !== null && Date.now() >= state.turnEndsAt) {
      get().endTurn();
      return;
    }

    const draw = drawWord(WORD_BANK, state.usedWordIds, state.turnWordIds);
    const answeredWord = state.currentWord;

    set({
      teams: state.teams.map((team, index) =>
        index === state.currentTeamIndex ? { ...team, score: team.score + 1 } : team,
      ),
      currentWord: draw?.word ?? null,
      usedWordIds: draw?.usedWordIds ?? state.usedWordIds,
      turnWordIds: draw ? [...state.turnWordIds, draw.word.id] : state.turnWordIds,
      turnStats: {
        ...state.turnStats,
        correctWords: [...state.turnStats.correctWords, answeredWord],
      },
    });
  },

  skipWord: (expectedWordId) => {
    const state = get();
    if (
      state.phase !== "playing" ||
      !state.currentWord ||
      state.currentWord.id !== expectedWordId ||
      state.remainingSeconds <= 0
    ) {
      return;
    }

    if (state.turnEndsAt !== null && Date.now() >= state.turnEndsAt) {
      get().endTurn();
      return;
    }

    const draw = drawWord(WORD_BANK, state.usedWordIds, state.turnWordIds);
    const skippedWord = state.currentWord;

    set({
      currentWord: draw?.word ?? null,
      usedWordIds: draw?.usedWordIds ?? state.usedWordIds,
      turnWordIds: draw ? [...state.turnWordIds, draw.word.id] : state.turnWordIds,
      turnStats: {
        ...state.turnStats,
        skippedWords: [...state.turnStats.skippedWords, skippedWord],
      },
    });
  },

  endTurn: () => {
    const state = get();
    if (state.phase !== "playing") return;

    const team = state.teams[state.currentTeamIndex];
    const player = getCurrentPlayer(state.teams, state.currentTeamIndex, state.currentRound);

    if (!team || !player) {
      set({ phase: "setup", turnEndsAt: null, remainingSeconds: 0 });
      return;
    }

    const result: TurnResult = {
      id: createId("turn"),
      round: state.currentRound,
      teamId: team.id,
      teamName: team.name,
      playerId: player.id,
      playerName: player.name,
      points: state.turnStats.correctWords.length,
      correctWords: state.turnStats.correctWords,
      skippedWords: state.turnStats.skippedWords,
    };

    set({
      phase: "turn-summary",
      remainingSeconds: 0,
      turnEndsAt: null,
      turnHistory: [...state.turnHistory, result],
    });
  },

  continueToNextTurn: () => {
    const state = get();
    if (state.phase !== "turn-summary" || !state.settings) return;

    const next = getNextTurnPosition(
      state.currentRound,
      state.currentTeamIndex,
      state.settings.rounds,
      state.teams.length,
    );

    if (next.isGameOver) {
      set({
        phase: "game-over",
        currentWord: null,
        turnWordIds: [],
        turnStats: { ...EMPTY_STATS },
      });
      return;
    }

    const wordState = firstTurnState(state.usedWordIds);
    set({
      phase: "handoff",
      currentRound: next.round,
      currentTeamIndex: next.teamIndex,
      ...wordState,
      remainingSeconds: state.settings.turnDuration,
      turnEndsAt: null,
    });
  },

  playAgain: () => {
    const state = get();
    if (!state.settings || state.teams.length < 2) return;
    const wordState = firstTurnState();

    set({
      phase: "handoff",
      teams: state.teams.map((team) => ({ ...team, score: 0 })),
      currentRound: 1,
      currentTeamIndex: 0,
      ...wordState,
      turnHistory: [],
      remainingSeconds: state.settings.turnDuration,
      turnEndsAt: null,
    });
  },

  newGame: () =>
    set({
      phase: "setup",
      settings: null,
      teams: [],
      currentRound: 1,
      currentTeamIndex: 0,
      currentWord: null,
      usedWordIds: [],
      turnWordIds: [],
      turnStats: { ...EMPTY_STATS },
      turnHistory: [],
      remainingSeconds: 0,
      turnEndsAt: null,
    }),
}));
