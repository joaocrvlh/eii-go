export type SoundName = "countdown" | "deck-shuffle" | "select-card";

const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export function playSound(name: SoundName) {
  if (typeof window === "undefined") return;

  let base = audioCache[name];
  if (!base) {
    base = new Audio(`/sounds/${name}.wav`);
    audioCache[name] = base;
  }

  const instance = base.cloneNode(true) as HTMLAudioElement;
  instance.play().catch(() => {});
}

let bgMusic: HTMLAudioElement | null = null;

// Música de fundo em loop durante a partida. Se o autoplay for bloqueado
// pelo navegador, tenta retomar na primeira interação do usuário.
export function startBgMusic(volume = 0.25) {
  if (typeof window === "undefined") return;
  if (!bgMusic) {
    bgMusic = new Audio("/sounds/tradicional-japanese.mp3");
    bgMusic.loop = true;
    bgMusic.volume = volume;
  }
  bgMusic.play().catch(() => {
    const resume = () => {
      bgMusic?.play().catch(() => {});
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
  });
}

export function stopBgMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}
