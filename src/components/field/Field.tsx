import type { IGameCard } from "../../store/game.types";
import styles from "./Field.module.scss";
import { CardDisplay } from "../cards/CardDisplay";
import clsx from "clsx";
import { AnimatePresence } from "motion/react";

interface FieldProps {
  cards: IGameCard[];
  selectedCardId: string | null;
  isOpponent: boolean;
  onCardClick: (cardId: string) => void;
  shakingCardId: string | null;
  attackingCardId?: string | null;
  attackOffset?: { x: number; y: number } | null;
}

export function Field({
  cards,
  selectedCardId,
  isOpponent,
  onCardClick,
  shakingCardId,
  attackingCardId,
  attackOffset,
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
            isOnField={true}
            isSelected={!isOpponent && selectedCardId === card.id}
            isReadyToAttack={!isOpponent && card.isCanAttack}
            isDisabled={false}
            isShaking={shakingCardId === card.id}
            attackOffset={
              attackingCardId === card.id ? attackOffset : null
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
