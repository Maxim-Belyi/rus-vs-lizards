import { useGameStore } from "../store/game.store";
import { PlayerDisplay } from "../components/player-display/PlayerDisplay";
import { Hand } from "../components/hand/Hand";
import { Field } from "../components/field/Field";
import Button from "../components/button/Button.module.scss";
import {NotificationBubble} from "../components/notification-bubble/NotificationBubble.js"

export function GameBoard() {
  const {
    player,
    opponent,
    shakingHero,
    currentTurn,
    selectedCardId,
    shakingCardId,
    playCard,
    endTurn,
    attackHero,
    setSelectedCard,
    attackCard,
    setShakingHero,
    setShakingCard,
    notification,
  } = useGameStore();

  const handleHeroAttack = () => {
    if (currentTurn !== "player" || !selectedCardId) return;

    setShakingHero("opponent");
    setTimeout(() => setShakingHero(null), 500);

    attackHero(selectedCardId);
    setSelectedCard(null);
  };

  const handleFieldCardClick = (
    clickedCardId: number,
    isPlayerCard: boolean
  ) => {
    console.log(`ID: ${clickedCardId}, игрок ${isPlayerCard}`);
    if (currentTurn !== "player") return;

    if (isPlayerCard) {
      setSelectedCard(clickedCardId);
    } else {
      if (selectedCardId) {
        setShakingCard(clickedCardId);
        setTimeout(() => setShakingCard(null), 500)

        attackCard(selectedCardId, clickedCardId);
        setSelectedCard(null);
      }
    }
  };

  return (
    <>
    <NotificationBubble message={notification} />
      {/* --- оппонент --- */}
      <section>
        <PlayerDisplay
          player={opponent}
          isOpponent={true}
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
        />
      </section>

      {/* --- кнопка --- */}
      <div className={`${Button.endTurnWrapper}`}>
        <button
          className={`${Button.buttonRed} ${Button.endTurnButton}`}
          onClick={endTurn}
          disabled={currentTurn !== "player"}
        >
          Завершить ход
        </button>
      </div>

      {/* --- игрок --- */}
      <section>
        
        <PlayerDisplay
          player={player}
          isOpponent={false}
          isShaking={shakingHero === "player"}
        />
        <Field
          isOpponent={false}
          cards={player.field}
          selectedCardId={selectedCardId}
          onCardClick={(cardId) => handleFieldCardClick(cardId, true)}
          shakingCardId={shakingCardId}
        />
        <Hand cards={player.hand} isOpponent={false} onCardClick={playCard} />
      </section>
    </>
  );
}
