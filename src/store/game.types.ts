import type { ICard } from "../constants/cards.types";

export type TPlayer = "player" | "opponent";

export interface IGameCard extends ICard {
  id: string,
  isOnBoard: boolean;
  isCanAttack: boolean;
}
export interface IHero {
  deck: IGameCard[];
  hand: IGameCard[];
  field: IGameCard[];
  health: number;
  mana: number;
}
export interface IGameStore {
  isGameStarted: boolean;
  turnNumber: number;
  player: IHero;
  opponent: IHero;
  currentTurn: TPlayer;
  isGameOver: boolean;
  selectedCardId: string | null;
  winner: TPlayer | null;
  shakingHero: TPlayer | null;
  shakingCardId: string | null;
  notification: string | null;

  setSelectedCard: (cardID: string | null) => void;
  startGame: () => void;
  endTurn: () => void;
  playCard: (cardId: string) => void;
  attackCard: (attackerId: string, targetId: string) => void;
  attackHero: (attackerId: string) => void;
  runOpponentTurn: () => Promise<void>;
  setShakingHero: (hero: TPlayer | null) => void;
  setShakingCard: (cardId: string | null) => void;
  notify: (message: string) => void;
}


