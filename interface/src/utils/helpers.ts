export const parseTones = (tones: string) =>
  tones.split(', ').map((tone) => tone.trim());
