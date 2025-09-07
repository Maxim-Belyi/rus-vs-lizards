import { create } from "zustand";
import type { IGameStore, IHero } from "./game.types";
import { createDeck } from "../functions/create-deck";
import { endTurnAction } from "./actions/end-turn";
import { PlayCardAction } from "./actions/play-a-card";
import { attackCardAction } from "./actions/attack-card";
import { attackHeroAction } from "./actions/attack-hero";
import {
  initialHandSize,
  startingMana,
  startingHealth,
} from "../constants/constants";

const createInitialPlayer = (): IHero => ({
  deck: createDeck(),
  hand: [],
  field: [],
  health: startingHealth,
  mana: startingMana,
});

export const useGameStore = create<IGameStore>((set, get) => ({
  player: createInitialPlayer(),
  opponent: createInitialPlayer(),
  currentTurn: "player",
  isGameOver: false,
  isGameStarted: false,
  startGame: () => {
    const player = createInitialPlayer();
    const opponent = createInitialPlayer();

    player.deck.sort(() => Math.random() - 0.5);
    opponent.deck.sort(() => Math.random() - 0.5);

    const playerHand = player.deck.splice(0, initialHandSize);
    const opponentHand = opponent.deck.splice(0, initialHandSize);

    set({
      isGameStarted: true,
      isGameOver: false,
      currentTurn: "player",
      player: {
        ...player,
        hand: playerHand,
      },
      opponent: {
        ...opponent,
        hand: opponentHand,
      },
    });
  },

  endTurn: () => set(endTurnAction(get)),
  playCard: (cardId: number) => set((state) => PlayCardAction(state, cardId)),
  attackCard: (attackerId: number, targetId: number) =>
    set((state) => attackCardAction(state, attackerId, targetId)),
  attackHero: (attackerId: number) =>
    set((state) => attackHeroAction(state, attackerId)),
}));
