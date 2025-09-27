import { EnumTypeCard } from "../../constants/constants";
import type { IGameStore } from "../game.types";


export const attackHeroAction = (
  state: IGameStore,
  attackerId: string
): Partial<IGameStore> => {
  const isPlayerTurn = state.currentTurn === "player";
  const attackerPlayerKey = isPlayerTurn ? "player" : "opponent";
  const defenderPlayerKey = isPlayerTurn ? "opponent" : "player";

  const attackerPlayer = state[attackerPlayerKey];
  const defenderPlayer = state[defenderPlayerKey];

  const attacker = attackerPlayer.field.find((card) => card.id === attackerId);

  if (!attacker) {
    console.error(`Атакующая карта с ID ${attackerId} не найдена на поле!`);
    return {};
  }
  if (!attacker.isCanAttack) {
    return {};
  }

  const defenderHasTaunt = defenderPlayer.field.some(
    (card) => card.type === EnumTypeCard.TAUNT
  );

  if (defenderHasTaunt) {
    return {};
  }

  const updatedDefender = {
    ...defenderPlayer,
    health: defenderPlayer.health - attacker.attack,
  };

  const updatedAttackerField = attackerPlayer.field.map((card) =>
    card.id === attackerId ? { ...card, isCanAttack: false } : card
  );

  const updatedAttacker = {
    ...attackerPlayer,
    field: updatedAttackerField,
  };

  const isGameOver = updatedDefender.health <= 0;

  return {
    [attackerPlayerKey]: updatedAttacker,
    [defenderPlayerKey]: updatedDefender,
    isGameOver: isGameOver,
    winner: isGameOver ? attackerPlayerKey : null, 
  };
};
