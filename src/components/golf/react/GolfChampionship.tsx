import JapaneseText from "./JapaneseText";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Flag, Focus, Gift, TrendingDown, TrendingUp, Trophy, X } from "lucide-react";
import { BONUS_POINTS_PER_ACTION, type Championship } from "../../../content/golfChampionship";
import {
  buildForecasts,
  buildStandings,
  buildVisibleChartSeries,
  championshipPointsForRank,
  type Forecast,
  getBonusActions,
  MIN_APPEARANCES_FOR_TREND,
  type Standing,
  trendEligibleStandings,
} from "../../../utils/golfChampionshipUtils.ts";

type Mode = "rank" | "points";
type Hovered = {
  playerId: string;
  stage: number;
} | null;

const COLORS = [
  "#8a6a24",
  "#3f7b59",
  "#a65f45",
  "#6f5d9b",
  "#36758a",
  "#a17455",
  "#687544",
  "#8b566e",
];

const MEDALS = ["🥇", "🥈", "🥉"];

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function roundForDisplay(value: number) {
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
}

function Movement({ value, isNew }: { value: number | null; isNew?: boolean }) {
  if (isNew || value === null) {
    return <span className="font-bold text-green-800 text-xs">NEW</span>;
  }

  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 font-bold text-green-800">
        <TrendingUp size={15} aria-hidden="true" />
        <span aria-label={`${value}順位アップ`}>↑{value}</span>
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 font-bold text-rose-800">
        <TrendingDown size={15} aria-hidden="true" />
        <span aria-label={`${Math.abs(value)}順位ダウン`}>↓{Math.abs(value)}</span>
      </span>
    );
  }

  return (
    <span className="text-warm-500 font-bold" aria-label="順位変動なし">
      —
    </span>
  );
}

function Podium({
  standings,
  onOpenPlayer,
}: {
  standings: Standing[];
  onOpenPlayer: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const topThree = standings.slice(0, 3);

  const orderClass = (rank: number) => {
    if (rank === 1) return "order-1 sm:order-2";
    if (rank === 2) return "order-2 sm:order-1";
    return "order-3 sm:order-3";
  };

  return (
    <section aria-labelledby="podium-title" className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <div className="text-center mb-8">
        <p className="text-sm font-bold text-green-800 tracking-wider">TOP PLAYERS</p>
        <h2
          id="podium-title"
          className="scroll-mt-24 text-2xl md:text-3xl font-bold text-warm-900 mt-1"
        >
          現在のトップ3
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:items-end max-w-4xl mx-auto">
        {topThree.map((standing, index) => {
          const first = standing.rank === 1;

          return (
            <motion.button
              key={standing.player.id}
              type="button"
              onClick={() => onOpenPlayer(standing.player.id)}
              aria-haspopup="dialog"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: reduced ? 0 : index * 0.08,
                duration: 0.35,
              }}
              className={`relative w-full rounded-xl border text-left p-5 shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark ${orderClass(
                standing.rank
              )} ${
                first
                  ? "sm:min-h-[240px] bg-accent-light border-accent-dark sm:-translate-y-3"
                  : "bg-white border-warm-200"
              } hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-label={`${standing.rank}位`}>
                  {MEDALS[standing.rank - 1]}
                </span>
                <Movement value={standing.movement} isNew={standing.isNew} />
              </div>

              <div className="mt-5 min-w-0 border-l-4 border-accent-dark pl-3">
                <p className="text-xs text-warm-600">総合 {standing.rank}位</p>
                <p className="mt-1 font-bold text-3xl tracking-tight text-warm-900 truncate">
                  {standing.player.name}
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <p className="text-3xl font-bold text-warm-900 tabular-nums">
                  {standing.totalPoints}
                  <span className="text-sm ml-1 text-warm-600">pt</span>
                </p>

                {standing.bonusPoints > 0 && (
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold text-green-900">
                    +{standing.bonusPoints} bonus
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function PlayerProfileModal({
  championship,
  standing,
  onClose,
  onShowInChart,
}: {
  championship: Championship;
  standing: Standing | null;
  onClose: () => void;
  onShowInChart: (id: string) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const hasCelebrated = useRef(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (standing?.rank !== 1 || reducedMotion) {
      setShowSparkles(false);
      return;
    }
    if (hasCelebrated.current || reducedMotion === null) return;

    hasCelebrated.current = true;
    setShowSparkles(!reducedMotion);
  }, [standing?.player.id, standing?.rank, reducedMotion]);

  useEffect(() => {
    if (!standing) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;

      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex="0"]'
      );
      const first = controls?.[0];
      const last = controls?.[controls.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [standing, onClose]);

  if (!standing) return null;

  const bonuses = getBonusActions(championship, standing.player.id);
  const canTrend = standing.appearances >= MIN_APPEARANCES_FOR_TREND;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/45 p-0 sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-profile-title"
        className="w-full sm:max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-warm-50 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-warm-200 bg-warm-50/95 backdrop-blur px-5 py-4">
          {standing.rank === 1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-light/70 to-transparent" />
              {showSparkles &&
                !reducedMotion &&
                [
                  [4, 18],
                  [14, 58],
                  [24, 12],
                  [34, 68],
                  [44, 20],
                  [54, 57],
                  [64, 10],
                  [74, 66],
                  [84, 22],
                  [94, 54],
                  [9, 75],
                  [19, 30],
                  [29, 80],
                  [39, 38],
                  [49, 76],
                  [59, 28],
                  [69, 78],
                  [79, 35],
                  [89, 80],
                  [96, 16],
                ].map(([left, top], index) => (
                  <motion.svg
                    key={index}
                    viewBox="0 0 16 16"
                    className={`absolute ${index % 3 === 0 ? "h-7 w-7 text-amber-500" : "h-5 w-5 text-accent-dark"}`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    initial={{ opacity: 0, scale: 0.2, y: 18, rotate: -30 }}
                    animate={{
                      opacity: [0, 1, 0.85, 0],
                      scale: [0.2, 1.3, 0.9, 0.3],
                      y: [18, -6, -14, -28],
                      rotate: [-30, 15, 50, 90],
                    }}
                    transition={{ duration: 1.7, delay: index * 0.03, ease: "easeOut" }}
                    onAnimationComplete={index === 19 ? () => setShowSparkles(false) : undefined}
                  >
                    <path d="M8 0 10 6 16 8 10 10 8 16 6 10 0 8 6 6Z" fill="currentColor" />
                  </motion.svg>
                ))}
            </div>
          )}
          <div className="relative min-w-0 border-l-4 border-accent-dark pl-3">
            <p className="text-xs text-green-800 font-bold tracking-wider">PLAYER PROFILE</p>
            <h3
              id="player-profile-title"
              className="mt-1 font-bold text-3xl tracking-tight text-warm-900 truncate"
            >
              {standing.rank === 1 && (
                <Trophy
                  size={23}
                  aria-hidden="true"
                  className="mr-2 inline-block align-baseline text-accent-dark"
                />
              )}
              {standing.player.name}
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="選手プロフィールを閉じる"
            className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-warm-700 hover:bg-warm-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl bg-white border border-warm-200 p-3 text-center">
              <p className="text-xs text-warm-600">現在順位</p>
              <p className="mt-1 text-xl font-bold text-warm-900">{standing.rank}位</p>
            </div>
            <div className="rounded-xl bg-white border border-warm-200 p-3 text-center">
              <p className="text-xs text-warm-600">追加pt</p>
              <p className="mt-1 text-xl font-bold text-green-800">+{standing.bonusPoints}</p>
            </div>
            <div className="rounded-xl bg-accent-light border border-accent-DEFAULT p-3 text-center">
              <p className="text-xs text-warm-700">合計</p>
              <p className="mt-1 text-xl font-bold text-warm-900">{standing.totalPoints}pt</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-bold text-warm-900 flex items-center gap-2">
              <Award size={18} aria-hidden="true" />
              各戦の成績
            </h4>

            <div className="mt-3 grid gap-3">
              {Array.from(
                {
                  length: championship.totalStages,
                },
                (_, index) => {
                  const stage = index + 1;
                  const result = standing.stageResults[index];
                  const stageMeta = championship.stages.find((item) => item.stage === stage);
                  const future = stage > championship.completedStages;

                  return (
                    <div key={stage} className="rounded-xl bg-white border border-warm-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-warm-900">第{stage}戦</p>
                          {stageMeta && (
                            <p className="text-xs text-warm-500 mt-0.5">
                              {formatDate(stageMeta.date)}
                              {stageMeta.location ? ` · ${stageMeta.location}` : ""}
                            </p>
                          )}
                        </div>

                        {result ? (
                          <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-warm-900">
                            {result.rank}位 · {championshipPointsForRank(result.rank)}
                            pt
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-warm-400">
                            {future ? "未開催" : "不参加"}
                          </span>
                        )}
                      </div>

                      {result && (
                        <dl className="mt-3 grid grid-cols-3 gap-2 text-center tabular-nums">
                          <div className="rounded-lg bg-warm-50 p-2">
                            <dt className="text-[11px] text-warm-500">GROSS</dt>
                            <dd className="font-bold text-warm-900">{result.gross}</dd>
                          </div>
                          <div className="rounded-lg bg-warm-50 p-2">
                            <dt className="text-[11px] text-warm-500">HDCP</dt>
                            <dd className="font-bold text-warm-900">{result.handicap}</dd>
                          </div>
                          <div className="rounded-lg bg-warm-50 p-2">
                            <dt className="text-[11px] text-warm-500">NET</dt>
                            <dd className="font-bold text-warm-900">{result.net}</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-warm-900 flex items-center gap-2">
                <Gift size={18} aria-hidden="true" />
                追加ポイント
              </h4>
            </div>

            {bonuses.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {bonuses.map((bonus) => (
                  <li
                    key={bonus.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-green-50 border border-green-100 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-bold text-green-950">{bonus.label}</p>
                      <p className="text-xs text-green-800 mt-0.5">第{bonus.stage}戦</p>
                    </div>
                    <span className="font-bold text-green-900">+{BONUS_POINTS_PER_ACTION}pt</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-lg bg-warm-100 px-4 py-3 text-sm text-warm-600">
                追加ポイントはありません。
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={!canTrend}
              onClick={() => {
                onShowInChart(standing.player.id);
                onClose();
                const prefersReducedMotion = window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                ).matches;
                document.getElementById("analytics-title")?.scrollIntoView({
                  behavior: prefersReducedMotion ? "auto" : "smooth",
                  block: "start",
                });
              }}
              className="w-full min-h-12 rounded-xl bg-green-800 text-white font-bold disabled:bg-warm-300 disabled:text-warm-500 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
            >
              {canTrend ? "この選手をグラフで見る" : "グラフ表示には2戦以上の出場が必要です"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Leaderboard({
  championship,
  instagramUrl,
  standings,
  onOpenPlayer,
}: {
  championship: Championship;
  standings: Standing[];
  instagramUrl: string;
  onOpenPlayer: (id: string) => void;
}) {
  return (
    <section
      aria-labelledby="leaderboard-title"
      className="max-w-6xl mx-auto px-4 pb-12 md:pb-16 overflow-hidden"
    >
      <div className="mb-5">
        <p className="text-sm font-bold text-green-800">LEADERBOARD</p>
        <div className="flex items-center gap-3">
          <h2
            id="leaderboard-title"
            className="scroll-mt-24 text-2xl md:text-3xl font-bold text-warm-900"
          >
            総合ランキング
          </h2>
          <a
            href="/golf-rules/"
            aria-label="くーちゃんとポイントルールを見る"
            title="ポイントルール"
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-accent-dark bg-accent-light text-xl font-bold text-warm-900 shadow-softer transition-colors hover:bg-accent-DEFAULT focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
          >
            <span aria-hidden="true">?</span>
          </a>
        </div>
        <p className="text-sm text-warm-600 mt-2">
          <JapaneseText
            phrases={[
              "フォーミュラ方式の",
              "順位ポイント +",
              "追加ポイントで",
              "集計しています。",
              "選手名をタップすると",
              "詳細を確認できます。",
            ]}
          />
        </p>
      </div>

      <div className="-mx-4 md:mx-0">
        <div
          className="max-w-full overflow-x-auto overscroll-x-contain touch-auto px-4 md:px-0 pb-3"
          style={{
            // Allow vertical page gestures as well as horizontal content scrolling.
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-xl bg-white shadow-soft border border-warm-200">
              <table className="w-full min-w-[820px] text-sm tabular-nums">
                <thead className="bg-warm-100 text-warm-700">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-20 min-w-[165px] bg-warm-100 px-3 py-4 text-left"
                    >
                      順位 / 氏名
                    </th>

                    {Array.from(
                      {
                        length: championship.totalStages,
                      },
                      (_, index) => (
                        <th
                          key={index}
                          scope="col"
                          className={`min-w-[68px] px-2 py-4 text-center ${
                            index >= championship.completedStages ? "text-warm-400" : ""
                          }`}
                        >
                          第{index + 1}戦
                        </th>
                      )
                    )}

                    <th scope="col" className="min-w-[78px] px-2 py-4 text-center">
                      追加pt
                    </th>
                    <th scope="col" className="min-w-[86px] px-3 py-4 text-center">
                      合計
                    </th>
                    <th scope="col" className="min-w-[70px] px-2 py-4 text-center">
                      変動
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {standings.map((standing) => {
                    const top = standing.rank <= 3;
                    const rowClass = top ? "bg-warm-50" : "bg-white";
                    const stickyClass = top ? "bg-warm-50" : "bg-white";

                    return (
                      <tr
                        key={standing.player.id}
                        className={`border-t border-warm-100 ${rowClass}`}
                      >
                        <th
                          scope="row"
                          className={`sticky left-0 z-10 min-w-[165px] px-3 py-3 text-left ${stickyClass}`}
                        >
                          <button
                            type="button"
                            onClick={() => onOpenPlayer(standing.player.id)}
                            className="group flex min-h-10 w-full items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
                          >
                            <span
                              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border text-sm font-bold tabular-nums ${
                                standing.rank === 1
                                  ? "border-accent-dark bg-accent-light text-warm-900"
                                  : standing.rank === 2
                                    ? "border-slate-300 bg-slate-100 text-slate-700"
                                    : standing.rank === 3
                                      ? "border-orange-200 bg-orange-50 text-orange-900"
                                      : "border-warm-200 bg-warm-50 text-warm-600"
                              }`}
                            >
                              {standing.rank}
                            </span>
                            <span className="min-w-0 truncate text-base font-bold text-warm-900 group-hover:text-green-800 group-focus-visible:text-green-800">
                              {standing.player.name}
                            </span>
                          </button>
                        </th>

                        {standing.stagePoints.map((points, index) => (
                          <td
                            key={index}
                            className={`px-2 py-3 text-center ${
                              index >= championship.completedStages
                                ? "text-warm-300"
                                : points === null
                                  ? "text-warm-400"
                                  : "text-warm-700"
                            }`}
                          >
                            {index >= championship.completedStages ? "—" : (points ?? "—")}
                          </td>
                        ))}

                        <td className="px-2 py-3 text-center font-bold text-green-800">
                          {standing.bonusPoints > 0 ? `+${standing.bonusPoints}` : "—"}
                        </td>

                        <td className="px-3 py-3 text-center font-bold text-warm-900">
                          {standing.totalPoints}
                          pt
                        </td>

                        <td className="px-2 py-3 text-center">
                          <Movement value={standing.movement} isNew={standing.isNew} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-warm-500 md:hidden">← 表は横にスワイプできます →</p>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-warm-200 bg-warm-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-warm-700">
          <JapaneseText
            phrases={[
              "お名前はイニシャルで",
              "表示しています。",
              "ニックネームへの変更を",
              "ご希望の方は、",
              "ともちゃん家の",
              "Instagramへ",
              "DMでご連絡ください。",
            ]}
          />
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent-light px-4 py-2 text-sm font-bold text-warm-900 transition-colors hover:bg-accent-DEFAULT focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
        >
          <span aria-hidden="true">📱</span>
          InstagramでDM
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      </div>
    </section>
  );
}

function getNicePointDomain(values: number[]) {
  if (values.length === 0) {
    return {
      min: 0,
      max: 25,
      ticks: [25, 20, 15, 10, 5, 0],
    };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const range = Math.max(5, rawMax - rawMin);
  const step = Math.max(5, Math.ceil(range / 5 / 5) * 5);
  const min = Math.max(0, Math.floor(rawMin / step) * step);
  let max = Math.ceil(rawMax / step) * step;

  if (max <= min) max = min + step * 5;

  const tickCount = 5;
  const tickStep = (max - min) / tickCount;

  return {
    min,
    max,
    ticks: Array.from({ length: tickCount + 1 }, (_, index) => max - tickStep * index),
  };
}

function EvolutionChart({
  championship,
  standings,
  forecasts,
  visible,
  selected,
  mode,
  showForecast,
  hovered,
  setHovered,
  onSelect,
}: {
  championship: Championship;
  standings: Standing[];
  forecasts: Forecast[];
  visible: Set<string>;
  selected: string;
  mode: Mode;
  showForecast: boolean;
  hovered: Hovered;
  setHovered: (value: Hovered) => void;
  onSelect: (id: string) => void;
}) {
  const eligible = trendEligibleStandings(standings);
  const visibleIds = eligible
    .filter((standing) => visible.has(standing.player.id))
    .map((standing) => standing.player.id);

  const series = useMemo(
    () => buildVisibleChartSeries(championship, standings, forecasts, [...visible], showForecast),
    [championship, standings, forecasts, visible, showForecast]
  );

  const totalStages = showForecast ? championship.totalStages : championship.completedStages;
  const width = showForecast ? 900 : 620;
  const height = 390;
  const left = 54;
  const right = 24;
  const top = 28;
  const bottom = 58;
  const visibleCount = visibleIds.length;

  const pointValues = Array.from(series.values())
    .flat()
    .map((point) => point.cumulativePoints);
  const pointDomain = getNicePointDomain(pointValues);

  const x = (stage: number) =>
    left + ((stage - 1) / Math.max(1, totalStages - 1)) * (width - left - right);

  const yRank = (rank: number) => {
    if (visibleCount <= 1) {
      return top + (height - top - bottom) / 2;
    }

    return top + ((rank - 1) / (visibleCount - 1)) * (height - top - bottom);
  };

  const yPoints = (points: number) =>
    height -
    bottom -
    ((points - pointDomain.min) / (pointDomain.max - pointDomain.min)) * (height - top - bottom);

  const activeStanding = standings.find((standing) => standing.player.id === hovered?.playerId);
  const activePoint = hovered
    ? series.get(hovered.playerId)?.find((point) => point.stage === hovered.stage)
    : undefined;

  if (visibleCount === 0) {
    return (
      <div className="min-h-[260px] flex items-center justify-center rounded-xl border border-dashed border-warm-300 bg-warm-50 px-6 text-center">
        <div>
          <p className="text-lg font-bold text-warm-900">表示する選手がいません</p>
          <p className="mt-2 text-sm text-warm-600">
            <JapaneseText phrases={["2戦以上出場した", "選手を選択してください。"]} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="-mx-3 overflow-x-auto overscroll-x-contain touch-auto px-3 pb-2 md:mx-0 md:px-0"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby="chart-title chart-desc"
          className={`block h-auto ${
            showForecast ? "min-w-[760px]" : "min-w-[540px]"
          } w-full md:min-w-0`}
        >
          <title id="chart-title">{mode === "rank" ? "順位推移" : "累計ポイント推移"}</title>
          <desc id="chart-desc">
            2戦以上出場した選手の
            {mode === "rank" ? "表示中選手内での順位" : "累計チャンピオンシップポイント"}
            の推移です。
          </desc>

          {(mode === "rank"
            ? Array.from(
                {
                  length: visibleCount,
                },
                (_, index) => index + 1
              )
            : pointDomain.ticks
          ).map((value, index) => {
            const y = mode === "rank" ? yRank(value) : yPoints(value);

            return (
              <g key={`${mode}-${index}`}>
                <line x1={left} x2={width - right} y1={y} y2={y} stroke="#ede6d9" />
                <text x={left - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#7d6456">
                  {mode === "rank" ? `${Math.round(value)}位` : Math.round(value)}
                </text>
              </g>
            );
          })}

          {Array.from(
            {
              length: totalStages,
            },
            (_, index) => {
              const stage = index + 1;
              const future = stage > championship.completedStages;

              return (
                <g key={stage}>
                  <line
                    x1={x(stage)}
                    x2={x(stage)}
                    y1={top}
                    y2={height - bottom}
                    stroke={future ? "#d4bfa8" : "#f5f1e8"}
                    strokeDasharray={future ? "5 5" : undefined}
                  />
                  <text
                    x={x(stage)}
                    y={height - 24}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#7d6456"
                  >
                    第{stage}戦{future ? " 予測" : ""}
                  </text>
                </g>
              );
            }
          )}

          {eligible
            .filter((standing) => visible.has(standing.player.id))
            .map((standing) => {
              const color =
                COLORS[
                  championship.players.findIndex((player) => player.id === standing.player.id) %
                    COLORS.length
                ];
              const dimmed = Boolean(selected && selected !== standing.player.id);
              const playerSeries = series.get(standing.player.id) ?? [];
              const historical = playerSeries.filter((point) => !point.isForecast);
              const projected = playerSeries.filter((point) => point.isForecast);

              const coordinate = (point: (typeof playerSeries)[number]) =>
                `${x(point.stage)},${
                  mode === "rank" ? yRank(point.rank) : yPoints(point.cumulativePoints)
                }`;

              const historicalPath = historical
                .map((point, index) => `${index === 0 ? "M" : "L"}${coordinate(point)}`)
                .join(" ");

              const forecastPath =
                showForecast && projected.length > 0 && historical.length > 0
                  ? [historical[historical.length - 1], ...projected]
                      .map((point, index) => `${index === 0 ? "M" : "L"}${coordinate(point)}`)
                      .join(" ")
                  : "";

              return (
                <g key={standing.player.id} opacity={dimmed ? 0.18 : 1}>
                  <path
                    d={historicalPath}
                    fill="none"
                    stroke={color}
                    strokeWidth={selected === standing.player.id ? 4 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {forecastPath && (
                    <path
                      d={forecastPath}
                      fill="none"
                      stroke={color}
                      strokeWidth={selected === standing.player.id ? 4 : 2.5}
                      strokeDasharray="8 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {playerSeries.map((point) => (
                    <React.Fragment key={point.stage}>
                      <circle
                        cx={x(point.stage)}
                        cy={mode === "rank" ? yRank(point.rank) : yPoints(point.cumulativePoints)}
                        r="12"
                        fill="transparent"
                        stroke="transparent"
                        tabIndex={0}
                        role="button"
                        aria-label={`${standing.player.name} 第${point.stage}戦 ${
                          point.isForecast ? "予測" : point.participated ? "" : "不参加 "
                        }${
                          mode === "rank"
                            ? `${point.rank}位`
                            : `${roundForDisplay(point.cumulativePoints)}ポイント`
                        }`}
                        onMouseEnter={() =>
                          setHovered({
                            playerId: standing.player.id,
                            stage: point.stage,
                          })
                        }
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() =>
                          setHovered({
                            playerId: standing.player.id,
                            stage: point.stage,
                          })
                        }
                        onBlur={() => setHovered(null)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setHovered({ playerId: standing.player.id, stage: point.stage });
                            onSelect(standing.player.id);
                          }
                        }}
                        onClick={() => {
                          setHovered({
                            playerId: standing.player.id,
                            stage: point.stage,
                          });
                          onSelect(standing.player.id);
                        }}
                      />

                      <circle
                        cx={x(point.stage)}
                        cy={mode === "rank" ? yRank(point.rank) : yPoints(point.cumulativePoints)}
                        r={point.isForecast ? 3.5 : 4.5}
                        fill={point.isForecast ? "white" : point.participated ? color : "white"}
                        stroke={color}
                        strokeWidth={point.isForecast || !point.participated ? 2 : 0}
                        pointerEvents="none"
                      />
                    </React.Fragment>
                  ))}
                </g>
              );
            })}
        </svg>
      </div>

      <p className="mt-1 text-xs text-warm-500 md:hidden">
        <JapaneseText
          phrases={[
            "← グラフは横に",
            "スワイプできます。",
            "点をタップすると",
            "選手をハイライトします →",
          ]}
        />
      </p>

      <div aria-live="polite" className="min-h-[62px] mt-3">
        {hovered && activeStanding && activePoint ? (
          <div className="inline-flex flex-wrap gap-x-3 gap-y-1 rounded-lg bg-warm-50 border border-warm-200 px-3 py-2 text-sm text-warm-800">
            <strong className="text-warm-900">{activeStanding.player.name}</strong>
            <span>
              第{hovered.stage}戦 · {activePoint.rank}位
              {activePoint.isForecast ? "（予測）" : !activePoint.participated ? "（不参加）" : ""}
            </span>
            <span>
              累計 {roundForDisplay(activePoint.cumulativePoints)}
              pt
            </span>
          </div>
        ) : (
          <p className="text-xs text-warm-500 pt-2">
            <JapaneseText
              phrases={["点にカーソルを合わせるか、", "タップすると", "詳細を表示します。"]}
            />
          </p>
        )}
      </div>
    </div>
  );
}

export default function GolfChampionship({
  championship,
  instagramUrl,
}: {
  championship: Championship;
  instagramUrl: string;
}) {
  const standings = useMemo(() => buildStandings(championship), [championship]);
  const forecasts = useMemo(
    () => buildForecasts(championship, standings),
    [championship, standings]
  );
  const eligible = useMemo(() => trendEligibleStandings(standings), [standings]);
  const eligibleIds = useMemo(() => eligible.map((standing) => standing.player.id), [eligible]);

  const [visible, setVisible] = useState(() => new Set(eligibleIds));
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState<Mode>("rank");
  const [showForecast, setShowForecast] = useState(false);
  const [hovered, setHovered] = useState<Hovered>(null);
  const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);

  const closeProfile = useCallback(() => {
    setProfilePlayerId(null);
  }, []);

  const profileStanding =
    standings.find((standing) => standing.player.id === profilePlayerId) ?? null;

  const selectedStanding = standings.find(
    (standing) => standing.player.id === selected && visible.has(standing.player.id)
  );
  const selectedForecast = forecasts.find((forecast) => forecast.playerId === selected);

  const selectForChart = (id: string) => {
    if (!eligibleIds.includes(id)) {
      setSelected("");
      return;
    }

    setVisible((previous) => {
      if (previous.has(id)) return previous;
      const next = new Set(previous);
      next.add(id);
      return next;
    });
    setSelected(id);
  };

  const toggleVisibility = (id: string) => {
    setHovered(null);
    setVisible((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
        if (selected === id) {
          setSelected("");
        }
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <>
      <Podium standings={standings} onOpenPlayer={setProfilePlayerId} />

      <Leaderboard
        championship={championship}
        instagramUrl={instagramUrl}
        standings={standings}
        onOpenPlayer={setProfilePlayerId}
      />

      <section
        aria-labelledby="analytics-title"
        className="bg-warm-100/70 py-12 md:py-16 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
            <div>
              <p className="text-sm font-bold text-green-800">CHAMPIONSHIP EVOLUTION</p>
              <h2
                id="analytics-title"
                className="text-2xl md:text-3xl font-bold text-warm-900 scroll-mt-24"
              >
                チャンピオンシップの推移
              </h2>
              <p className="text-sm text-warm-600 mt-2 max-w-2xl">
                <JapaneseText
                  phrases={[
                    "トレンドは",
                    "2戦以上出場した",
                    "選手だけを表示します。",
                    "1戦のみの成績から",
                    "将来推移は作りません。",
                  ]}
                />
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex bg-white rounded-lg p-1 shadow-softer"
                role="group"
                aria-label="グラフ表示"
              >
                <button
                  type="button"
                  onClick={() => {
                    setHovered(null);
                    setMode("rank");
                  }}
                  aria-pressed={mode === "rank"}
                  className={`px-4 py-2 rounded-md text-sm font-bold focus-visible:outline-2 focus-visible:outline-accent-dark ${
                    mode === "rank" ? "bg-accent-DEFAULT text-warm-900" : "text-warm-700"
                  }`}
                >
                  順位推移
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHovered(null);
                    setMode("points");
                  }}
                  aria-pressed={mode === "points"}
                  className={`px-4 py-2 rounded-md text-sm font-bold focus-visible:outline-2 focus-visible:outline-accent-dark ${
                    mode === "points" ? "bg-accent-DEFAULT text-warm-900" : "text-warm-700"
                  }`}
                >
                  累計ポイント
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHovered(null);
                  setShowForecast((value) => !value);
                }}
                aria-pressed={showForecast}
                className={`px-4 py-2 rounded-lg text-sm font-bold border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark ${
                  showForecast
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-white text-warm-800 border-warm-300"
                }`}
              >
                予測を表示
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-warm-200 p-3 md:p-6 min-w-0">
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-warm-600">
                  トレンド対象 {visible.size}/{eligible.length}人
                </p>

                <div className="flex flex-wrap gap-2">
                  {selected && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelected("");
                        setHovered(null);
                      }}
                      className="min-h-10 px-3 py-2 rounded-lg border border-green-700 bg-green-50 text-xs font-bold text-green-900 inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
                    >
                      <X size={14} aria-hidden="true" />
                      ハイライト解除
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setVisible(new Set(eligibleIds));
                      setHovered(null);
                    }}
                    disabled={visible.size === eligible.length}
                    className="min-h-10 px-3 py-2 rounded-lg border border-warm-300 bg-warm-50 text-xs font-bold text-warm-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    全員表示
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVisible(new Set());
                      setSelected("");
                      setHovered(null);
                    }}
                    disabled={visible.size === 0}
                    className="min-h-10 px-3 py-2 rounded-lg border border-warm-300 bg-white text-xs font-bold text-warm-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    全員非表示
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {eligible.map((standing) => {
                  const color =
                    COLORS[
                      championship.players.findIndex((player) => player.id === standing.player.id) %
                        COLORS.length
                    ];
                  const isVisible = visible.has(standing.player.id);

                  return (
                    <button
                      key={standing.player.id}
                      type="button"
                      onClick={() => toggleVisibility(standing.player.id)}
                      aria-pressed={isVisible}
                      className={`min-h-10 px-3 py-2 rounded-full border text-xs md:text-sm font-bold ${
                        isVisible
                          ? "bg-warm-50 border-warm-300 text-warm-900"
                          : "bg-white border-warm-200 text-warm-400"
                      }`}
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                        style={{
                          backgroundColor: color,
                        }}
                        aria-hidden="true"
                      />
                      {standing.player.shortName ?? standing.player.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <EvolutionChart
              championship={championship}
              standings={standings}
              forecasts={forecasts}
              visible={visible}
              selected={selected}
              mode={mode}
              showForecast={showForecast}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={selectForChart}
            />
          </div>

          <AnimatePresence mode="wait">
            {showForecast && selectedStanding && selectedForecast ? (
              <motion.div
                key={selectedStanding.player.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 8,
                }}
                className="mt-6 grid lg:grid-cols-[1fr_1.7fr] gap-5"
              >
                <div className="bg-green-900 text-white rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-2 text-green-100 text-xs font-bold tracking-[0.16em]">
                    <Trophy size={16} aria-hidden="true" />
                    COMEBACK POTENTIAL
                  </div>
                  <p className="text-2xl font-bold mt-3">{selectedStanding.player.name}</p>
                  <p className="text-green-100 mt-1">
                    現在 {selectedStanding.rank}位 · {selectedForecast.status}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6 text-sm tabular-nums">
                    <div>
                      <p className="text-green-200">首位との差</p>
                      <p className="text-xl font-bold">
                        {selectedForecast.gapToLeader}
                        pt
                      </p>
                    </div>
                    <div>
                      <p className="text-green-200">残り試合</p>
                      <p className="text-xl font-bold">{selectedForecast.remainingStages}戦</p>
                    </div>
                    <div>
                      <p className="text-green-200">現在の平均</p>
                      <p className="text-xl font-bold">
                        {selectedForecast.currentAverage}
                        pt
                      </p>
                    </div>
                    <div>
                      <p className="text-green-200">首位争いの目安</p>
                      <p className="text-xl font-bold">
                        {selectedForecast.requiredAverageToLead}
                        pt
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-soft border border-warm-200">
                  <div className="flex flex-wrap items-center gap-2 text-warm-900 font-bold">
                    <Flag size={18} aria-hidden="true" />
                    予測最終順位
                    <span className="text-2xl ml-1">{selectedForecast.projectedRankRange}</span>
                  </div>

                  <p className="mt-4 text-warm-700 leading-relaxed">
                    {selectedForecast.explanation}
                  </p>

                  <p className="mt-5 text-xs text-warm-500">
                    <JapaneseText
                      phrases={[
                        "追加ポイントは",
                        "将来予測には",
                        "含めていません。",
                        "2戦以上の",
                        "実績ポイントだけを使い、",
                        "短期トレンドを",
                        "減衰させて外挿した",
                        "参考値です。",
                      ]}
                    />
                  </p>
                </div>
              </motion.div>
            ) : showForecast ? (
              <motion.div
                key="forecast-empty"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="mt-6 rounded-xl border border-dashed border-green-300 bg-green-50/70 px-5 py-4 text-sm text-green-950 flex items-start gap-3"
              >
                <Focus size={20} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p>
                  <JapaneseText
                    phrases={[
                      "予測カードを見るには、",
                      "グラフ上の点から",
                      "2戦以上出場した",
                      "選手を選択してください。",
                    ]}
                  />
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <PlayerProfileModal
        championship={championship}
        standing={profileStanding}
        onClose={closeProfile}
        onShowInChart={selectForChart}
      />
    </>
  );
}
