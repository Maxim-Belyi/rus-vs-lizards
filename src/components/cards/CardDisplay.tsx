import type { IGameCard } from "../../store/game.types";
import { EnumTypeCard } from "../../constants/constants";
import styles from "./Card.module.scss";
import clsx from "clsx";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { useEffect, useRef, useContext } from "react";
import { CardRefsContext } from "../../context/CardRefsContext";

interface CardDisplayProps {
  card: IGameCard;
  isOpponent?: boolean;
  isFaceDown?: boolean;
  isSelected?: boolean;
  isReadyToAttack?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  isDisabled?: boolean;
  isShaking?: boolean;
  attackOffset?: { x: number; y: number } | null;
}

export const ATTACK_DURATION = 1.0; // seconds

const cardVariants = {
  idle: {
    x: 0,
    y: 0,
    rotate: 0,
  },
  shaking: {
    x: [0, -22, 22, -22, 22, 0],
    rotate: [0, -16, 16, -16, 16, 0],
    transition: { duration: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: -70,
    transition: {
      duration: 0.6,
    },
  },
};

export function CardDisplay({
  card,
  isReadyToAttack,
  isFaceDown,
  isOpponent,
  onClick,
  isDisabled,
  isShaking,
  attackOffset,
}: CardDisplayProps) {
  const hasFastAttack = card.type === EnumTypeCard.FAST_ATTACK;
  const hasRangeAttack = card.type === EnumTypeCard.RANGE_ATTACK;
  const hasTaunt = card.type === EnumTypeCard.TAUNT;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerCardRef, unregisterCardRef } = useContext(CardRefsContext);

  useEffect(() => {
    registerCardRef(card.id, buttonRef);
    return () => unregisterCardRef(card.id);
  }, [card.id, registerCardRef, unregisterCardRef]);

  const isAttacking = !!attackOffset;

  // Keyframe animation: fly to target (100%), briefly pause, return home
  const attackAnimate = isAttacking
    ? {
        x: [0, attackOffset.x, attackOffset.x * 0.85, 0],
        y: [0, attackOffset.y, attackOffset.y * 0.85, 0],
        scale: [1, 1.15, 1, 1],
        transition: {
          duration: ATTACK_DURATION,
          times: [0, 0.5, 0.65, 1],
          ease: "easeInOut" as const,
        },
      }
    : undefined;

  return (
    <motion.button
      ref={buttonRef}
      variants={isAttacking ? undefined : cardVariants}
      animate={isAttacking ? attackAnimate : isShaking ? "shaking" : "idle"}
      exit="exit"
      style={
        isAttacking
          ? ({ "--card-image": `url(${card.imageUrl})`, zIndex: 999 } as CSSProperties)
          : ({ "--card-image": `url(${card.imageUrl})` } as CSSProperties)
      }
      whileHover={
        !isAttacking && !isOpponent && !isDisabled
          ? {
              scale: 1.2,
              y: -85,
              zIndex: 3,
              transition: { duration: 0.1 },
            }
          : !isAttacking
          ? { scale: 1.2, transition: { duration: 0.1 } }
          : {}
      }
      whileTap={!isAttacking ? { scale: 0.9 } : {}}
      className={clsx(styles.card, {
        [styles.canAttack]: isReadyToAttack,
      })}
      data-facedown={isFaceDown}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className={clsx(styles.cardArt)}>
        <span
          className={clsx(styles.cardAttack, {
            [styles.cardAttackRus]: !isOpponent,
            [styles.cardAttackLizard]: isOpponent,
          })}
        >
          {card.attack}
        </span>

        <span className={clsx(styles.mana)}>{card.mana}</span>

        <span
          className={clsx({
            [styles.cardHealthLizard]: isOpponent,
            [styles.cardHealthRus]: !isOpponent,
          })}
        >
          {card.health}
        </span>

        <span className={styles.cardName}>{card.name}</span>

        {hasTaunt && !isFaceDown && (
          <span className={clsx(styles.cardEffect, styles.cardTaunt)}>
            <img src="./assets/taunt-shield.avif" alt="Провокация" />
          </span>
        )}

        {hasRangeAttack && !isFaceDown && (
          <span className={styles.cardEffect}>
            <img src="./assets/range-attack.avif" alt="Дальняя атака" />
          </span>
        )}

        {hasFastAttack && !isFaceDown && (
          <span className={styles.cardEffect}>
            <img src="./assets/fast-attack.avif" alt="Быстрая атака" />
          </span>
        )}
      </div>
    </motion.button>
  );
}
