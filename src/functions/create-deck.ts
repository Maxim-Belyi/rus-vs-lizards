import type { ICard } from "../constants/cards.types";
import type { IGameCard } from "../store/game.types";

export function createDeck(cardSet: ICard[]): IGameCard[] {
  return cardSet.map((card) => ({
    ...card,
    id: crypto.randomUUID(),
    isOnBoard: false,
    isCanAttack: false,
  }));
}
