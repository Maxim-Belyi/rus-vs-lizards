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
  isOnField?: boolean; // triggers spawn animation on first mount only
}

export const ATTACK_DURATION = 1.0; // seconds

const cardVariants = {
  initial: {
    opacity: 0,
    scale: 0.6,
    y: 40,
  },
  idle: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.45,
      ease: "backOut" as const,
    },
  },
  shaking: {
    x: [0, -22, 22, -22, 22, 0],
    rotate: [0, -16, 16, -16, 16, 0],
    transition: { duration: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: -60,
    transition: {
      duration: 0.5,
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
  isOnField,
}: CardDisplayProps) {
  const hasFastAttack = card.type === EnumTypeCard.FAST_ATTACK;
  const hasRangeAttack = card.type === EnumTypeCard.RANGE_ATTACK;
  const hasTaunt = card.type === EnumTypeCard.TAUNT;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerCardRef, unregisterCardRef } = useContext(CardRefsContext);

  // Track whether the card has already played its spawn animation.
  // This prevents re-triggering initial state when `variants` prop changes
  // (e.g., after attack animation ends and variants switches from undefined → cardVariants)
  const hasSpawnedRef = useRef(false);

  useEffect(() => {
    registerCardRef(card.id, buttonRef);
    return () => unregisterCardRef(card.id);
  }, [card.id, registerCardRef, unregisterCardRef]);

  const isAttacking = !!attackOffset;

  // Only play spawn animation on first mount, never again
  const initialVariant = isOnField && !hasSpawnedRef.current ? "initial" : false;
  if (isOnField) {
    hasSpawnedRef.current = true;
  }

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
      variants={cardVariants}
      initial={initialVariant}
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
