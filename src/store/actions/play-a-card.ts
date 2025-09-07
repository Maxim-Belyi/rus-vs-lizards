import type { IGameCard, IGameStore } from "../game.types";

export const PlayCardAction = (
  state: IGameStore,
  cardId: number
): Partial<IGameStore> => {
  const currentPlayerKey =
    state.currentTurn === "player" ? "player" : "opponent";
  const currentPlayerObject = state[currentPlayerKey];

  const cardToPlay = currentPlayerObject.hand.find(
    (card: IGameCard) => card.id === cardId
  );

  if (!cardToPlay) {
    alert(`Карта с id: ${cardId} не найдена в руке игрока ${currentPlayerKey}`);
    return {};
  }

  if (currentPlayerObject.mana < cardToPlay.mana) {
    alert("Недостаточно маны!");
    return {};
  }


  const newHand = currentPlayerObject.hand.filter((card) => card.id !== cardId);
  const newField = [...currentPlayerObject.field, cardToPlay];

  const updatedPlayer = {
    ...currentPlayerObject,
    hand: newHand,
    field: newField,
    mana: currentPlayerObject.mana - cardToPlay.mana,
  };

  return { [currentPlayerKey]: updatedPlayer };
};