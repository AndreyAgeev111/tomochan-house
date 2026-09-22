export const FORMULA_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const;
export const BONUS_POINTS_PER_ACTION = 3;

export type Player = {
  id: string;
  name: string;
  shortName?: string;
  avatar?: string;
};

export type ChampionshipStage = {
  stage: number;
  date: string;
  location?: string;
};

export type StageResult = {
  stage: number;
  playerId: string;
  rank: number;
  gross: number;
  handicap: number;
  net: number;
};

export type BonusAction = {
  id: string;
  playerId: string;
  stage: number;
  label: string;
};

export type RewardTier = {
  threshold: number;
  title: string;
  description: string;
};

export type Championship = {
  id: string;
  title: string;
  season: string;
  completedStages: number;
  totalStages: number;
  players: Player[];
  stages: ChampionshipStage[];
  results: StageResult[];
  bonusActions: BonusAction[];
  rewardTiers: RewardTier[];
};

/**
 * REAL TOURNAMENT RESULTS TRANSCRIBED FROM THE TWO SCORE SHEETS SUPPLIED
 * BY THE SITE OWNER.
 *
 * Championship points are NOT stored here. They are derived from `rank`
 * using FORMULA_POINTS, so changing the scoring system later requires one
 * config change instead of editing every result.
 *
 * Bonus actions remain empty until real rules/actions are available.
 * Every approved bonus action is worth BONUS_POINTS_PER_ACTION (= 3 pt).
 *
 * A missing StageResult means "did not participate" and is rendered as "—".
 */
export const golfChampionship: Championship = {
  id: "tomochan-house-2026",
  title: "ともちゃん家 ゴルフチャンピオンシップ",
  season: "2026 SEASON",
  completedStages: 3,
  totalStages: 6,

  stages: [
    {
      stage: 1,
      date: "2026-05-12",
    },
    {
      stage: 2,
      date: "2026-07-29",
      location: "浦和ゴルフ倶楽部",
    },
    {
      stage: 3,
      date: "2026-09-22",
      location: "大宮国際カントリークラブ",
    },
  ],

  // Opaque IDs must never contain names or other personal information.
  players: [
    { id: "player-15542eac", name: "かわいちゃん" },
    { id: "player-68ceac43", name: "AY" },
    { id: "player-5e5c2cf6", name: "よっぴー" },
    { id: "player-d925dd41", name: "TH" },
    { id: "player-3b7c2ae8", name: "SY" },
    { id: "player-b82e1f4d", name: "KS" },
    { id: "player-900077f9", name: "OK" },
    { id: "player-bab3a577", name: "ともちゃん" },
    { id: "player-2c5b0a08", name: "やんちゃん" },
    { id: "player-9301f7da", name: "FK" },
    { id: "player-83f40e87", name: "ありさ" },
    { id: "player-f77da93c", name: "NF" },
    { id: "player-0a860c72", name: "MK" },
    { id: "player-2ee84505", name: "りっきー" },
    { id: "player-18c67317", name: "NI" },
    { id: "player-7b2dccb9", name: "ペルー人（社長）" },
    { id: "player-4cb8e3d1", name: "もりし" },
    { id: "player-a7519f20", name: "しんちゃん" },
  ],

  results: [
    // Stage 1 — 2026-05-12
    { stage: 1, playerId: "player-15542eac", rank: 1, gross: 88, handicap: 14.4, net: 73.6 },
    { stage: 1, playerId: "player-68ceac43", rank: 2, gross: 85, handicap: 10.8, net: 74.2 },
    { stage: 1, playerId: "player-5e5c2cf6", rank: 3, gross: 105, handicap: 30.0, net: 75.0 },
    { stage: 1, playerId: "player-d925dd41", rank: 4, gross: 110, handicap: 34.8, net: 75.2 },
    { stage: 1, playerId: "player-3b7c2ae8", rank: 5, gross: 97, handicap: 21.6, net: 75.4 },
    { stage: 1, playerId: "player-b82e1f4d", rank: 6, gross: 119, handicap: 43.2, net: 75.8 },
    { stage: 1, playerId: "player-900077f9", rank: 7, gross: 99, handicap: 22.8, net: 76.2 },
    { stage: 1, playerId: "player-bab3a577", rank: 8, gross: 98, handicap: 21.6, net: 76.4 },
    { stage: 1, playerId: "player-2c5b0a08", rank: 9, gross: 97, handicap: 20.4, net: 76.6 },
    { stage: 1, playerId: "player-9301f7da", rank: 10, gross: 132, handicap: 50.4, net: 81.6 },
    { stage: 1, playerId: "player-83f40e87", rank: 11, gross: 100, handicap: 18.0, net: 82.0 },

    // Stage 2 — 2026-07-29 / 浦和ゴルフ倶楽部
    { stage: 2, playerId: "player-15542eac", rank: 1, gross: 89, handicap: 14.4, net: 74.6 },
    { stage: 2, playerId: "player-bab3a577", rank: 2, gross: 104, handicap: 28.8, net: 75.2 },
    { stage: 2, playerId: "player-5e5c2cf6", rank: 3, gross: 100, handicap: 22.8, net: 77.2 },
    { stage: 2, playerId: "player-f77da93c", rank: 4, gross: 96, handicap: 16.8, net: 79.2 },
    { stage: 2, playerId: "player-0a860c72", rank: 5, gross: 140, handicap: 58.8, net: 81.2 },
    { stage: 2, playerId: "player-2ee84505", rank: 6, gross: 112, handicap: 30.0, net: 82.0 },
    { stage: 2, playerId: "player-18c67317", rank: 7, gross: 119, handicap: 36.0, net: 83.0 },
    { stage: 2, playerId: "player-83f40e87", rank: 8, gross: 105, handicap: 21.6, net: 83.4 },
    { stage: 2, playerId: "player-7b2dccb9", rank: 9, gross: 111, handicap: 26.4, net: 84.6 },
    { stage: 2, playerId: "player-b82e1f4d", rank: 10, gross: 109, handicap: 24.0, net: 85.0 },

    // Stage 3 — 2026-09-22 / 大宮国際カントリークラブ
    { stage: 3, playerId: "player-5e5c2cf6", rank: 1, gross: 90, handicap: 23.2, net: 66.8 },
    { stage: 3, playerId: "player-bab3a577", rank: 2, gross: 96, handicap: 28.0, net: 68.0 },
    { stage: 3, playerId: "player-15542eac", rank: 3, gross: 85, handicap: 14.8, net: 70.2 },
    { stage: 3, playerId: "player-4cb8e3d1", rank: 4, gross: 95, handicap: 24.4, net: 70.6 },
    { stage: 3, playerId: "player-2c5b0a08", rank: 5, gross: 100, handicap: 29.2, net: 70.8 },
    { stage: 3, playerId: "player-a7519f20", rank: 6, gross: 97, handicap: 25.6, net: 71.4 },
    { stage: 3, playerId: "player-7b2dccb9", rank: 7, gross: 102, handicap: 30.4, net: 71.6 },
    { stage: 3, playerId: "player-83f40e87", rank: 8, gross: 110, handicap: 34.0, net: 76.0 },
    { stage: 3, playerId: "player-2ee84505", rank: 9, gross: 113, handicap: 35.2, net: 77.8 },
  ],

  rewardTiers: [
    {
      threshold: 25,
      title: "お会計 5% OFF",
      description: "ともちゃん家で使えるシーズン特典（仮）",
    },
    {
      threshold: 50,
      title: "次回コンペ参加費 無料",
      description: "次回開催へのエントリー特典（仮）",
    },
    {
      threshold: 75,
      title: "お食事券 ¥3,000",
      description: "ともちゃん家で使えるお食事特典（仮）",
    },
    {
      threshold: 100,
      title: "シーズン特別賞",
      description: "100pt到達者向けプレミアム特典（仮）",
    },
  ],

  bonusActions: [],
};
