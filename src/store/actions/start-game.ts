import type { ICard } from "../../constants/cards.types";
import { RUS_CARDS } from "../../constants/cards-rus.constants";
import { LIZARD_CARDS } from "../../constants/cards-lizards.constants";
import { createDeck } from "../../functions/create-deck";
import { initialHandSize, startingHealth, startingMana } from "../../constants/constants";
import type { IGameStore, IHero } from "../game.types";

const createInitialPlayer = (cardSet: ICard[]): IHero => ({
  deck: createDeck(cardSet),
  hand: [],
  field: [],
  health: startingHealth,
  mana: startingMana,
});

export const startGame = (): Partial<IGameStore> => {
    const player = createInitialPlayer(RUS_CARDS);
    const opponent = createInitialPlayer(LIZARD_CARDS);

    player.deck.sort(() => Math.random() - 0.5);
    opponent.deck.sort(() => Math.random() - 0.5);

    const playerHand = player.deck.splice(0, initialHandSize);
    const opponentHand = opponent.deck.splice(0, initialHandSize);

    return({
      selectedCardId: null,
      isGameStarted: true,
      isGameOver: false,
      turnNumber: 1,
      currentTurn: "player",
      winner: null,
      shakingHero: null,
      shakingCardId: null,
      notification: null,
      player: {
        ...player,
        hand: playerHand,
      },
      opponent: {
        ...opponent,
        hand: opponentHand,
      },
    });
  }