export const siteContent = {
  business: {
    name: "ともちゃん家",
    nameRuby: "Tomochan House",
    tagline: "池袋の隠れ家居酒屋 カラオケ＆手作り料理",
    description:
      "アットホームで心からくつろげるカラオケ居酒屋。飲んで歌って楽しみましょう",
    since: "",
    address: "東京都豊島区池袋2-5-4 壱ビル301号",
    addressShort: "池袋駅 徒歩5分",
    phone: "03-XXXX-XXXX",
    instagramHandle: "tomochan_house",
    instagramUrl: "https://instagram.com/tomochan_house",
    hours: [
      { day: "月〜金", time: "19:00〜4:00" },
      { day: "土日祝", time: "19:00〜4:00" },
    ],
    closed: "不定休（SNSで確認ください）",
    specialFeatures: [
      { icon: "🎤", label: "カラオケ歌い放題", description: "時間無制限で歌い放題" },
      { icon: "🍚", label: "自家製料理", description: "心を込めた手作り料理" },
      { icon: "👥", label: "くつろぎの空間", description: "一人でもグループでも" },
    ],
  },

  nav: [
    { id: "home", label: "ホーム", href: "#home" },
    { id: "about", label: "お店について", href: "#about" },
    { id: "menu", label: "メニュー", href: "#menu" },
    { id: "events", label: "営業カレンダー", href: "#events" },
    { id: "gallery", label: "写真", href: "#gallery" },
    { id: "access", label: "アクセス", href: "#access" },
    { id: "contact", label: "お問い合わせ", href: "#contact" },
    { id: "reviews", label: "ご感想", href: "#reviews" },
  ],

  hero: {
    title: "ともちゃん家へようこそ",
    subtitle: "時間無制限、カラオケ無料、お客様が落ち着けるアットホームなお店",
    badges: [
      "🏮 池袋 カラオケ居酒屋",
      "🍲 ママの美味しい自家製料理",
      "🐱 カラオケ歌い放題",
      "フリータイム",
    ],
    ctas: [
      { label: "メニューを見る", href: "#menu", primary: true },
      { label: "予約・お問い合わせ", href: "#contact", primary: false },
    ],
  },

  about: {
    title: "お店について",
    sections: [
      {
        heading: "ともちゃん家とは",
        content:
          "手作りのあたたかい料理と明るく元気でお酒大好きな朋子ママが迎えるアットホームなお店です。気の合う仲間とおしゃべりしたり、カラオケで思いっきり歌ったり、その場で出会った仲間と盛り上がったりお腹も心も満たされるお店です。",
      },
      {
        heading: "こんなお店です",
        content:
<<<<<<< HEAD
          "カウンター６席と、ボックス席が１つ。\n一人でも、グループでも楽しめます。\nカラオケ無料で時間も無制限のため時間を気にせず楽しむことができます。",
=======
          "カウンター６席と、ボックス席が１つ。\n 一人でも、グループでも楽しめます。\n カラオケ無料で時間も無制限のため時間を気にせず楽しむことができます。",
>>>>>>> a3781c9 (change text)
      },
      {
        heading: "はじめての方へ",
        content:
          "ともちゃん家が初めての方も緊張しなくても大丈夫です。一度行ったら居心地の良さにハマるはず！！わからないことがあればインスタのDMに気軽に連絡してください。",
      },
    ],
    mascot: {
      name: "くーちゃん",
      description: "ともちゃんの家族の一員。Instagramのストーリーに登場率高め！",
      emoji: "🐱",
    },
  },

  menu: {
    title: "おすすめメニュー",
    intro: "食べたいメニューがあれば事前にともちゃんにリクエストしたら作ってくれるかも！？",
    categories: ["料理", "ドリンク"],
    items: [
      {
        category: "料理",
        name: "トンテキ",
        price: "¥680",
        icon: "🍗",
      },
      {
        category: "料理",
        name: "チーズスティック",
        price: "¥550",
        icon: "🥟",
      },
      {
        category: "料理",
        name: "海苔クリームチーズのせ（４枚）",
        price: "¥480",
        icon: "🧀",
      },
      {
        category: "料理",
        name: "揚げ餅と茄子のお浸し",
        price: "¥480",
        icon: "🍆",
      },
      {
        category: "料理",
        name: "豚肉とキムチ炒め",
        price: "¥600",
        icon: "🍖",
      },
      {
        category: "料理",
        name: "焼きそば",
        price: "700",
        icon: "🍜",
      },
      {
        category: "料理",
        name: "昔ながらのナポリタン",
        price: "¥800",
        icon: "🍝",
      },
      {
        category: "料理",
        name: "ポップコーン",
        price: "¥680",
        icon: "🎞️",
      },
      {
        category: "ドリンク",
        name: "アサヒスーパードライ",
        price: "¥830",
        icon: "🍺",
      },
      {
        category: "ドリンク",
        name: "グレープフルーツサワー",
        price: "¥680",
        icon: "🍹",
      },
      {
        category: "ドリンク",
        name: "レモンサワー",
        price: "¥680",
        icon: "🍹",
      },
      {
        category: "ドリンク",
        name: "シークヮーサーサワー",
        price: "¥680",
        icon: "🍹",
      },
      {
        category: "ドリンク",
        name: "角ハイボール",
        price: "¥730",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "ウーロンハイ",
        price: "¥600",
        icon: "🍵",
      },
      {
        category: "ドリンク",
        name: "お茶割り",
        price: "¥600",
        icon: "🍵",
      },
      {
        category: "ドリンク",
        name: "ホッピー",
        description: "中サイズは別途¥300。",
        price: "¥350",
        icon: "🍺",
      },
      {
        category: "ドリンク",
        name: "芋麦",
        price: "¥680",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "ひげ茶割り",
        price: "¥630",
        icon: "🍵",
      },
      {
        category: "ドリンク",
        name: "ハウスワイン",
        price: "¥800〜",
        icon: "🍷",
      },
      {
        category: "ドリンク",
        name: "キンミヤ",
        price: "¥3,900",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "吉四六(麦)",
        price: "¥5,400",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "陸",
        price: "¥5,800",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        description: "焼酎ボトル",
        price: "¥5,000",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "黒霧島(芋)",
        price: "¥4,500",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "サントリー角",
        price: "¥6,000",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "オールドパー",
        price: "¥10,000",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "白州",
        price: "¥22,000",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "山崎",
        price: "¥22,000",
        icon: "🥃",
      },

      {
        category: "ドリンク",
        name: "イチローズモルト",
        price: "¥15,000",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "テキーラ１８００",
        price: "¥1,500",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "テキーラいちご味、メロン味",
        description: "ショット",
        price: "¥500",
        icon: "🥃",
      },
      {
        category: "ドリンク",
        name: "モエ",
        description: "シャンパン",
        price: "¥22,000",
        icon: "🍾",
      },
      {
        category: "ドリンク",
        name: "ヴーヴ",
        description: "シャンパン",
        price: "¥28,000",
        icon: "🍾",
      },
      {
        category: "ドリンク",
        name: "ドンペリ",
        description: "シャンパン",
        price: "¥80,000",
        icon: "🍾",
      },
      {
        category: "ドリンク",
        name: "コーラ",
        description: "ソフトドリンク",
        price: "¥350",
        icon: "🥤",
      },
      {
        category: "ドリンク",
        name: "ジンジャエール",
        description: "ソフトドリンク",
        price: "¥350",
        icon: "🥤",
      },
      {
        category: "ドリンク",
        name: "ウーロン茶",
        description: "ソフトドリンク",
        price: "¥350",
        icon: "🥤",
      },
      {
        category: "ドリンク",
        name: "カテキン茶",
        description: "ソフトドリンク",
        price: "¥350",
        icon: "🥤",
      },
      {
        category: "ドリンク",
        name: "グレープフルーツジュース",
        description: "ソフトドリンク",
        price: "¥400",
        icon: "🥤",
      },
      {
        category: "ドリンク",
        name: "炭酸",
        description: "ソフトドリンク",
        price: "¥350",
        icon: "🥤",
      },
    ],
  },

  events: {
    title: "営業カレンダー・イベント",
    intro: "今月の営業状況とイベント情報です。",
    note: "日曜・月曜も営業する日があります。最新情報はInstagramをご確認ください。",
    monthlyEvents: [
      {
        date: "毎週火曜",
        event: "９２点以上はサワー1杯サービス",
        icon: "🎤",
      },
      { date: "毎月末日", event: "特別メニュー登場", icon: "✨" },
      {
        date: "2026年3月9日",
        event: "ゴルフコンペ開催",
        icon: "⛳",
        isSpecial: true,
      },
    ],
    holidays: [
      { date: "第1月曜", reason: "定休日" },
      { date: "年末年始", reason: "要確認" },
    ],
    calendar: {
      month: 2,
      year: 2026,
      closedDates: [1, 2, 5, 11, 23],
      specialDates: [
      //  {date: 9, label: "ゴルフコンペ開催", emoji: "⛳", color: "yellow"}
      ],
    },
    specialEvent: {
      title: "ゴルフコンペ 2026年3月9日（月）",
      date: "2026年3月9日（月）",
      description:
<<<<<<< HEAD
        "ともちゃん家関連企画でゴルフコンペを開催します。ゴールド佐野カントリークラブにて、楽しいイベントをお楽しみください。",
      image: "/images/events/golf-tournament.jpg",
=======
        "ともちゃん家企画でゴルフコンペを開催します。ゴールド佐野カントリークラブにて、楽しいイベントをお楽しみください。",
      image: "/tomochan-house/images/events/golf-tournament.jpg",
>>>>>>> a3781c9 (change text)
      details: [
        {
          icon: "📍",
          label: "会場",
          value: "ゴールド佐野カントリークラブ（栃木県佐野市）",
        },
        { icon: "🕐", label: "時間", value: "集合 8時15分 / スタート 8時35分" },
        { icon: "⏱️", label: "プレー形式", value: "前半終了後 表彰式、新ぺリ" },
        {
          icon: "💰",
          label: "会費",
          value: "1,000円 + スタートフェア外(L500円割引あり)",
        },
        {
          icon: "🏆",
          label: "特典",
          value: "1位2位3位 ブービー賞、賞品あり",
        },
      ],
      cta: {
        label: "詳細・申込はInstagramへ",
        href: "https://instagram.com/tomochan_house",
      },
    },
  },

  gallery: {
    title: "写真",
    description: "ともちゃん家の雰囲気をお楽しみください。",
    images: Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      src: `/images/gallery/gallery-${i + 1}.jpg`,
      alt: `ともちゃん家の店内写真 ${i + 1}`,
      caption: ["カウンター席", "座敷席", "ともちゃん"][i],
    })),
  },

  instagram: {
    title: "インスタグラム",
    handle: "tomochan_house",
    bio: "🐱 くーちゃんの世界観に浸る居酒屋 in 池袋 🍺",
    cta: "フォローして最新情報をゲット！",
    url: "https://instagram.com/tomochan_house",
  },

  access: {
    title: "アクセス",
    address: "東京都豊島区池袋2-5-4 壱ビル301号",
    transit: "JR池袋駅 徒歩5分 / 東京メトロ池袋駅 徒歩5分",
    mapUrl: "https://maps.app.goo.gl/NGTcbHusn8XrZSbT8",
    latitude: 35.7324275,
    longitude: 139.707879,
    directions: [
      "JR池袋駅 東口を出て、明治通りを北へ",
      "サンシャイン通りを東へ進む",
      "池袋中央図書館の近く、左手の路地を入ると看板が見えます",
      "壱ビル301号（3階）です",
    ],
  },

  contact: {
    title: "予約・お問い合わせ",
    intro: "ご予約・ご不明な点は、お気軽にお問い合わせください。",
    ctas: [
      {
        method: "インスタグラム DM",
        href: "https://instagram.com/tomochan_house",
        icon: "📱",
      },
      {
        method: "電話",
        description: "営業時間中のみ",
        href: "tel:03XXXXXXXX",
        icon: "☎️",
      },
    ],
    hours: "営業時間：月〜金 19:00〜4:00 / 土日祝 19:00〜4:00",
    faq: [
      {
        q: "初めてでも大丈夫？",
        a: "もちろんです！初心者大歓迎。何か不安なことあれば、遠慮なくDMしてください。雰囲気をお伝えします。",
      },
      {
        q: "支払い方法は？",
        a: "現金、クレジットカード（VISA・MasterCard・JCB）、PayPay、その他QRコード決済あり",
      },
      {
        q: "一人飲みでも大丈夫ですか？",
        a: "大歓迎です。むしろ一人客率が高いです。カウンター席もあります。",
      },
      {
        q: "貸し切りはできますか？",
        a: "可能です。詳細はインスタのDMでお問い合わせください。",
      },
      {
        q: "食べ物の持ち込みはOK？",
        a: "申し訳ありませんが、原則禁止です。ともちゃんの手作り料理をぜひ召し上がってください",
      },
    ],
  },

  reviews: {
    title: "ご感想をお聞かせください",
    rating: 4.8,
    totalReviews: 13,
    testimonials: [
      {
        id: 1,
        text: "アットホームなお店で安い！カラオケはみんなで楽しく歌えるから、ほんとにおすすめ！歌の上手いお兄さんもよく来てます！",
        foodRating: 5,
        serviceRating: 5,
        atmosphereRating: 5,
      },
      {
        id: 2,
        text: "ご飯が美味しくてお酒も安価でのめます😆 フレンドリーなお店なのでまた来たくなります🥹",
        foodRating: 5,
        serviceRating: 5,
        atmosphereRating: 5,
      },
      {
        id: 3,
        text: "何度も飲みに行かせてもらってます🍻\nママも素敵な方でいつも笑顔で優しく、話も面白い！そして何よりご飯が全部手作りで美味しい！\nその美味しいご飯と合わせて飲むお酒は最高でした😭✨\nカラオケもできるのでついつい長居してしまいます😂\nいつもありがとうございます🍀.*\nまたすぐ飲みに行きます🍻",
        foodRating: 5,
        serviceRating: 5,
        atmosphereRating: 5,
      },
      {
        id: 4,
        text: "フードメニューもいっぱいだから一軒目からOK\nアットホームな感じでお一人様でも楽しく飲めました♪",
        foodRating: 5,
        serviceRating: 4,
        atmosphereRating: 5,
      },
    ],
    cta: {
      text: "Google Mapで口コミを投稿する",
      href: "https://www.google.com/maps/place/%E3%81%A8%E3%82%82%E3%81%A1%E3%82%83%E3%82%93%E5%AE%B6/@35.7324275,139.707879,18z/data=!3m1!5s0x60188d5e94418597:0xe284483c83d31038!4m8!3m7!1s0x60188d00480a9595:0xd8da6afeee921114!8m2!3d35.7324245!4d139.7079608!9m1!1b1!16s%2Fg%2F11m5npgvnk?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D",
      icon: "✍️",
    },
    mascotMessage:
      "くーちゃんより：お忙しい中、口コミを投稿していただきありがとうございます！皆様のご感想が、私たちのサービス向上の力になります。",
  },

  news: [
    {
      id: 1,
      date: "2024-01-15",
      title: "オープンしました！",
      content: "ともちゃん家がオープンしました。皆さんのご来店をお待ちしています。",
      icon: "🎉",
    },
    {
      id: 2,
      date: "2024-01-20",
      title: "スタッフ募集中",
      content: "ホール・キッチンスタッフを募集中。詳細はDMまで。",
      icon: "💼",
    },
    {
      id: 3,
      date: "2024-01-25",
      title: "Instagram始めました",
      content: "最新情報・毎日のおすすめメニューを配信中。フォローお願いします！",
      icon: "📱",
    },
  ],
};

export type SiteContent = typeof siteContent;
