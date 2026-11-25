import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
const source = await readFile(new URL("../src/utils/winterJourney.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { winterConnectorX, winterTrailX, clearingBesideTrail } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("the trail crosses whole sections and stays continuous when changing direction", () => {
  const trail = [
    { top: 0, bottom: 1000, fromX: 32, toX: 1248 },
    { top: 1000, bottom: 2200, fromX: 1248, toX: 32 },
  ];
  assert.ok(Math.abs(winterTrailX(trail, 500) - 640) < 0.001);
  assert.ok(Math.abs(winterTrailX(trail, 1600) - 640) < 0.001);
  assert.ok(Math.abs(winterTrailX(trail, 1000) - 1248) < 0.001);
  assert.ok(Math.abs(winterTrailX(trail, 999.99) - winterTrailX(trail, 1000.01)) < 0.001);
  assert.ok(Math.abs(winterTrailX(trail, -20) - 32) < 0.001);
  assert.ok(Math.abs(winterTrailX(trail, 2300) - 32) < 0.001);
});

test("each diagonal moves smoothly between opposite edges across a full section", () => {
  for (const width of [320, 390, 768, 1280]) {
    for (const reversed of [false, true]) {
      const a = width * 0.04,
        b = width * 0.96;
      const c = { top: 100, bottom: 260, fromX: reversed ? b : a, toX: reversed ? a : b };
      assert.ok(Math.abs(winterConnectorX(c, c.top) - c.fromX) < 0.001);
      assert.ok(Math.abs(winterConnectorX(c, c.bottom) - c.toX) < 0.001);
      assert.ok(Math.abs(winterConnectorX(c, 180) - width * 0.5) < 0.001);
      for (let y = 100; y <= 260; y++) {
        const x = winterConnectorX(c, y);
        assert.ok(x >= a - 0.001 && x <= b + 0.001);
      }
    }
  }
});

test("tree clearings fit beside both halves of each bend without touching its snow", () => {
  for (const width of [320, 360, 390, 412, 768, 1280, 1920]) {
    for (const reversed of [false, true]) {
      const gap = width < 640 ? 147 : 176;
      const height = width < 640 ? 68 : 100;
      const groveWidth = width < 640 ? 130 : 165;
      const fromX = reversed ? width - 16 : 16,
        toX = reversed ? 16 : width - 16;
      const trail = [
        { top: -800, bottom: gap / 2, fromX, toX },
        { top: gap / 2, bottom: gap + 1600, fromX: toX, toX: fromX },
      ];
      const top = gap - height - 7;
      const { x, scale } = clearingBesideTrail(width, trail, top, height, groveWidth);
      const left = x - (groveWidth * scale) / 2,
        right = x + (groveWidth * scale) / 2;
      assert.ok(scale > 0 && scale <= 1);
      assert.ok(left >= 11.99 && right <= width - 11.99);
      for (let y = top; y <= top + height; y++) {
        const road = winterTrailX(trail, y);
        assert.ok(road < left - 35 || road > right + 35);
      }
    }
  }
});
