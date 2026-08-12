import type { IGameStore, IGameCard } from "../game.types";
import { EnumTypeCard } from "../../constants/constants";
import { PlayCardAction } from "./play-a-card";
import { endTurnAction } from "./end-turn";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const ATTACK_ANIM_DURATION = 400;

function computeOffset(
  attackerEl: HTMLElement,
  targetEl: HTMLElement
): { x: number; y: number } {
  const a = attackerEl.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  return {
    x: t.left + t.width / 2 - (a.left + a.width / 2),
    y: t.top + t.height / 2 - (a.top + a.height / 2),
  };
}

export const runOpponentTurnAction = async (
  get: () => IGameStore,
  set: (partial: Partial<IGameStore> | ((state: IGameStore) => Partial<IGameStore>)) => void,
  getCardEl?: (id: string) => HTMLElement | null,
  getHeroEl?: (key: "player" | "opponent") => HTMLElement | null
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

    await sleep(600);

    if (target) {
      // Try to animate using DOM refs
      const attackerEl = getCardEl?.(attackerId) ?? null;
      const targetEl = getCardEl?.(target.id) ?? null;

      if (attackerEl && targetEl) {
        const offset = computeOffset(attackerEl, targetEl);
        get().setAttackAnimation({ attackerId, targetId: target.id, offset });
        await sleep(ATTACK_ANIM_DURATION);
        get().setAttackAnimation(null);
        // Brief pause before damage lands
        await sleep(60);
      }

      get().setShakingCard(target.id);
      setTimeout(() => get().setShakingCard(null), 400);
      get().attackCard(attacker.id, target.id);
    } else {
      // Attack hero
      const attackerEl = getCardEl?.(attackerId) ?? null;
      const heroEl = getHeroEl?.("player") ?? null;

      if (attackerEl && heroEl) {
        const offset = computeOffset(attackerEl, heroEl);
        get().setAttackAnimation({ attackerId, targetId: null, offset });
        await sleep(ATTACK_ANIM_DURATION);
        get().setAttackAnimation(null);
        await sleep(60);
      }

      get().setShakingHero("player");
      setTimeout(() => get().setShakingHero(null), 400);
      get().attackHero(attacker.id);
    }

    await sleep(400);
  }

  console.log("Противник завершил ход");
  set((state) => endTurnAction(state));
};
