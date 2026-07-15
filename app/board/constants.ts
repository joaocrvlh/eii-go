export const CARD_DICT: Record<
  string,
  { emoji: string; label: string; color: string; desc: string }
> = {
  tempura: {
    emoji: "🍤",
    label: "Tempurá",
    color: "#ffcf54",
    desc: "Cada par (2 cartas) vale 5 pts. Sozinha não pontua.",
  },
  sashimi: {
    emoji: "🍣",
    label: "Sashimi",
    color: "#ff8c7a",
    desc: "Cada trio (3 cartas) vale 10 pts. Grupos incompletos não pontuam.",
  },
  dumpling: {
    emoji: "🥟",
    label: "Bolinho",
    color: "#f5d0b5",
    desc: "1=1 · 2=3 · 3=6 · 4=10 · 5+=15 pts.",
  },
  maki_1: {
    emoji: "🍙",
    label: "Maki (1)",
    color: "#e84135",
    desc: "1 símbolo de maki. Quem tiver mais: 6 pts; 2º: 3 pts.",
  },
  maki_2: {
    emoji: "🍙🍙",
    label: "Maki (2)",
    color: "#e84135",
    desc: "2 símbolos de maki. Quem tiver mais: 6 pts; 2º: 3 pts.",
  },
  maki_3: {
    emoji: "🍙🍙🍙",
    label: "Maki (3)",
    color: "#e84135",
    desc: "3 símbolos de maki. Quem tiver mais: 6 pts; 2º: 3 pts.",
  },
  salmon_nigiri: {
    emoji: "🐟",
    label: "Salmão",
    color: "#ffb443",
    desc: "Nigiri de salmão: 2 pts (6 pts sobre um Wasabi).",
  },
  squid_nigiri: {
    emoji: "🦑",
    label: "Lula",
    color: "#ffb443",
    desc: "Nigiri de lula: 3 pts (9 pts sobre um Wasabi).",
  },
  egg_nigiri: {
    emoji: "🍳",
    label: "Ovo",
    color: "#ffb443",
    desc: "Nigiri de ovo: 1 pt (3 pts sobre um Wasabi).",
  },
  pudding: {
    emoji: "🍮",
    label: "Pudim",
    color: "#ff9fb2",
    desc: "No fim do jogo: mais pudins +6, menos −6 (3+ jogadores).",
  },
  wasabi: {
    emoji: "🟢",
    label: "Wasabi",
    color: "#6bcb77",
    desc: "Triplica o valor do PRÓXIMO nigiri que você jogar.",
  },
  chopsticks: {
    emoji: "🥢",
    label: "Hashi",
    color: "#82ccdd",
    desc: "Numa rodada futura, baixe 2 cartas de uma vez. Ele volta para a mão.",
  },
};
