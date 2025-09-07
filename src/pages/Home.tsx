// import { useState } from 'react'

import { WelcomeScreen } from "./WelcomePage";
import { GameBoard } from "./GameBoard.tsx";
import { useGameStore } from "../store/game.store.ts";

export function Home() {
  const { isGameStarted } = useGameStore();

  return (
    <main className="app-container">
      {isGameStarted ? <GameBoard /> : <WelcomeScreen />}
    </main>
  );
}
