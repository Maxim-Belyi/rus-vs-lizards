import { useGameStore } from "../store/game.store";
import { maxCardsOnHand, rotateMultiplier } from "../constants/constants";
import Card from "@components/cards/card.module.scss";
import PlayerInterface from "@components/ui/players/PlayerInterface.module.scss";
import Field from '@components/ui/field/Field.module.scss'

export function GameBoard() {
  const { player, opponent, playCard } = useGameStore();
  console.log("Player Render", player);

  const calculateRotationOpponent = (index: number, total: number) => {
    const middle = (total - 1) / 2;
    return -(index - middle) * rotateMultiplier;
  };

  const calculateRotationPlayer = (index: number, total: number) => {
    const middle = (total - 1) / 2;
    return (index - middle) * rotateMultiplier;
  };

  return (
    
    <div>
      <section>
        <div className={`${PlayerInterface.playerLizard}`}>
          <p className={`${PlayerInterface.nameLizard}`}>Молотопуз</p>
          <p
            className={`${PlayerInterface.health} ${PlayerInterface.healthLizard}`}
          >
            {opponent.health}
          </p>
          <p
            className={`${PlayerInterface.mana} ${PlayerInterface.manaLizard}`}
          >
            {opponent.mana}
          </p>
        </div>

        <div className={`${Card.wrapper} ${Card.wrapperLizard}`}>
          {opponent.deck
            .filter((card) => !card.isOnBoard)
            .slice(0, maxCardsOnHand)
            .map((card, index, array) => (
              <button className={`${Card.card}`} key={card.id}>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  style={{
                    transform: `rotate(${calculateRotationOpponent(
                      index,
                      array.length
                    )}deg)`,
                  }}
                />
              </button>
            ))}
        </div>
        <div className={`${Field.fieldContainer}`}>
          {opponent.field.map((card) => (
            <div className={`${Card.cardOnBoard}`} key={card.id}>
              <img src={card.imageUrl} alt={card.name} />
            </div>
          ))}
        </div>
      </section>

      <hr />

      <section>
        <div className={`${PlayerInterface.playerRus}`}>
          <p className={`${PlayerInterface.nameRus}`}>Парослав</p>
          <p
            className={`${PlayerInterface.health} ${PlayerInterface.healthRus}`}
          >
            {player.health}
          </p>
          <p className={`${PlayerInterface.mana} ${PlayerInterface.manaRus}`}>
            {player.mana}
          </p>
        </div>

        <div className={`${Card.wrapper} ${Card.wrapperRus}`}>
          {player.hand.map((card, index, array) => (
            <button
              className={`${Card.card} ${Card.cardRusy}`}
              key={card.id}
              onClick={() => playCard(card.id)}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                style={{
                  transform: `rotate(${calculateRotationPlayer(
                    index,
                    array.length
                  )}deg)`,
                }}
              />
            </button>
          ))}
        </div>

        <div className={`${Field.fieldContainer}`}>
          {player.field.map((card) => (
            <button className={`${Card.cardOnBoard} ${Card.card}`} key={card.id}>
              <img 
              src={card.imageUrl} alt={card.name} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
