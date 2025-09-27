import type { IGameStore, IGameCard } from "../game.types";
import { EnumTypeCard } from "../../constants/constants";
import { PlayCardAction } from "./play-a-card";
import { endTurnAction } from "./end-turn";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const runOpponentTurnAction = async (
  get: () => IGameStore,
  set: (partial: Partial<IGameStore> | ((state: IGameStore) => Partial<IGameStore>)) => void
) => {
  await sleep(1000);

  while (true) {
    const opponent = get().opponent;
    const playableCards = opponent.hand.filter(
      (card) => card.mana <= opponent.mana
    );

    if (playableCards.length === 0) break;

    const cardToPlay = playableCards.reduce((prev, current) =>
      prev.mana > current.mana ? prev : current
    );

    set((state) => PlayCardAction(state, cardToPlay.id));
    await sleep(1000);
  }

  console.log("Противник атакует!");
  await sleep(500);

  const attackerIds = get()
    .opponent.field.filter((card) => card.isCanAttack)
    .map((card) => card.id);

  for (const attackerId of attackerIds) {
    const currentState = get();
    const attacker = currentState.opponent.field.find((c) => c.id === attackerId);
    if (!attacker || !attacker.isCanAttack) continue;

    const playerTauntCards = currentState.player.field.filter(
      (card) => card.type === EnumTypeCard.TAUNT
    );
    const playerField = currentState.player.field;
    let target: IGameCard | null = null;

    if (playerTauntCards.length > 0) {
      target = playerTauntCards[Math.floor(Math.random() * playerTauntCards.length)];
    } else if (playerField.length > 0) {
      target = playerField[Math.floor(Math.random() * playerField.length)];
    }

    await sleep(1000);

    if (target) {
      get().setShakingCard(target.id);
      setTimeout(() => get().setShakingCard(null), 500);
      get().attackCard(attacker.id, target.id);
    } else {
      get().setShakingHero("player");
      setTimeout(() => get().setShakingHero(null), 500);
      get().attackHero(attacker.id);
    }
  }

  console.log("Противник завершил ход");
  set((state) => endTurnAction(state));
};

