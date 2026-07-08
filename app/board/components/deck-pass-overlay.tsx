export function DeckPassOverlay() {
  return (
    <div className="deck-pass-overlay">
      <div className="deck-pass-orbit">
        <div className="deck-pass-slot slot-1">
          <div className="deck-pass-card" />
        </div>
        <div className="deck-pass-slot slot-2">
          <div className="deck-pass-card" />
        </div>
        <div className="deck-pass-slot slot-3">
          <div className="deck-pass-card" />
        </div>
        <div className="deck-pass-slot slot-4">
          <div className="deck-pass-card" />
        </div>
      </div>
      <p className="deck-pass-text">Passando as cartas...</p>
    </div>
  );
}
