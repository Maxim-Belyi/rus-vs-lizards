import type { ICard } from "../components/cards/cards.types";
import { EnumTypeCard } from "./constants";

export const CARDS: ICard[] = [
  {
    name: "Крестьянеслав",
    health: 2,
    mana: 1,
    attack: 1,
  },
  {
    name: "Дрынослав",
    health: 4,
    mana: 2,
    attack: 4,
  },
  {
    name: "Щитослав",
    health: 6,
    mana: 3,
    attack: 2,
    type: EnumTypeCard.TAUNT,
  },
  {
    name: "Дрочеслав",
    health: 5,
    mana: 4,
    attack: 3,
  },
  {
    name: "Дровослав",
    health: 3,
    mana: 2,
    attack: 3,
  },
  {
    name: "Староста",
    health: 6,
    mana: 6,
    attack: 6,
    type: EnumTypeCard.TAUNT,
  },
];
