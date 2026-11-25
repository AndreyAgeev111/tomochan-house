// Confirmed details from the owner's corrected January 2027 poster.
// The poster's event number is independent of the championship round number.
export const golfTournament2027 = {
  id: "golf-tournament-2027",
  title: "ともちゃん家 ゴルフコンペ 第5回",
  date: "2027年1月20日（水）",
  isoDate: "2027-01-20",
  location: "プレステージカントリークラブ",
  description:
    "2027年最初のゴルフコンペを開催します。プレイ終了後は、ともちゃん家で打ち上げ！参加のお申し込み・お問い合わせはInstagramのDM、またはお電話でどうぞ。",
  image: "/images/events/golf-tournament-2027-01.webp",
  imageWidth: 906,
  imageHeight: 1280,
  imageAlt:
    "ともちゃん家ゴルフコンペ第5回のポスター。2027年1月20日（水）、プレステージカントリークラブで開催。集合7時25分、スタート7時56分。",
  details: [
    {
      label: "会場",
      value: "プレステージカントリークラブ\n栃木県栃木市梓町455-1",
    },
    { label: "集合時間", value: "7時25分" },
    { label: "スタート時間", value: "7時56分（4組）" },
    { label: "プレイ料金", value: "10,900円" },
    { label: "会費", value: "8,000円（景品代・飲み放題・食事代込み）" },
    { label: "打ち上げ", value: "プレイ終了後、ともちゃん家で開催" },
    { label: "賞品", value: "1位・2位・3位・ブービー賞" },
    {
      label: "ルール・競技",
      value: "新ペリ・ドラコン・ニアピンあり。スタートのフェアウェイ外しは500円の罰金。",
    },
  ],
} as const;
