import { EnumTypeCard } from "../../constants/constants";
import type { IGameStore } from "../game.types";

export const attackCardAction = (
  state: IGameStore,
  attackerId: number,
  targetId: number
): Partial<IGameStore> => {
  const isPlayerTurn = state.currentTurn === "player";
  const attackerPlayerKey = isPlayerTurn ? "player" : "opponent";
  const defenderPlayerKey = isPlayerTurn ? "opponent" : "player";

  const attackerPlayer = state[attackerPlayerKey];
  const defenderPlayer = state[defenderPlayerKey];

  const attacker = attackerPlayer.field.find((card) => card.id === attackerId);
  const target = defenderPlayer.field.find((card) => card.id === targetId);

  if (!attacker || !target) {
    console.error(
      `Атакующий (id: ${attackerId}) или цель (id: ${targetId}) не найдены`
    );
    return {};
  }

  if (!attacker.isCanAttack) {
    console.error(`Карта ${attacker.name} уже атаковала на этом ходу`);
    return {};
  }

  target.health -= attacker.attack;
  if (attacker.type !== EnumTypeCard.RANGE_ATTACK) {
    attacker.health -= target.attack;
  }

  const finalAttackerField = attackerPlayer.field
    .map((card) =>
      card.id === attackerId
        ? { ...card, isCanAttack: false, health: attacker.health }
        : card
    )
    .filter((card) => card.health > 0);

  const finalDefenderField = defenderPlayer.field
    .map((card) =>
      card.id === targetId ? { ...card, health: target.health } : card
    )
    .filter((card) => card.health > 0);

  return {
    [attackerPlayerKey]: {
      ...attackerPlayer,
      field: finalAttackerField,
    },
    [defenderPlayerKey]: {
      ...defenderPlayer,
      field: finalDefenderField,
    },
  };
};
