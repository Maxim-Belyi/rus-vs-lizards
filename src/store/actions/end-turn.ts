import type { IGameStore, TPlayer } from "../game.types";
import {
  maxMana,
  startingMana,
  cardToHandPerTurn,
} from "../../constants/constants";
import { refreshCardsOnField } from "./refresh-cards-on-field";
import { drawCardsAction } from "./draw-cards";

export const endTurnAction = (state: IGameStore): Partial<IGameStore> => {
  const newTurn: TPlayer =
    state.currentTurn === "player" ? "opponent" : "player";

  const newTurnNumber =
    newTurn === "player" ? state.turnNumber + 1 : state.turnNumber;

  let playerAfterDraw = state.player;
  let opponentAfterDraw = state.opponent;

  if (newTurn === "player") {
    playerAfterDraw = drawCardsAction(state.player, cardToHandPerTurn);
  } else {
    opponentAfterDraw = drawCardsAction(state.opponent, cardToHandPerTurn);
  }

  const newPlayerMana =
    newTurn === "player"
      ? Math.min(startingMana + newTurnNumber, maxMana)
      : state.player.mana;

  const newOpponentMana =
    newTurn === "opponent"
      ? Math.min(startingMana + newTurnNumber, maxMana)
      : state.opponent.mana;

  const refreshedPlayerField =
    newTurn === "player"
      ? refreshCardsOnField(state.player.field)
      : state.player.field;

  const refreshedOpponentField =
    newTurn === "opponent"
      ? refreshCardsOnField(state.opponent.field)
      : state.opponent.field;

  return {
    currentTurn: newTurn,
    turnNumber: newTurnNumber,
    player: {
      ...playerAfterDraw,
      mana: newPlayerMana,
      field: refreshedPlayerField,
    },
    opponent: {
      ...opponentAfterDraw,
      mana: newOpponentMana,
      field: refreshedOpponentField,
    },
  };
};
