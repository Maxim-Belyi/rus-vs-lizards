import { maxCardsOnHand } from "./../../constants/constants";
import type { IHero } from "../game.types";

export const drawCardsAction = (player: IHero, amount: number): IHero => {
  const availableSlots = maxCardsOnHand - player.hand.length;

  if (availableSlots <= 0) {
    alert("Максимум карт в руке, карты не добираются");
    return player;
  }

  const cardToActuallyDraw = Math.min(amount, availableSlots);

  const newDeck = [...player.deck];
  const cardsToDraw = newDeck.splice(0, cardToActuallyDraw);

  if (cardsToDraw.length === 0) {
    return player;
  }
  
  const newHand = [...player.hand, ...cardsToDraw];

  return {
    ...player,
    deck: newDeck,
    hand: newHand,
  };
};
