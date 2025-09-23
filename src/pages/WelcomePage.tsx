// import Button from "../components/ui/button/Button";
import { useGameStore } from "../store/game.store";
import Button from "../components/button/Button.module.scss";

export function WelcomeScreen() {
    const {startGame} = useGameStore()

  return (
    <div>
      <button className={`${Button.buttonRed}`} onClick={startGame}>Начать</button>
    </div>
  );
}
