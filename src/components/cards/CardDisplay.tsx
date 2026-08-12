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

const ATTACK_DURATION = 0.4;

const cardVariants = {
  idle: {
    x: 0,
    y: 0,
    rotate: 0,
    zIndex: 1,
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
  const attackAnimate = isAttacking
    ? {
        x: [0, attackOffset.x * 0.9, 0],
        y: [0, attackOffset.y * 0.9, 0],
        zIndex: [1, 999, 1],
        transition: {
          duration: ATTACK_DURATION,
          times: [0, 0.48, 1],
          ease: ["easeIn", "easeOut"],
        },
      }
    : undefined;

  return (
    <motion.button
      ref={buttonRef}
      variants={isAttacking ? undefined : cardVariants}
      animate={
        isAttacking
          ? attackAnimate
          : isShaking
          ? "shaking"
          : "idle"
      }
      exit="exit"
      whileHover={
        !isOpponent && !isDisabled
          ? {
              scale: 1.2,
              y: -85,
              zIndex: 3,
              transition: { duration: 0.1 },
            }
          : { scale: 1.2, transition: { duration: 0.1 } }
      }
      whileTap={{ scale: 0.9 }}
      className={clsx(styles.card, {
        [styles.canAttack]: isReadyToAttack,
      })}
      data-facedown={isFaceDown}
      onClick={onClick}
      disabled={isDisabled}
      style={
        {
          "--card-image": `url(${card.imageUrl})`,
        } as CSSProperties
      }
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
