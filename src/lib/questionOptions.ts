export interface ScoreGuideOption {
  score: string;
  description: string;
}

/** Parses "1 = foo · 2 = bar · 3 = baz" into [{score, description}] */
export function parseHintBullets(text: string): ScoreGuideOption[] {
  return text
    .split(" · ")
    .map((chunk) => {
      const match = chunk.match(/^(\d+)\s*=\s*(.+)$/);
      if (!match) return null;
      return { score: match[1], description: match[2].trim() };
    })
    .filter(Boolean) as ScoreGuideOption[];
}
