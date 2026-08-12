import type { IHero } from "../../store/game.types";
import styles from "./PlayerInterface.module.scss";
import clsx from "clsx";
import { motion } from "motion/react";
import { useRef, useEffect, useContext } from "react";
import { HeroRefsContext } from "../../context/HeroRefsContext";
import type { TPlayer } from "../../store/game.types";

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
  playerKey: TPlayer;
}

export function PlayerDisplay({
  player,
  isOpponent,
  isShaking,
  onHeroClick,
  playerKey,
}: PlayerInterfaceProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { registerHeroRef } = useContext(HeroRefsContext);

  useEffect(() => {
    registerHeroRef(playerKey, heroRef);
  }, [playerKey, registerHeroRef]);

  return (
    <motion.div
      ref={heroRef}
      variants={shakeVariants}
      animate={isShaking ? "shaking" : "idle"}
      
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
