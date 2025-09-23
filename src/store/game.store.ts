import { create } from "zustand";
import type { IGameStore, IHero, IGameCard, TPlayer } from "./game.types";
import { createDeck } from "../functions/create-deck";
import { endTurnAction } from "./actions/end-turn";
import { PlayCardAction } from "./actions/play-a-card";
import { attackCardAction } from "./actions/attack-card";
import { attackHeroAction } from "./actions/attack-hero";
import {
  initialHandSize,
  startingMana,
  startingHealth,
  EnumTypeCard,
} from "../constants/constants";
import type { ICard } from "../constants/cards.types";
import { RUS_CARDS } from "../constants/cards-rus.constants";
import { LIZARD_CARDS } from "../constants/cards-lizards.constants";

const createInitialPlayer = (cardSet: ICard[]): IHero => ({
  deck: createDeck(cardSet),
  hand: [],
  field: [],
  health: startingHealth,
  mana: startingMana,
});

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useGameStore = create<IGameStore>((set, get) => ({
  notification: null,
  player: createInitialPlayer(RUS_CARDS),
  opponent: createInitialPlayer(LIZARD_CARDS),
  currentTurn: "player",
  turnNumber: 1,
  isGameOver: false,
  isGameStarted: false,
  selectedCardId: null,
  winner: null,
  shakingHero: null,
  shakingCardId: null,

  notify: (message: string) => {
    set({ notification: message });
    setTimeout(() => {
      if (get().notification === message) {
        set({ notification: null });
      }
    }, 3000);
  },

  setShakingHero: (hero: TPlayer | null) => {
    set({ shakingHero: hero });
  },

  setShakingCard: (cardId: number | null) => {
    set({ shakingCardId: cardId });
  },

  setSelectedCard: (cardId: number | null) => {
    set({ selectedCardId: cardId });
  },

  startGame: () => {
    const player = createInitialPlayer(RUS_CARDS);
    const opponent = createInitialPlayer(LIZARD_CARDS);

    player.deck.sort(() => Math.random() - 0.5);
    opponent.deck.sort(() => Math.random() - 0.5);

    const playerHand = player.deck.splice(0, initialHandSize);
    const opponentHand = opponent.deck.splice(0, initialHandSize);

    set({
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
  },

  runOpponentTurn: async () => {
    await sleep(1000);

    while (true) {
      const state = get();
      const opponent = state.opponent;
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
    console.log("[ИИ] атакует!");
    await sleep(500);

    const attackerIds = get()
      .opponent.field.filter((card) => card.isCanAttack)
      .map((card) => card.id);

    for (const attackerId of attackerIds) {
      const currentState = get();
      const attacker = currentState.opponent.field.find(
        (c) => c.id === attackerId
      );

      if (!attacker || !attacker.isCanAttack) {
        continue;
      }

      const playerTauntCards = currentState.player.field.filter(
        (card) => card.type === EnumTypeCard.TAUNT
      );
      const playerField = currentState.player.field;

      let target: IGameCard | null = null;

      if (playerTauntCards.length > 0) {
        target =
          playerTauntCards[Math.floor(Math.random() * playerTauntCards.length)];
      } else if (playerField.length > 0) {
        target = playerField[Math.floor(Math.random() * playerField.length)];
      }

      await sleep(1000);

      if (target) {
        console.log(`[ИИ] Карта ${attacker.name} атакует ${target.name}`);
        get().setShakingCard(target.id);
        setTimeout(() => get().setShakingCard(null), 500);
        get().attackCard(attacker.id, target.id);
      } else {
        console.log(`[ИИ] Карта ${attacker.name} атакует героя`);
        get().setShakingHero("player");
        setTimeout(() => get().setShakingHero(null), 500);
        get().attackHero(attacker.id);
      }
    }

    console.log("Противник завершил ход");
    set((state) => endTurnAction(state));
  },

  endTurn: () => {
    const currentTurn = get().currentTurn;
    if (currentTurn === "player") {
      set(endTurnAction(get()));
      get().runOpponentTurn();
    }
  },

  playCard: (cardId: number) => {
    if (get().currentTurn !== "player") return;
    const state = get();
    const player = state.player;
    const cardToPlay = player.hand.find((card) => card.id === cardId);
    if (cardToPlay && player.mana < cardToPlay.mana) {
      get().notify("Нехватает маны!");
      return;
    }
    set((state) => PlayCardAction(state, cardId));
  },

  attackCard: (attackerId: number, targetId: number) =>
    set((state) => attackCardAction(state, attackerId, targetId)),
  attackHero: (attackerId: number) =>
    set((state) => attackHeroAction(state, attackerId)),
}));
