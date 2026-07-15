import { X } from "lucide-react";

interface HowToPlayProps {
  onClose: () => void;
}

type RuleCard = {
  emoji: string;
  label: string;
  score: string;
};

const SCORING: RuleCard[] = [
  {
    emoji: "🍙",
    label: "Maki",
    score: "Quem tiver mais símbolos: 6 pts. Segundo lugar: 3 pts. Em caso de empate, os pontos são divididos (o resto é perdido).",
  },
  {
    emoji: "🍤",
    label: "Tempurá",
    score: "Cada grupo de 2 cartas vale 5 pts. Uma carta sozinha não vale nada.",
  },
  {
    emoji: "🍣",
    label: "Sashimi",
    score: "Cada grupo de 3 cartas vale 10 pts. Grupos incompletos não valem nada.",
  },
  {
    emoji: "🥟",
    label: "Gyoza (Bolinho)",
    score: "Quanto mais, melhor: 1 = 1 · 2 = 3 · 3 = 6 · 4 = 10 · 5+ = 15 pts.",
  },
  {
    emoji: "🦑",
    label: "Nigiri de Lula",
    score: "3 pts (9 pts sobre um Wasabi).",
  },
  {
    emoji: "🐟",
    label: "Nigiri de Salmão",
    score: "2 pts (6 pts sobre um Wasabi).",
  },
  {
    emoji: "🍳",
    label: "Nigiri de Ovo",
    score: "1 pt (3 pts sobre um Wasabi).",
  },
  {
    emoji: "🟢",
    label: "Wasabi",
    score: "Triplica o valor do PRÓXIMO nigiri que você jogar. Sozinho não vale nada.",
  },
  {
    emoji: "🥢",
    label: "Hashi (Palitos)",
    score: "Não vale pontos. Numa rodada seguinte, permite baixar 2 cartas de uma vez — o Hashi volta para a mão e é passado adiante.",
  },
  {
    emoji: "🍮",
    label: "Pudim",
    score: "Contado só no fim do jogo. Quem tiver mais: +6 pts. Quem tiver menos: −6 pts (só com 3+ jogadores). Empate divide.",
  },
];

export function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div
      className="howto-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Como jogar"
    >
      <section
        className="howto-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="howto-header">
          <h2>COMO JOGAR</h2>
          <button
            className="howto-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X />
          </button>
        </header>

        <div className="howto-body">
          <div className="howto-section">
            <h3>🎯 Objetivo</h3>
            <p>
              O jogo dura <strong>3 rodadas</strong>. Colete as cartas de
              sushi mais valiosas e faça o maior número de pontos. Ganha quem
              tiver mais pontos no fim das 3 rodadas.
            </p>
          </div>

          <div className="howto-section">
            <h3>🃏 Preparação</h3>
            <p>Cada jogador recebe uma mão de cartas:</p>
            <ul className="howto-list">
              <li>2 jogadores → 10 cartas</li>
              <li>3 jogadores → 9 cartas</li>
              <li>4 jogadores → 8 cartas</li>
              <li>5 jogadores → 7 cartas</li>
            </ul>
          </div>

          <div className="howto-section">
            <h3>🔄 Uma rodada</h3>
            <ol className="howto-list">
              <li>
                Todos escolhem <strong>1 carta</strong> ao mesmo tempo e a
                baixam na sua frente.
              </li>
              <li>As cartas escolhidas são reveladas simultaneamente.</li>
              <li>
                Cada um passa o restante da mão para o jogador à{" "}
                <strong>esquerda</strong>.
              </li>
              <li>Repita até acabarem as cartas da mão.</li>
            </ol>
            <p className="howto-note">
              💡 Neste app há um timer de <strong>10 segundos</strong> por
              jogada. Se o tempo acabar, uma carta é escolhida
              automaticamente.
            </p>
          </div>

          <div className="howto-section">
            <h3>🥢 Usando o Hashi</h3>
            <p>
              Se você já tem um <strong>Hashi</strong> baixado na mesa, pode
              escolher <strong>2 cartas</strong> numa jogada futura. O Hashi
              volta para a sua mão e segue sendo passado para os outros
              jogadores.
            </p>
          </div>

          <div className="howto-section">
            <h3>🍮 Pontuação</h3>
            <p className="howto-note">
              💡 Durante a partida, clique com o <strong>botão direito</strong>{" "}
              (ou <strong>pressione e segure</strong> no celular) em uma carta
              da sua mão para ver o que ela faz.
            </p>
            <div className="howto-scoring">
              {SCORING.map((card) => (
                <div className="howto-score-row" key={card.label}>
                  <span className="howto-score-emoji">{card.emoji}</span>
                  <div className="howto-score-text">
                    <strong>{card.label}</strong>
                    <span>{card.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="howto-section">
            <h3>🏆 Fim do jogo</h3>
            <p>
              Após as 3 rodadas, some os pontos e os pudins. Quem tiver a
              maior pontuação vence. Em caso de empate, ganha quem tiver mais
              cartas de <strong>Pudim</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
