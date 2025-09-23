import { EnumTypeCard } from "./constants";

export type EnumTypeCard = (typeof EnumTypeCard)[keyof typeof EnumTypeCard];

export interface ICard {
  name: string;
  mana: number;
  health: number;
  attack: number;
  type?: EnumTypeCard;
  imageUrl?: string;
  cardDescription?: string;
}
