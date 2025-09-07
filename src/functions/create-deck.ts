import { CARDS } from "../constants/cards.constants";
import type { IGameCard } from "../store/game.types";

export function createDeck(): IGameCard[] {
  return CARDS.map((card, index) => ({
    ...card,
    id: index + 1,
    isOnBoard: false,
    isCanAttack: false,
    isFastAttack: false
  }));
}
