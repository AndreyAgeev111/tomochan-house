import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Exercise the source with the project's existing TypeScript compiler;
// no separate test runner or generated files are needed.
async function moduleUrl(path, imports = {}) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [specifier, url] of Object.entries(imports)) {
    source = source.replaceAll(`"${specifier}"`, JSON.stringify(url));
  }
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}

const contentUrl = await moduleUrl("../src/content/golfChampionship.ts");
const { golfChampionship, FORMULA_POINTS } = await import(contentUrl);
const { buildStandings, buildForecasts, buildVisibleChartSeries, validateChampionship } =
  await import(
    await moduleUrl("../src/utils/golfChampionshipUtils.ts", {
      "../content/golfChampionship": contentUrl,
    })
  );

function fixture(results, completedStages = 2) {
  return {
    ...structuredClone(golfChampionship),
    players: [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ],
    results: results.map(([stage, playerId, rank]) => ({
      stage,
      playerId,
      rank,
      gross: 90,
      handicap: 18,
      net: 72,
    })),
    completedStages,
    bonusActions: [],
  };
}

test("missing rounds stay distinct from participation worth zero points", () => {
  const standings = buildStandings(
    fixture([
      [1, "a", 11],
      [2, "a", 1],
      [2, "b", 2],
    ])
  );
  assert.deepEqual(standings.find((s) => s.player.id === "a").stagePoints.slice(0, 2), [0, 25]);
  assert.deepEqual(standings.find((s) => s.player.id === "b").stagePoints.slice(0, 2), [null, 18]);
  assert.equal(standings.find((s) => s.player.id === "b").isNew, true);
});

test("chart never backfills future scores before a player's first round", () => {
  const data = fixture(
    [
      [1, "a", 1],
      [2, "a", 2],
      [3, "a", 2],
      [2, "b", 1],
      [3, "b", 1],
    ],
    3
  );
  const standings = buildStandings(data);
  const series = buildVisibleChartSeries(
    data,
    standings,
    buildForecasts(data, standings),
    ["a", "b"],
    false
  );
  assert.equal(series.get("b")[0].cumulativePoints, 0);
  assert.equal(series.get("b")[0].participated, false);
  assert.equal(series.get("b")[2].cumulativePoints, 50);
});

test("historical chart uses the same tie breaker as standings", () => {
  const data = fixture([
    [1, "a", 1],
    [1, "b", 2],
    [2, "a", 2],
    [2, "b", 1],
  ]);
  const standings = buildStandings(data);
  const series = buildVisibleChartSeries(data, standings, [], ["a", "b"], false);
  assert.equal(standings[0].player.id, "b");
  assert.equal(series.get("a")[0].rank, 1);
  assert.equal(series.get("b")[1].rank, 1);
  const onlyA = buildVisibleChartSeries(data, standings, [], ["a"], false);
  assert.equal(onlyA.size, 1);
  assert.deepEqual(onlyA.get("a"), series.get("a"));
});

test("forecasts require two appearances and stay within the scoring range", () => {
  const data = fixture([
    [1, "a", 1],
    [2, "a", 1],
    [2, "b", 2],
  ]);
  const forecasts = buildForecasts(data);
  assert.equal(forecasts.length, 1);
  assert.equal(forecasts[0].playerId, "a");
  assert.equal(forecasts[0].projectedStagePoints.length, 4);
  assert.ok(forecasts[0].projectedStagePoints.every((p) => p >= 0 && p <= FORMULA_POINTS[0]));
});

test("validation rejects data that would corrupt scoring", () => {
  for (const mutate of [
    (d) => {
      d.players.push(d.players[0]);
    },
    (d) => {
      d.results.push(d.results[0]);
    },
    (d) => {
      d.results[0].rank = 1.5;
    },
    (d) => {
      d.completedStages = -1;
    },
    (d) => {
      d.bonusActions.push({ id: "x", playerId: "a", stage: 3, label: "Bonus" });
    },
    (d) => {
      d.bonusActions = Array(2).fill({ id: "x", playerId: "a", stage: 1, label: "Bonus" });
    },
  ]) {
    const data = fixture([
      [1, "a", 1],
      [2, "a", 1],
    ]);
    mutate(data);
    assert.throws(() => validateChampionship(data), /Invalid golf championship data/);
  }
});

test("published player IDs are opaque and cannot expose names", () => {
  assert.ok(golfChampionship.players.every((player) => /^player-[a-f0-9]{8}$/.test(player.id)));
  const ids = new Set(golfChampionship.players.map((player) => player.id));
  assert.equal(ids.size, golfChampionship.players.length);
  assert.ok(golfChampionship.results.every((result) => ids.has(result.playerId)));
});

test("chart ranks include one-round opponents and do not change with visibility", () => {
  const data = fixture([
    [1, "a", 10],
    [2, "a", 10],
    [1, "b", 1],
  ]);
  const standings = buildStandings(data);
  const forecasts = buildForecasts(data, standings);
  const series = buildVisibleChartSeries(data, standings, forecasts, ["a", "b"], true);
  assert.equal(series.has("b"), false);
  assert.equal(series.get("a")[1].rank, 2);
  assert.equal(series.get("a").at(-1).rank, forecasts[0].projectedRank);
  assert.deepEqual(
    buildVisibleChartSeries(data, standings, forecasts, ["a"], true).get("a"),
    series.get("a")
  );
});

test("all real chart histories match standings and every subset preserves ranks and forecasts", () => {
  const standings = buildStandings(golfChampionship);
  const forecasts = buildForecasts(golfChampionship, standings);
  const ids = standings.filter((s) => s.appearances >= 2).map((s) => s.player.id);
  const all = buildVisibleChartSeries(golfChampionship, standings, forecasts, ids, true);
  for (let mask = 0; mask < 2 ** ids.length; mask++) {
    const selected = ids.filter((_, index) => mask & (1 << index));
    const subset = buildVisibleChartSeries(golfChampionship, standings, forecasts, selected, true);
    assert.equal(subset.size, selected.length);
    for (const id of selected) assert.deepEqual(subset.get(id), all.get(id));
  }
  for (const [id, points] of all) {
    const standing = standings.find((s) => s.player.id === id);
    for (const point of points.filter((p) => !p.isForecast)) {
      assert.equal(
        point.rank,
        standing.history.find((h) => h.stage === point.stage)?.overallRank ?? null
      );
    }
    assert.equal(points[golfChampionship.completedStages - 1].rank, standing.rank);
    assert.equal(points.at(-1).rank, forecasts.find((f) => f.playerId === id).projectedRank);
  }
});
