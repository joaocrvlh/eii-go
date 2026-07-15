import { LogOut, X } from "lucide-react";
import { useParams } from "react-router";
import { useGame } from "./hooks/useGame";
import { Scoreboard } from "./components/scoreboard";
import { PlayerSpot } from "./components/player-spot";
import { DeckPassOverlay } from "./components/deck-pass-overlay";

export function Board() {
  const { roomId } = useParams();
  const gameState = useGame(roomId as string);

  const handleLeaveClick = () => {
    if (window.confirm("Tem certeza que deseja sair da partida?")) {
      gameState.handleLeaveGame();
    }
  };

  return (
    <div className="board-body">
      <button
        className="btn-leave-match"
        onClick={handleLeaveClick}
        aria-label="Sair da partida"
        title="Sair da partida"
      >
        <LogOut />
      </button>

      {gameState.leftPlayerNotice && (
        <div className="player-left-toast">{gameState.leftPlayerNotice}</div>
      )}

      {gameState.cardInfo && (
        <div
          className="card-info-overlay"
          onClick={gameState.closeCardInfo}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="card-info-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="card-info-close"
              onClick={gameState.closeCardInfo}
              aria-label="Fechar"
            >
              <X />
            </button>
            <div className="card-info-emoji">{gameState.cardInfo.emoji}</div>
            <h3 className="card-info-title">{gameState.cardInfo.label}</h3>
            <p className="card-info-desc">{gameState.cardInfo.desc}</p>
          </div>
        </div>
      )}

      {!gameState.isLoaded ? (
        <DeckPassOverlay />
      ) : (
        <>
          <Scoreboard {...gameState} />

          <main className="tabletop">
            {gameState.timeLeft > 0 && (
              <div
                className="center-countdown"
                data-urgent={gameState.timeLeft <= 3 ? "true" : "false"}
              >
                <span>{gameState.timeLeft}</span>
              </div>
            )}

            {gameState.occupiedSeats.map((seat) => (
              <PlayerSpot
                key={seat.player.id}
                id={seat.player.id}
                name={seat.player.nome}
                avatar={seat.player.avatar}
                position={seat.position}
                isMainPlayer={false}
                pickStatus={gameState.pickStatus[seat.player.id] ?? false}
                cardCount={gameState.cardCounts[seat.player.id] ?? 0}
                tableCards={gameState.tableCards[seat.player.id] || []}
              />
            ))}

            <PlayerSpot
              id={gameState.myId}
              name={gameState.myName}
              avatar={gameState.myAvatar}
              position="bottom"
              isMainPlayer={true}
              pickStatus={gameState.pickStatus[gameState.myId] ?? false}
              cardCount={gameState.cardCounts[gameState.myId] ?? 0}
              tableCards={gameState.tableCards[gameState.myId] || []}
              hashiAvailable={gameState.hashiAvailable}
            />
          </main>
        </>
      )}
    </div>
  );
}
