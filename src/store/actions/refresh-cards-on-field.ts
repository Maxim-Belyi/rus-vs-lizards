import type { IGameCard } from "../game.types";

export const refreshCardsOnField = (field: IGameCard[]): IGameCard[] => {
  return field.map((card) => ({ ...card, isCanAttack: true }));
};
