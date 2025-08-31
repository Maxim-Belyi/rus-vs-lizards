import { EnumTypeCard } from "../../constants/constants";
import type { IGameStore } from "../game.types";
import { getCardById } from "./attack-card";

export const attackHeroAction = (
  state: IGameStore,
  attackerId: number
): Partial<IGameStore> => {
  const isAttackerPlayer = state.currentTurn === "player";
  const opponent = state[isAttackerPlayer ? "opponent" : "player"];

  const attacker = getCardById(
    attackerId,
    isAttackerPlayer ? state.opponent.deck : state.player.deck
  );

  const isOpponentHasTaunt = opponent.deck.find(
    (card) => card.type === EnumTypeCard.TAUNT
  );

  if (attacker && attacker.isCanAttack && !isOpponentHasTaunt) {
    opponent.health -= attacker.attack;
    attacker.isCanAttack = false;

    if (opponent.health <= 0) {
      state.isGameOver = true;
    }
  }

  return {
    player: state.player,
    opponent: state.opponent,
    isGameOver: state.isGameOver,
  };
};
