import { useEffect, useState } from "react";

export default function StickyNav() {
  const [isMobile, setIsMobile] = useState(false);
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setPathname(window.location.pathname);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const isHome = pathname === "/";
  const isGolfResults = pathname.startsWith("/golf-results");
  const isGolf = isGolfResults || pathname.startsWith("/golf-rules");
  const golfHref = (hash: string) => (isGolfResults ? hash : `/golf-results/${hash}`);
  const homeHref = (hash: string) => (isHome ? hash : `/${hash}`);

  // Golf page: only page-relevant actions.
  const quickLinks = isGolf
    ? [
        {
          label: "ホーム",
          href: "/",
          icon: "🏮",
        },
        {
          label: "ランキング",
          href: golfHref("#leaderboard-title"),
          icon: "🏆",
        },
        {
          label: "推移",
          href: golfHref("#analytics-title"),
          icon: "📈",
        },
      ]
    : [
        {
          label: "ホーム",
          href: homeHref("#home"),
          icon: "🏮",
        },
        {
          label: "メニュー",
          href: homeHref("#menu"),
          icon: "🍽️",
        },
        {
          label: "営業カレンダー",
          href: homeHref("#events"),
          icon: "📅",
        },
        {
          label: "ゴルフ結果",
          href: "/golf-results/",
          icon: "⛳",
        },
        {
          label: "お問い合わせ",
          href: homeHref("#contact"),
          icon: "📱",
        },
      ];

  if (isMobile) {
    return (
      <nav
        className="fixed inset-x-0 bottom-0 z-30 w-full border-t border-warm-200 bg-white/95 shadow-lg backdrop-blur-sm"
        aria-label="クイックナビゲーション"
        data-quick-nav
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className={`mx-auto grid w-full ${isGolf ? "max-w-sm grid-cols-3" : "grid-cols-5"}`}>
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-[62px] min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[0.7rem] font-bold leading-tight text-warm-700 hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              title={link.label}
            >
              <span className="text-xl" style={{ fontSize: "1.25rem" }} aria-hidden="true">
                {link.icon}
              </span>
              <span className="block max-w-full truncate" style={{ fontSize: "0.7rem" }}>
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky-nav" aria-label="クイックナビゲーション" data-quick-nav>
      {quickLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="btn-icon bg-white shadow-soft hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          title={link.label}
        >
          <span className="text-xl" style={{ fontSize: "1.25rem" }} aria-hidden="true">
            {link.icon}
          </span>
          <span className="sr-only">{link.label}</span>
        </a>
      ))}
    </nav>
  );
}
