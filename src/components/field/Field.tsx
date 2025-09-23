import type { IGameCard } from "../../store/game.types";
import styles from "./Field.module.scss";
import { CardDisplay } from "../cards/CardDisplay";
import clsx from "clsx";
import { AnimatePresence } from "motion/react";

interface FieldProps {
  cards: IGameCard[];
  selectedCardId: number | null;
  isOpponent: boolean;
  onCardClick: (cardId: number) => void;
  shakingCardId: number | null;
}

export function Field({
  cards,
  selectedCardId,
  isOpponent,
  onCardClick,
  shakingCardId,
}: FieldProps) {
  return (
    <div
      className={clsx(styles.fieldContainer, [
        isOpponent ? styles.fieldContainerLizard : styles.fieldContainerRus,
      ])}
    >
      <AnimatePresence>
        {cards.map((card) => (
          <CardDisplay
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
            isOpponent={isOpponent}
            isSelected={!isOpponent && selectedCardId === card.id}
            isReadyToAttack={!isOpponent && card.isCanAttack}
            isDisabled={false}
            isShaking={shakingCardId === card.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
