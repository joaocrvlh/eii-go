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
