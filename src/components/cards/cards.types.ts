import { EnumTypeCard } from "../../constants/constants";

export type EnumTypeCard = typeof EnumTypeCard[keyof typeof EnumTypeCard];

export interface ICard {
    name: string
    mana: number
    health: number
    attack: number
    type?: EnumTypeCard
}

