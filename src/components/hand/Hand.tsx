import clsx from "clsx";
import { CardDisplay } from "../cards/CardDisplay"; 
import type { IGameCard } from "../../store/game.types";
import styles from "./Hand.module.scss";

interface HandProps {
  cards: IGameCard[];
  isOpponent: boolean;
  onCardClick?: (cardId: string) => void; 
}

export function Hand({ cards, isOpponent, onCardClick }: HandProps) {
  return (
    <div className={clsx(styles.wrapper, [isOpponent? styles.wrapperLizard : styles.wrapperRus])}>
      {cards.map((card) => (
        <CardDisplay
          key={card.id}
          card={card}
          isFaceDown={isOpponent}
          onClick={() => onCardClick && onCardClick(card.id)}
          isDisabled={isOpponent} 
        />
      ))}
    </div>
  );
}