import { useGameStore } from "../store/game.store";
import Button from "../components/button/Button.module.scss";
import styles from "./WelcomePage.module.scss";

export function WelcomeScreen() {
  const { startGame } = useGameStore();

  return (
    <div className={styles.welcomeContainer}>
      <h1 className={styles.title}>Русы против Ящеров</h1>
      
      <div className={styles.rulesContainer}>
        <p className={styles.objective}>Цель игры - победить противника до того как он победит тебя!</p>
        <h2>Механики карт</h2>
        
        <ul className={styles.mechanicsList}>
          <li className={styles.mechanicItem}>
            <img src="./assets/taunt-shield.avif" alt="Провокация" className={styles.mechanicIcon} />
            <div>
              <h3>Провокация (Taunt)</h3>
              <p>Не позволяет атаковать героя пока карта с этой особенностью на столе.</p>
            </div>
          </li>
          <li className={styles.mechanicItem}>
            <img src="./assets/fast-attack.avif" alt="Шустрый" className={styles.mechanicIcon} />
            <div>
              <h3>Шустрый (Fast Attack)</h3>
              <p>Карта с этой особенностью может атаковать в свой первый ход.</p>
            </div>
          </li>
          <li className={styles.mechanicItem}>
            <img src="./assets/range-attack.avif" alt="Дальняя атака" className={styles.mechanicIcon} />
            <div>
              <h3>Дальняя атака (Ranged Attack)</h3>
              <p>Карта с этой особенностью не получает ответного урона.</p>
            </div>
          </li>
        </ul>
      </div>

      <button className={`${Button.buttonRed} ${styles.startButton}`} onClick={startGame}>
        Начать игру
      </button>
    </div>
  );
}
