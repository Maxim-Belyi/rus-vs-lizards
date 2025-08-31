import { create } from "zustand";
import type { IGameStore, IHero } from "./game.types";
import { createDeck } from "./create-deck";
import { endTurnAction } from "./actions/end-turn";
import { PlayCardAction } from "./actions/play-a-card";
import { attackCardAction } from "./actions/attack-card";
import { attackHeroAction } from "./actions/attack-hero";

const initialPlayerData: IHero = {
  deck: createDeck(),
  health: 20,
  mana: 1,
};

const initialGameData: Pick<IGameStore, 'player' | 'opponent' | 'currentTurn' | "isGameOver"> = {
  player: initialPlayerData,
  opponent: initialPlayerData,
  currentTurn: "player",
  isGameOver: false,
};

export const useGameStore = create<IGameStore>((set, get) => ({
  ...initialGameData,
  startGame: () => set(initialGameData),
  endTurn: () => set(endTurnAction(get)),
  playCard: (cardId: number) => {
    set((state) => PlayCardAction(state, cardId));
  },
  attackCard: (attackerId: number, targetId: number) => {
    set((state) => attackCardAction(state, attackerId, targetId));
  },
  attackHero: (attackerId: number) => {
    set((state) => attackHeroAction(state, attackerId));
  },
}));
