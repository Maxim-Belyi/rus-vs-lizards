import { useGameStore } from "../store/game.store";
import { PlayerDisplay } from "../components/player-display/PlayerDisplay";
import { Hand } from "../components/hand/Hand";
import { Field } from "../components/field/Field";
import Button from "../components/button/Button.module.scss";
import { NotificationBubble } from "../components/notification-bubble/NotificationBubble.js";
import { AudioPlayer } from "../components/music-player/MusicPlayer.js";
import { CardRefsProvider, useCardRefs } from "../context/CardRefsContext";
import { HeroRefsProvider, useHeroRefs } from "../context/HeroRefsContext";
import { useState } from "react";
import type { IAttackAnimation } from "../store/game.types";

const ATTACK_DURATION_MS = 1000; // matches ATTACK_DURATION in CardDisplay (1 second)

function computeOffset(
  attackerEl: HTMLElement,
  targetEl: HTMLElement
): { x: number; y: number } {
  const a = attackerEl.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  return {
    x: t.left + t.width / 2 - (a.left + a.width / 2),
    y: t.top + t.height / 2 - (a.top + a.height / 2),
  };
}

// Inner component that has access to both contexts
function GameBoardInner() {
  const {
    player,
    opponent,
    shakingHero,
    currentTurn,
    selectedCardId,
    shakingCardId,
    attackAnimation,
    playCard,
    endTurn,
    runOpponentTurn,
    attackHero,
    setSelectedCard,
    attackCard,
    setShakingHero,
    setShakingCard,
    setAttackAnimation,
    notification,
  } = useGameStore();

  const { getCardRef } = useCardRefs();
  const { getHeroRef } = useHeroRefs();

  // Helper getters for DOM elements to pass to runOpponentTurnAction
  const getCardEl = (id: string): HTMLElement | null =>
    getCardRef(id)?.current ?? null;
  const getHeroEl = (key: "player" | "opponent"): HTMLElement | null =>
    getHeroRef(key)?.current ?? null;

  // Local state for pending attack while animation plays
  const [pendingAttack, setPendingAttack] = useState<{
    attackerId: string;
    targetCardId: string | null; // null = hero
  } | null>(null);

  const triggerAttackAnimation = (
    attackerId: string,
    targetId: string | null,
    anim: IAttackAnimation
  ) => {
    setAttackAnimation(anim);

    // After animation completes, apply the actual damage
    setTimeout(() => {
      setAttackAnimation(null);
      if (targetId !== null) {
        setShakingCard(targetId);
        setTimeout(() => setShakingCard(null), 400);
        attackCard(attackerId, targetId);
      } else {
        setShakingHero("opponent");
        setTimeout(() => setShakingHero(null), 400);
        attackHero(attackerId);
      }
      setPendingAttack(null);
    }, ATTACK_DURATION_MS);
  };

  const handleHeroAttack = () => {
    if (currentTurn !== "player" || !selectedCardId) return;

    const attackerRef = getCardRef(selectedCardId);
    const heroRef = getHeroRef("opponent");

    if (attackerRef?.current && heroRef?.current) {
      const offset = computeOffset(attackerRef.current, heroRef.current);
      setPendingAttack({ attackerId: selectedCardId, targetCardId: null });
      triggerAttackAnimation(selectedCardId, null, {
        attackerId: selectedCardId,
        targetId: null,
        offset,
      });
    } else {
      // Fallback: no DOM refs, run immediately
      setShakingHero("opponent");
      setTimeout(() => setShakingHero(null), 500);
      attackHero(selectedCardId);
    }

    setSelectedCard(null);
  };

  const handleFieldCardClick = (
    clickedCardId: string,
    isPlayerCard: boolean
  ) => {
    if (currentTurn !== "player") return;

    if (isPlayerCard) {
      setSelectedCard(clickedCardId);
    } else {
      if (!selectedCardId) return;

      const attackerRef = getCardRef(selectedCardId);
      const targetRef = getCardRef(clickedCardId);

      if (attackerRef?.current && targetRef?.current) {
        const offset = computeOffset(attackerRef.current, targetRef.current);
        setPendingAttack({ attackerId: selectedCardId, targetCardId: clickedCardId });
        triggerAttackAnimation(selectedCardId, clickedCardId, {
          attackerId: selectedCardId,
          targetId: clickedCardId,
          offset,
        });
      } else {
        // Fallback
        setShakingCard(clickedCardId);
        setTimeout(() => setShakingCard(null), 500);
        attackCard(selectedCardId, clickedCardId);
      }

      setSelectedCard(null);
    }
  };

  const isAnimating = !!attackAnimation || !!pendingAttack;

  return (
    <>
      <NotificationBubble message={notification} />
      <AudioPlayer />
      <section>
        <PlayerDisplay
          player={opponent}
          isOpponent={true}
          playerKey="opponent"
          onHeroClick={handleHeroAttack}
          isShaking={shakingHero === "opponent"}
        />
        <Hand cards={opponent.hand} isOpponent={true} />

        <Field
          isOpponent={true}
          cards={opponent.field}
          selectedCardId={null}
          shakingCardId={shakingCardId}
          onCardClick={(cardId) => handleFieldCardClick(cardId, false)}
          attackingCardId={attackAnimation?.attackerId ?? null}
          attackOffset={attackAnimation?.offset ?? null}
        />
      </section>

      <div className={`${Button.endTurnWrapper}`}>
        <button
          className={`${Button.buttonRed} ${Button.endTurnButton}`}
          onClick={() => {
            endTurn();
            runOpponentTurn(getCardEl, getHeroEl);
          }}
          disabled={currentTurn !== "player" || isAnimating}
        >
          Завершить ход
        </button>
      </div>

      <section>
        <PlayerDisplay
          player={player}
          isOpponent={false}
          playerKey="player"
          isShaking={shakingHero === "player"}
        />

        <Field
          isOpponent={false}
          cards={player.field}
          selectedCardId={selectedCardId}
          onCardClick={(cardId) => handleFieldCardClick(cardId, true)}
          shakingCardId={shakingCardId}
          attackingCardId={attackAnimation?.attackerId ?? null}
          attackOffset={attackAnimation?.offset ?? null}
        />

        <Hand cards={player.hand} isOpponent={false} onCardClick={playCard} />
      </section>
    </>
  );
}

export function GameBoard() {
  return (
    <CardRefsProvider>
      <HeroRefsProvider>
        <GameBoardInner />
      </HeroRefsProvider>
    </CardRefsProvider>
  );
}
