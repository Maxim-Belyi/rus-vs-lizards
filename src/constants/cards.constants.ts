import type { ICard } from "../components/cards/cards.types";
import { EnumTypeCard } from "./constants";

export const CARDS: ICard[] = [
  {
    name: "Домовой",
    health: 2,
    mana: 1,
    attack: 2,
    imageUrl: '/assets/cards/rusy/Domovoy.avif'
  },
  {
    name: "Дёмка-свинопас",
    health: 3,
    mana: 1,
    attack: 1,
    imageUrl: '/assets/cards/rusy/Demka-svinopas.avif'
  },
  {
    name: "Яромира-пряжница",
    health: 3,
    mana: 1,
    attack: 2,
    imageUrl: '/assets/cards/rusy/Yaromira.avif'
  },
  {
    name: "Грибослав",
    health: 5,
    mana: 2,
    attack: 2,
    type: EnumTypeCard.TAUNT,
    imageUrl: '/assets/cards/rusy/Griboslav.avif'
  },
  {
    name: "Травница",
    health: 3,
    mana: 2,
    attack: 1,
    imageUrl: '/assets/cards/rusy/Travnica.avif'
  },
  {
    name: "Рубослав",
    health: 5,
    mana: 3,
    attack: 3,
    imageUrl: '/assets/cards/rusy/RyboSlav.avif'
  },
  {
    name: "Лукослав",
    health: 3,
    mana: 3,
    attack: 5,
    imageUrl: '/assets/cards/rusy/Lykoslav.avif'
  },
  {
    name: "Леший",
    health: 6,
    mana: 4,
    attack: 5,
    imageUrl: '/assets/cards/rusy/Leshiy.avif'
  },
  {
    name: "Староста",
    health: 5,
    mana: 4,
    attack: 6,
    type: EnumTypeCard.TAUNT,
    imageUrl: '/assets/cards/rusy/Starosta.avif'
  },
];
