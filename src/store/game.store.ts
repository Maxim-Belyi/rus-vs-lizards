import { create } from "zustand";
import type { IGameStore, IHero, TPlayer } from "./game.types";
import { EnumTypeCard, maxCardsOnField } from "../constants/constants";
import { createDeck } from "../functions/create-deck";
import { endTurnAction } from "./actions/end-turn";
import { PlayCardAction } from "./actions/play-a-card";
import { attackCardAction } from "./actions/attack-card";
import { attackHeroAction } from "./actions/attack-hero";
import { startGame } from "./actions/start-game";
import { startingMana, startingHealth } from "../constants/constants";
import type { ICard } from "../constants/cards.types";
import { RUS_CARDS } from "../constants/cards-rus.constants";
import { LIZARD_CARDS } from "../constants/cards-lizards.constants";
import { runOpponentTurnAction } from "./actions/run-opponent-turn";

const createInitialPlayer = (cardSet: ICard[]): IHero => ({
  deck: createDeck(cardSet),
  hand: [],
  field: [],
  health: startingHealth,
  mana: startingMana,
});

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

  attackHero: (attackerId: string) => {
    const { player, opponent, notify, currentTurn } = get();
    const defenderPlayer = currentTurn === "player" ? opponent : player;
    const defenderHasTaunt = defenderPlayer.field.some(
      (card) => card.type === EnumTypeCard.TAUNT
    );

    if (defenderHasTaunt) {
      notify("Атакуйте существо с `Провокацией`");
      return;
    }

    set((state) => attackHeroAction(state, attackerId));
  },

  attackCard: (attackerId: string, targetId: string) => {
    const { player, opponent, notify, currentTurn } = get();

    const attackerPlayer = currentTurn === "player" ? player : opponent;

    const attacker = attackerPlayer.field.find(
      (card) => card.id === attackerId
    );

    if (!attacker || !attacker.isCanAttack) {
      notify("Карта не может атаковать сейчас");
      return;
    }

    if (!attacker.isCanAttack) {
      notify(`Карта ${attacker.name} уже атаковала в этом ходу!`);
      return {};
    }
    set((state) => attackCardAction(state, attackerId, targetId));
  },

  setShakingHero: (hero: TPlayer | null) => {
    set({ shakingHero: hero });
  },

  setShakingCard: (cardId: string | null) => {
    set({ shakingCardId: cardId });
  },

  setSelectedCard: (cardId: string | null) => {
    set({ selectedCardId: cardId });
  },

  startGame: () => {
    set(startGame());
  },

  runOpponentTurn: async () => {
    await runOpponentTurnAction(get, set);
  },

  endTurn: () => {
    const currentTurn = get().currentTurn;
    if (currentTurn === "player") {
      set(endTurnAction(get()));
      get().runOpponentTurn();
    }
  },

  playCard: (cardId: string) => {
    if (get().currentTurn !== "player") return;
    const state = get();
    const player = state.player;
    const cardToPlay = player.hand.find((card) => card.id === cardId);

    if (cardToPlay && player.mana < cardToPlay.mana) {
      get().notify("Нехватает маны!");
      return;
    }

    if (player.field.length >= maxCardsOnField) {
      get().notify("Слишком много карт на столе!");
      return;
    }

    set((state) => PlayCardAction(state, cardId));
  },
}));
