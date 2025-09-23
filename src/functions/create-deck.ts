import type { ICard } from "../constants/cards.types";
import type { IGameCard } from "../store/game.types";

export function createDeck(cardSet: ICard[]): IGameCard[] {
  return cardSet.map((card, index) => ({
    ...card,
    id: index + 100,
    isOnBoard: false,
    isCanAttack: false,
  }));
}
