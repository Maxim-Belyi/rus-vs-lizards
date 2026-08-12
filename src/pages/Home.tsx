import { WelcomeScreen } from "./WelcomePage";
import { GameBoard } from "./GameBoard";
import { useGameStore } from "../store/game.store";
import { GameOver } from "../components/game-over/GameOver";
import { RotateDevice } from "../components/rotate-device/RotateDevice";

export function Home() {
  const { isGameStarted, isGameOver, winner, startGame } = useGameStore();

  return (
    <>
      <RotateDevice />
      <main className="app-container">
        {(() => {
          if (isGameOver && winner) {
            return <GameOver winner={winner} onPlayAgain={startGame} />;
          }
          if (isGameStarted) {
            return <GameBoard />;
          }
          return <WelcomeScreen />;
        })()}
      </main>
    </>
  );
}
