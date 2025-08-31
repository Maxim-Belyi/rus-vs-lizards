import type { IGameCard, IGameStore } from "../game.types";

export const getCardById = (cardId: number, deck: IGameCard[]) =>
  deck.find((card) => card.id === cardId);

export const attackCardAction = (
  state: IGameStore,
  attackerId: number,
  targetId: number
) => {
  const isAttackerPlayer = state.currentTurn === "player";
  const attacker = isAttackerPlayer
    ? getCardById(attackerId, state.player.deck)
    : getCardById(attackerId, state.opponent.deck);

  const target = isAttackerPlayer
    ? getCardById(targetId, state.opponent.deck)
    : getCardById(targetId, state.player.deck);

  if (attacker && target && attacker.isCanAttack) {
    target.health -= attacker.attack;
    attacker.isCanAttack = false;

    if (target.health <= 0) {
      if (isAttackerPlayer) {
        state.opponent.deck = state.opponent.deck.filter(
          (card) => card.id !== targetId
        );
      } else {
        state.player.deck = state.player.deck.filter(
          (card) => card.id !== targetId
        );
      }
    }
  }

  return { player: state.player, opponent: state.opponent };
};
