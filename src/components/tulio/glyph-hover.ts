const GLYPHS = ["7", "▲"] as const;
/** Menu pace. Titles use a shorter step so a long heading locks in sooner. */
export const GLYPH_STEP_MS = 64;
export const TITLE_STEP_MS = 28;

export function splitGraphemes(text: string): string[] {
  return [...text];
}

export function glyphFrame(text: string, step: number) {
  return splitGraphemes(text)
    .map((ch, i) => {
      if (ch === " ") return " ";
      if (step > 0 && i < step) return ch;
      return GLYPHS[(step + i) % 2];
    })
    .join("");
}

/** One cell per grapheme: invisible layer holds the real letter’s width; overlay shows 7/▲ or locked letter. */
export function glyphHoverCells(text: string, shown: string) {
  const target = splitGraphemes(text);
  const display = splitGraphemes(shown);
  return target.map((ch, i) => {
    const raw = display[i] ?? ch;
    return {
      reserve: ch === " " ? "\u00a0" : ch,
      display: raw === " " ? "\u00a0" : raw,
    };
  });
}
