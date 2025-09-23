import type { TPlayer } from "../../store/game.types";
import styles from "./GameOver.module.scss";

interface GameOverProps {
  winner: TPlayer;
  onPlayAgain: () => void;
}

export function GameOver({ winner, onPlayAgain }: GameOverProps) {
  const gameOverMessage =
    winner === "player" ? "Вы победили! Самовары спасены!" : "Вы проиграли! Ящеры украли самовары!";

  return (
    <div className={styles.gameOverContainer}>
      <h2 className={styles.gameOverTitle}>
        {gameOverMessage}
      </h2>
      <button className={styles.playAgainButton} onClick={onPlayAgain}>
        Сыграть снова
      </button>
    </div>
  );
}
