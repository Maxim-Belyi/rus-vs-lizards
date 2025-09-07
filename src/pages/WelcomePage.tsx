import Button from "../components/ui/button/Button";
import { useGameStore } from "../store/game.store";

export function WelcomeScreen() {
    const {startGame} = useGameStore()

  return (
    <div>
      <Button onClick={startGame}>Начать</Button>
    </div>
  );
}
