import type { ICard } from "../constants/cards.types";

export type TPlayer = "player" | "opponent";

export interface IGameCard extends ICard {
  id: number;
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
  selectedCardId: number | null;
  winner: TPlayer | null;
  shakingHero: TPlayer | null;
  shakingCardId: number | null;
  notification: string | null;

  setSelectedCard: (cardID: number | null) => void;
  startGame: () => void;
  endTurn: () => void;
  playCard: (cardId: number) => void;
  attackCard: (attackerId: number, targetId: number) => void;
  attackHero: (attackerId: number) => void;
  runOpponentTurn: () => Promise<void>;
  setShakingHero: (hero: TPlayer | null) => void;
  setShakingCard: (cardId: number | null) => void;
  notify: (message: string) => void;
}


