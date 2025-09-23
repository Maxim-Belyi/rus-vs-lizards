import type { IHero } from "../../store/game.types";
import styles from "./PlayerInterface.module.scss";
import clsx from "clsx";
import { motion } from "motion/react";

const shakeVariants = {
  idle: {
    x: 0,
  },
  shaking: {
    x: [0, -10, 10, -10, 10, 0],
    rotate: 3,
    transition: {
      duration: 0.7,
    },
  },
};

interface PlayerInterfaceProps {
  player: IHero;
  isOpponent: boolean;
  isShaking?: boolean;
  onHeroClick?: () => void;
  onAnimationComplete?: () => void;
}

export function PlayerDisplay({
  player,
  isOpponent,
  isShaking,
  onHeroClick,
}: PlayerInterfaceProps) {
  return (
    <motion.div
      variants={shakeVariants}
      animate={isShaking ? "shaking" : "idle"}
      // onAnimationComplete={onAnimationComplete}

      className={clsx(isOpponent ? styles.playerLizard : styles.playerRus)}
      onClick={onHeroClick}
    >
      <p className={clsx(isOpponent ? styles.nameLizard : styles.nameRus)}>
        {isOpponent ? "Молотопуз" : "Парослав"}
      </p>
      <p
        className={clsx(styles.health, [
          isOpponent ? styles.healthLizard : styles.healthRus,
        ])}
      >
        {player.health}
      </p>
      <p
        className={clsx(styles.mana, [
          isOpponent ? styles.manaLizard : styles.manaRus,
        ])}
      >
        {player.mana}
      </p>
    </motion.div>
  );
}
