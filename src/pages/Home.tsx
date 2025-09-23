// import { WelcomeScreen } from "./WelcomePage";
// import { GameBoard } from "./GameBoard.tsx";
// import { useGameStore } from "../store/game.store.ts";

// export function Home() {
//   const { isGameStarted } = useGameStore();

//   return (
//     <main className="app-container">
//       {isGameStarted ? <GameBoard /> : <WelcomeScreen />}
//     </main>
//   );
// }
// src/pages/Home.tsx
import { WelcomeScreen } from "./WelcomePage";
import { GameBoard } from "./GameBoard";
import { useGameStore } from "../store/game.store";
import { GameOver } from "../components/game-over/GameOver";

export function Home() {
  const { isGameStarted, isGameOver, winner, startGame } = useGameStore();

  return (
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
  );
}
