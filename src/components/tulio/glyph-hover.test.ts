import assert from "node:assert/strict";
import { test } from "node:test";
import { glyphFrame, glyphHoverCells, splitGraphemes } from "./glyph-hover.ts";

test("glyphFrame keeps grapheme count for spaces and glyphs", () => {
  const text = "Hi Gal";
  for (let step = 0; step <= splitGraphemes(text).length; step += 1) {
    assert.equal(splitGraphemes(glyphFrame(text, step)).length, splitGraphemes(text).length);
  }
});

test("glyphHoverCells reserves original letter width per cell", () => {
  const text = "Galeria";
  const shown = glyphFrame(text, 0);
  const cells = glyphHoverCells(text, shown);
  assert.equal(cells.length, text.length);
  assert.deepEqual(
    cells.map((c) => c.reserve),
    [...text],
  );
  assert.deepEqual(
    cells.map((c) => c.display),
    [...shown],
  );
});

test("glyphHoverCells uses nbsp for spaces so line box does not collapse", () => {
  const cells = glyphHoverCells("A B", "7 ▲");
  assert.equal(cells[1].reserve, "\u00a0");
  assert.equal(cells[1].display, "\u00a0");
});
