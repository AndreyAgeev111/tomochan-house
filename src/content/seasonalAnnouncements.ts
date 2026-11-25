export type SeasonalAnnouncement = {
  id: string;
  theme: "golf" | "anniversary" | "party";
  label: string;
  title: string;
  description: string;
  date: string | null;
  poster: { src: string; width: number; height: number; alt: string } | null;
  details: { label: string; value: string }[];
};

// Confirmed details are transcribed from the owner's original posters.
// The January golf announcement has its own shared content in golfTournament.ts.
// A null date is an announcement in preparation, not a booking.
export const seasonalAnnouncements: SeasonalAnnouncement[] = [
  {
    id: "shop-anniversary",
    theme: "anniversary",
    label: "ANNIVERSARY",
    title: "2周年記念イベント",
    description:
      "いつも支えてくださる皆さまのおかげで、ともちゃん家は2周年を迎えます。日頃の感謝を込めて、3日間の記念イベントを開催します。ぜひ一緒にお祝いしましょう！",
    date: "2026年12月11日（金）〜13日（日）",
    poster: {
      src: "/images/events/anniversary-2026.webp",
      width: 1170,
      height: 1280,
      alt: "ともちゃん家2周年記念イベントのポスター。12月11日・12日・13日開催、期間中はお通しがいつもより豪華になります。",
    },
    details: [
      {
        label: "特別なお通し",
        value: "期間中は、お通しをいつもより豪華にご用意します。",
      },
    ],
  },
  {
    id: "year-end-party",
    theme: "party",
    label: "YEAR-END PARTY",
    title: "忘年会のご予約受付中",
    description:
      "一年の締めくくりに、ともちゃん家で忘年会はいかがですか？皆さまで楽しいひとときをお過ごしください。",
    date: "ご予約受付中",
    poster: {
      src: "/images/events/year-end-party-2026.webp",
      width: 1170,
      height: 1280,
      alt: "ともちゃん家の忘年会ご予約受付中のポスター。飲み放題・お食事など、ご希望に合わせて相談可能。ご予約・ご相談はDMまたは電話で。",
    },
    details: [
      {
        label: "飲み放題・お食事",
        value: "ご希望に合わせてご相談に応じます。",
      },
    ],
  },
];
