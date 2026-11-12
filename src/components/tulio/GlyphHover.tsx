import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import {
  GLYPH_STEP_MS,
  glyphFrame,
  glyphHoverCells,
  splitGraphemes,
  TITLE_STEP_MS,
} from "@/components/tulio/glyph-hover";

export { GLYPH_STEP_MS, glyphFrame, TITLE_STEP_MS } from "@/components/tulio/glyph-hover";

export function useGlyphHover(text: string, stepMs = GLYPH_STEP_MS) {
  const [shown, setShown] = useState(text);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setShown(text);
  }, [text]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const play = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    const length = splitGraphemes(text).length;
    setShown(glyphFrame(text, 0));
    let step = 0;
    const tick = () => {
      step += 1;
      setShown(glyphFrame(text, step));
      if (step < length) timers.current.push(window.setTimeout(tick, stepMs));
    };
    timers.current.push(window.setTimeout(tick, stepMs));
  };

  return { shown, play };
}

/** Hover swaps each letter between 7 and ▲, then locks the real title in. */
export function GlyphHover({
  text,
  className,
  stepMs = GLYPH_STEP_MS,
}: {
  text: string;
  className?: string;
  stepMs?: number;
}) {
  const { shown, play } = useGlyphHover(text, stepMs);
  const cells = glyphHoverCells(text, shown);

  return (
    <span
      className={cn("inline", className)}
      onPointerEnter={(event) => event.pointerType === "mouse" && play()}
    >
      {cells.map((cell, i) => (
        <span key={i} className="relative inline-grid align-baseline">
          <span className="invisible col-start-1 row-start-1 whitespace-pre" aria-hidden="true">
            {cell.reserve}
          </span>
          <span className="col-start-1 row-start-1 justify-self-center whitespace-pre">{cell.display}</span>
        </span>
      ))}
    </span>
  );
}
