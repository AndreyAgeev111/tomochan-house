import {
  BONUS_POINTS_PER_ACTION,
  type BonusAction,
  type Championship,
  FORMULA_POINTS,
  type Player,
  type StageResult,
} from "../content/golfChampionship";

export type StageStanding = {
  stage: number;
  result: StageResult | null;
  championshipPoints: number | null;
  cumulativePoints: number;
  overallRank: number | null;
};

export type Standing = {
  player: Player;
  rank: number;
  previousRank: number | null;
  movement: number | null;
  isNew: boolean;
  stagePoints: Array<number | null>;
  stageResults: Array<StageResult | null>;
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  pointsBehindLeader: number;
  appearances: number;
  history: StageStanding[];
};

export type Forecast = {
  playerId: string;
  projectedStagePoints: number[];
  projectedPointsByStage: number[];
  projectedFinalPoints: number;
  projectedRank: number;
  projectedRankRange: string;
  currentAverage: number;
  requiredAverageToLead: number;
  bestStage: number;
  gapToLeader: number;
  remainingStages: number;
  status: "優勝争い" | "十分逆転可能" | "逆転には好成績が必要" | "厳しい状況";
  explanation: string;
};

export type ChartPoint = {
  stage: number;
  cumulativePoints: number;
  rank: number | null;
  isForecast: boolean;
  participated: boolean;
};

export const MIN_APPEARANCES_FOR_TREND = 2;

const round1 = (value: number) => Math.round(value * 10) / 10;

export function championshipPointsForRank(rank: number) {
  return FORMULA_POINTS[rank - 1] ?? 0;
}

export function getResult(championship: Championship, playerId: string, stage: number) {
  return (
    championship.results.find((result) => result.playerId === playerId && result.stage === stage) ??
    null
  );
}

export function getBonusActions(
  championship: Championship,
  playerId: string,
  throughStage = championship.completedStages
) {
  return championship.bonusActions.filter(
    (action) => action.playerId === playerId && action.stage <= throughStage
  );
}

export function bonusPointsForActions(actions: BonusAction[]) {
  return actions.length * BONUS_POINTS_PER_ACTION;
}

function getPlayerOrder(championship: Championship) {
  return new Map(championship.players.map((player, index) => [player.id, index]));
}

function tieBreakValue(championship: Championship, playerId: string, throughStage: number) {
  const results = championship.results
    .filter((result) => result.playerId === playerId && result.stage <= throughStage)
    .sort((a, b) => b.stage - a.stage);

  return results[0]?.rank ?? Number.MAX_SAFE_INTEGER;
}

function rankPlayersAtStage(
  championship: Championship,
  playerIds: string[],
  totals: Map<string, number>,
  stage: number
) {
  const order = getPlayerOrder(championship);

  return [...playerIds].sort((a, b) => {
    const totalDifference = (totals.get(b) ?? 0) - (totals.get(a) ?? 0);
    if (totalDifference !== 0) return totalDifference;

    const latestRankDifference =
      tieBreakValue(championship, a, stage) - tieBreakValue(championship, b, stage);
    if (latestRankDifference !== 0) return latestRankDifference;

    return (order.get(a) ?? Number.MAX_SAFE_INTEGER) - (order.get(b) ?? Number.MAX_SAFE_INTEGER);
  });
}

export function buildStandings(championship: Championship): Standing[] {
  const cumulative = new Map<string, number>();
  const histories = new Map<string, StageStanding[]>();
  const appeared = new Set<string>();

  championship.players.forEach((player) => {
    cumulative.set(player.id, 0);
    histories.set(player.id, []);
  });

  for (let stage = 1; stage <= championship.completedStages; stage += 1) {
    championship.players.forEach((player) => {
      const result = getResult(championship, player.id, stage);
      if (result) appeared.add(player.id);

      const stagePoints = result ? championshipPointsForRank(result.rank) : 0;
      const stageBonus = bonusPointsForActions(
        championship.bonusActions.filter(
          (action) => action.playerId === player.id && action.stage === stage
        )
      );

      cumulative.set(player.id, (cumulative.get(player.id) ?? 0) + stagePoints + stageBonus);
    });

    const ranked = rankPlayersAtStage(championship, [...appeared], cumulative, stage);
    const rankByPlayer = new Map(ranked.map((playerId, index) => [playerId, index + 1]));

    championship.players.forEach((player) => {
      if (!appeared.has(player.id)) return;

      const result = getResult(championship, player.id, stage);
      histories.get(player.id)?.push({
        stage,
        result,
        championshipPoints: result ? championshipPointsForRank(result.rank) : null,
        cumulativePoints: cumulative.get(player.id) ?? 0,
        overallRank: rankByPlayer.get(player.id) ?? null,
      });
    });
  }

  const activePlayers = championship.players.filter((player) => appeared.has(player.id));
  const finalOrder = rankPlayersAtStage(
    championship,
    activePlayers.map((player) => player.id),
    cumulative,
    championship.completedStages
  );
  const leaderPoints = cumulative.get(finalOrder[0] ?? "") ?? 0;

  return finalOrder.flatMap((playerId, index) => {
    const player = championship.players.find((candidate) => candidate.id === playerId);
    if (!player) return [];

    const history = histories.get(player.id) ?? [];
    const currentRank = index + 1;
    const previousSnapshot =
      history.find((snapshot) => snapshot.stage === championship.completedStages - 1) ?? null;
    const previousRank = previousSnapshot?.overallRank ?? null;
    const stageResults = Array.from({ length: championship.totalStages }, (_, stageIndex) =>
      stageIndex < championship.completedStages
        ? getResult(championship, player.id, stageIndex + 1)
        : null
    );
    const stagePoints = stageResults.map((result) =>
      result ? championshipPointsForRank(result.rank) : null
    );
    const basePoints = stagePoints.reduce<number>((sum, points) => sum + (points ?? 0), 0);
    const bonusPoints = bonusPointsForActions(getBonusActions(championship, player.id));
    const totalPoints = basePoints + bonusPoints;
    const appearances = stageResults.filter(Boolean).length;

    return [
      {
        player,
        rank: currentRank,
        previousRank,
        movement: previousRank === null ? null : previousRank - currentRank,
        isNew: previousRank === null,
        stagePoints,
        stageResults,
        basePoints,
        bonusPoints,
        totalPoints,
        pointsBehindLeader: leaderPoints - totalPoints,
        appearances,
        history,
      },
    ];
  });
}

function linearSlope(values: number[]) {
  if (values.length < 2) return 0;
  const n = values.length;
  const meanX = (n + 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / n;
  const numerator = values.reduce(
    (sum, value, index) => sum + (index + 1 - meanX) * (value - meanY),
    0
  );
  const denominator = values.reduce((sum, _value, index) => sum + (index + 1 - meanX) ** 2, 0);

  return denominator === 0 ? 0 : numerator / denominator;
}

function weightedAverage(values: number[]) {
  if (values.length === 0) return 0;
  const weights = values.map((_, index) => index + 1);
  const denominator = weights.reduce((sum, value) => sum + value, 0);

  return values.reduce((sum, value, index) => sum + value * weights[index], 0) / denominator;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length);
}

function projectedStagePoints(attendedStagePoints: number[], remainingStages: number) {
  if (attendedStagePoints.length < MIN_APPEARANCES_FOR_TREND || remainingStages <= 0) {
    return [];
  }

  const average = weightedAverage(attendedStagePoints);
  const rawTrend = linearSlope(attendedStagePoints);
  const initialAdjustment = Math.max(-2, Math.min(2, rawTrend * 0.2));

  return Array.from({ length: remainingStages }, (_, index) => {
    const dampedAdjustment = initialAdjustment * Math.pow(0.6, index);
    return round1(Math.max(0, Math.min(FORMULA_POINTS[0], average + dampedAdjustment)));
  });
}

export function buildForecasts(
  championship: Championship,
  standings = buildStandings(championship)
): Forecast[] {
  const remainingStages = Math.max(0, championship.totalStages - championship.completedStages);

  const eligible = standings.filter(
    (standing) => standing.appearances >= MIN_APPEARANCES_FOR_TREND
  );

  const projections = eligible.map((standing) => {
    const attended = standing.stagePoints.filter((points): points is number => points !== null);
    const future = projectedStagePoints(attended, remainingStages);
    const cumulative: number[] = [];
    let total = standing.totalPoints;

    future.forEach((points) => {
      total += points;
      cumulative.push(round1(total));
    });

    const uncertainty =
      Math.max(1, Math.min(4, standardDeviation(attended) * 0.5)) *
      Math.sqrt(Math.max(1, remainingStages));

    return {
      standing,
      future,
      cumulative,
      final: cumulative.at(-1) ?? standing.totalPoints,
      optimistic: total + uncertainty,
      pessimistic: Math.max(standing.totalPoints, total - uncertainty),
    };
  });

  const projectedFinalByPlayer = new Map(
    standings.map((standing) => [standing.player.id, standing.totalPoints])
  );
  projections.forEach((projection) => {
    projectedFinalByPlayer.set(projection.standing.player.id, projection.final);
  });

  const projectedOrder = [...standings].sort(
    (a, b) =>
      (projectedFinalByPlayer.get(b.player.id) ?? 0) -
        (projectedFinalByPlayer.get(a.player.id) ?? 0) || a.rank - b.rank
  );

  return projections.map((projection) => {
    const { standing, future, cumulative, final } = projection;
    const attended = standing.stagePoints.filter((points): points is number => points !== null);
    const currentAverage = attended.reduce((sum, value) => sum + value, 0) / attended.length;
    const projectedRank =
      projectedOrder.findIndex((item) => item.player.id === standing.player.id) + 1;

    const strongestOpponent = projectedOrder.find((item) => item.player.id !== standing.player.id);
    const strongestOpponentFinal = strongestOpponent
      ? (projectedFinalByPlayer.get(strongestOpponent.player.id) ?? 0)
      : 0;
    const requiredAverageToLead =
      remainingStages > 0
        ? Math.max(0, (strongestOpponentFinal - standing.totalPoints + 0.1) / remainingStages)
        : 0;

    const rankForScore = (score: number) =>
      1 +
      standings.filter((other) => {
        if (other.player.id === standing.player.id) return false;
        return (projectedFinalByPlayer.get(other.player.id) ?? other.totalPoints) > score;
      }).length;

    const bestRank = rankForScore(projection.optimistic);
    const worstRank = rankForScore(projection.pessimistic);
    const low = Math.min(bestRank, worstRank);
    const high = Math.max(bestRank, worstRank);
    const projectedRankRange = low === high ? `${low}位` : `${low}–${high}位`;

    const paceDelta = requiredAverageToLead - currentAverage;
    let status: Forecast["status"];
    if (projectedRank <= 2 && paceDelta <= 2) status = "優勝争い";
    else if (paceDelta <= 4) status = "十分逆転可能";
    else if (paceDelta <= 7) status = "逆転には好成績が必要";
    else status = "厳しい状況";

    return {
      playerId: standing.player.id,
      projectedStagePoints: future,
      projectedPointsByStage: cumulative,
      projectedFinalPoints: round1(final),
      projectedRank,
      projectedRankRange,
      currentAverage: round1(currentAverage),
      requiredAverageToLead: round1(requiredAverageToLead),
      bestStage: Math.max(...attended),
      gapToLeader: standing.pointsBehindLeader,
      remainingStages,
      status,
      explanation:
        projectedRank === 1
          ? `現在の実績ペースでは最終${projectedRankRange}が目安です。追加ポイントは将来予測に含めず、各戦のフォーミュラポイントだけを保守的に外挿しています。`
          : `現在の実績ペースでは最終${projectedRankRange}が目安です。首位争いには残り${remainingStages}戦で平均${round1(requiredAverageToLead)}pt前後が目安になります。`,
    };
  });
}

export function trendEligibleStandings(standings: Standing[]) {
  return standings.filter((standing) => standing.appearances >= MIN_APPEARANCES_FOR_TREND);
}

export function buildVisibleChartSeries(
  championship: Championship,
  standings: Standing[],
  forecasts: Forecast[],
  visiblePlayerIds: string[],
  includeForecast: boolean
) {
  const eligible = trendEligibleStandings(standings).filter((standing) =>
    visiblePlayerIds.includes(standing.player.id)
  );

  const result = new Map<string, ChartPoint[]>();
  eligible.forEach((standing) => result.set(standing.player.id, []));

  const forecastByPlayer = new Map(forecasts.map((forecast) => [forecast.playerId, forecast]));
  const lastStage = includeForecast ? championship.totalStages : championship.completedStages;

  for (let stage = 1; stage <= lastStage; stage += 1) {
    const isForecast = stage > championship.completedStages;
    // Rank the entire field first. Visibility and trend eligibility only select lines.
    // Players without a forecast retain their earned points, as in buildForecasts.
    const stageValues = standings.map((standing) => {
      const snapshot = standing.history.find((item) => item.stage === stage);
      const forecast = forecastByPlayer.get(standing.player.id);
      return {
        standing,
        points: isForecast
          ? (forecast?.projectedPointsByStage[stage - championship.completedStages - 1] ??
            standing.totalPoints)
          : (snapshot?.cumulativePoints ?? 0),
        rank: snapshot?.overallRank ?? null,
      };
    });
    const projectedOrder = isForecast
      ? [...stageValues].sort((a, b) => b.points - a.points || a.standing.rank - b.standing.rank)
      : [];
    const projectedRanks = new Map(
      projectedOrder.map((entry, index) => [entry.standing.player.id, index + 1])
    );

    for (const { standing, points, rank } of stageValues) {
      result.get(standing.player.id)?.push({
        stage,
        cumulativePoints: points,
        rank: isForecast ? (projectedRanks.get(standing.player.id) ?? null) : rank,
        isForecast,
        participated: isForecast || Boolean(getResult(championship, standing.player.id, stage)),
      });
    }
  }

  return result;
}

export function validateChampionship(championship: Championship) {
  const errors: string[] = [];
  const playerIds = new Set(championship.players.map((player) => player.id));
  const resultKeys = new Set<string>();

  if (!Number.isInteger(championship.totalStages) || championship.totalStages < 1) {
    errors.push("totalStages must be a positive integer.");
  }
  if (!Number.isInteger(championship.completedStages) || championship.completedStages < 0) {
    errors.push("completedStages must be a non-negative integer.");
  }
  if (playerIds.size !== championship.players.length) {
    errors.push("Player IDs must be unique.");
  }
  if (championship.completedStages > championship.totalStages) {
    errors.push("completedStages cannot exceed totalStages.");
  }

  championship.results.forEach((result) => {
    if (!playerIds.has(result.playerId)) {
      errors.push(`Unknown player: ${result.playerId}`);
    }
    if (
      !Number.isInteger(result.stage) ||
      result.stage < 1 ||
      result.stage > championship.completedStages
    ) {
      errors.push(`Invalid stage ${result.stage} for ${result.playerId}`);
    }
    if (!Number.isInteger(result.rank) || result.rank < 1) {
      errors.push(`Invalid rank for ${result.playerId}`);
    }

    const key = `${result.stage}:${result.playerId}`;
    if (resultKeys.has(key)) {
      errors.push(`Duplicate result ${key}`);
    }
    resultKeys.add(key);
  });

  const bonusIds = new Set<string>();
  championship.bonusActions.forEach((action) => {
    if (bonusIds.has(action.id)) errors.push(`Duplicate bonus action: ${action.id}`);
    bonusIds.add(action.id);
    if (
      !Number.isInteger(action.stage) ||
      action.stage < 1 ||
      action.stage > championship.completedStages
    ) {
      errors.push(`Invalid bonus stage: ${action.stage}`);
    }
    if (!playerIds.has(action.playerId)) {
      errors.push(`Unknown bonus player: ${action.playerId}`);
    }
  });

  const rewardThresholds = championship.rewardTiers.map((reward) => reward.threshold);
  if (rewardThresholds.some((threshold) => !Number.isFinite(threshold) || threshold <= 0)) {
    errors.push("Reward thresholds must be positive numbers.");
  }
  if (new Set(rewardThresholds).size !== rewardThresholds.length) {
    errors.push("Reward thresholds must be unique.");
  }
  if (
    rewardThresholds.some(
      (threshold, index) => index > 0 && threshold <= rewardThresholds[index - 1]
    )
  ) {
    errors.push("Reward thresholds must be strictly increasing.");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid golf championship data:\n${errors.join("\n")}`);
  }
}
