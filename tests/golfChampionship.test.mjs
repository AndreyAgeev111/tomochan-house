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
const { golfChampionship, golfChampionship2027, FORMULA_POINTS } = await import(contentUrl);
const {
  buildStandings,
  buildForecasts,
  buildVisibleChartSeries,
  championshipPointsForRank,
  validateChampionship,
} = await import(
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
    status: "active",
    completedStages,
    totalStages: 6,
    bonusActions: [],
  };
}

test("2026 closes after the four agreed scoring rounds, excluding the March event", () => {
  assert.doesNotThrow(() => validateChampionship(golfChampionship));
  assert.equal(golfChampionship.status, "completed");
  assert.equal(golfChampionship.completedStages, 4);
  assert.equal(golfChampionship.totalStages, 4);
  assert.deepEqual(
    golfChampionship.stages.map(({ stage, date }) => [stage, date]),
    [
      [1, "2026-05-12"],
      [2, "2026-07-29"],
      [3, "2026-09-22"],
      [4, "2026-11-17"],
    ]
  );
  assert.equal(
    golfChampionship.stages.find((stage) => stage.stage === 4)?.location,
    "ゴールド佐野カントリークラブ"
  );
  assert.deepEqual(buildForecasts(golfChampionship), []);
});

test("the November final preserves all nine score-sheet rows and awards rank points", () => {
  const expected = [
    [1, 93, 21.6, 71.4, 25],
    [2, 96, 20.4, 75.6, 18],
    [3, 100, 24, 76, 15],
    [4, 86, 9.6, 76.4, 12],
    [5, 103, 26.4, 76.6, 10],
    [6, 115, 38.4, 76.6, 8],
    [7, 119, 39.6, 79.4, 6],
    [8, 112, 32.4, 79.6, 4],
    [9, 127, 44.4, 82.6, 2],
  ];
  const finalResults = golfChampionship.results
    .filter((result) => result.stage === 4)
    .toSorted((a, b) => a.rank - b.rank);
  assert.equal(finalResults.length, 9);
  assert.equal(new Set(finalResults.map((result) => result.playerId)).size, 9);
  assert.deepEqual(
    finalResults.map(({ rank, gross, handicap, net }) => [rank, gross, handicap, net]),
    expected.map(([rank, gross, handicap, net]) => [rank, gross, handicap, net])
  );

  const standings = buildStandings(golfChampionship);
  for (const [index, result] of finalResults.entries()) {
    assert.equal(Math.round((result.gross - result.handicap) * 10) / 10, result.net);
    const points = expected[index][4];
    assert.equal(championshipPointsForRank(result.rank), points);
    const standing = standings.find((standing) => standing.player.id === result.playerId);
    assert.ok(standing);
    assert.equal(standing.stagePoints[3], points);
    assert.deepEqual(standing.stageResults[3], result);
  }
});

test("confirmed returning players determine the final 2026 podium", () => {
  const standings = buildStandings(golfChampionship);
  assert.deepEqual(
    standings.slice(0, 3).map(({ player, totalPoints }) => [player.id, totalPoints]),
    [
      ["player-5e5c2cf6", 80],
      ["player-15542eac", 65],
      ["player-bab3a577", 55],
    ]
  );
  assert.deepEqual(standings[0].stagePoints, [15, 15, 25, 25]);
  assert.deepEqual(standings[1].stagePoints, [25, 25, 15, null]);
  assert.deepEqual(standings[2].stagePoints, [4, 18, 18, 15]);
});

test("new November entrants do not inherit unrelated players' earlier points", () => {
  const standings = buildStandings(golfChampionship);
  for (const [id, name, points] of [
    ["player-6b824d0a", "AY", 18],
    ["player-45b18ef2", "かんちゃ", 12],
    ["player-8c37d1a6", "じんじん", 8],
    ["player-c0e294b7", "あべちゃん", 2],
  ]) {
    const standing = standings.find((standing) => standing.player.id === id);
    assert.ok(standing);
    assert.equal(standing.player.name, name);
    assert.equal(standing.appearances, 1);
    assert.equal(standing.totalPoints, points);
    assert.deepEqual(standing.stagePoints, [null, null, null, points]);
  }
  const originalAY = standings.find((standing) => standing.player.id === "player-68ceac43");
  assert.equal(originalAY.player.name, "AY");
  assert.deepEqual(originalAY.stagePoints, [18, null, null, null]);
});

test("2027 starts empty and cannot inherit results or forecasts from 2026", () => {
  assert.doesNotThrow(() => validateChampionship(golfChampionship2027));
  assert.equal(golfChampionship2027.status, "upcoming");
  assert.equal(golfChampionship2027.completedStages, 0);
  assert.equal(golfChampionship2027.totalStages, 0);
  for (const key of ["players", "stages", "results", "bonusActions", "rewardTiers"]) {
    assert.deepEqual(golfChampionship2027[key], []);
  }
  assert.deepEqual(buildStandings(golfChampionship2027), []);
  assert.deepEqual(buildForecasts(golfChampionship2027), []);
  assert.equal(buildVisibleChartSeries(golfChampionship2027, [], [], [], true).size, 0);
});

test("a closed season retains earned standings and never projects additional rounds", () => {
  const data = fixture([
    [1, "a", 1],
    [1, "b", 2],
    [2, "a", 2],
    [2, "b", 1],
  ]);
  const earned = buildStandings(data);
  data.status = "completed";
  assert.deepEqual(buildForecasts(data), []);
  data.totalStages = data.completedStages;
  assert.doesNotThrow(() => validateChampionship(data));
  const finalStandings = buildStandings(data);
  assert.deepEqual(
    finalStandings.map(({ player, rank, totalPoints }) => [player.id, rank, totalPoints]),
    earned.map(({ player, rank, totalPoints }) => [player.id, rank, totalPoints])
  );
  assert.equal(finalStandings[0].player.id, "b");
});

test("season state validation rejects premature closure and results before opening", () => {
  const data = fixture([
    [1, "a", 1],
    [2, "a", 2],
  ]);
  data.status = "completed";
  assert.throws(() => validateChampionship(data), /completed season/);
  data.totalStages = data.completedStages;
  data.results = data.results.filter((result) => result.stage === 1);
  assert.throws(() => validateChampionship(data), /completed season/);
  data.status = "upcoming";
  assert.throws(() => validateChampionship(data), /upcoming season/);
  const activeWithoutSchedule = { ...structuredClone(golfChampionship2027), status: "active" };
  assert.throws(() => validateChampionship(activeWithoutSchedule), /totalStages/);
});

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

test("closed-season chart histories retain final ranks for every visible subset", () => {
  const standings = buildStandings(golfChampionship);
  const forecasts = buildForecasts(golfChampionship, standings);
  assert.deepEqual(forecasts, []);
  const ids = standings.filter((s) => s.appearances >= 2).map((s) => s.player.id);
  const all = buildVisibleChartSeries(golfChampionship, standings, forecasts, ids, false);
  for (let mask = 0; mask < 2 ** ids.length; mask++) {
    const selected = ids.filter((_, index) => mask & (1 << index));
    const subset = buildVisibleChartSeries(golfChampionship, standings, forecasts, selected, false);
    assert.equal(subset.size, selected.length);
    for (const id of selected) assert.deepEqual(subset.get(id), all.get(id));
  }
  for (const [id, points] of all) {
    const standing = standings.find((s) => s.player.id === id);
    assert.equal(points.length, golfChampionship.completedStages);
    for (const point of points) {
      assert.equal(point.isForecast, false);
      assert.equal(
        point.rank,
        standing.history.find((h) => h.stage === point.stage)?.overallRank ?? null
      );
    }
    assert.equal(points[golfChampionship.completedStages - 1].rank, standing.rank);
    assert.equal(points.at(-1).cumulativePoints, standing.totalPoints);
  }
});
