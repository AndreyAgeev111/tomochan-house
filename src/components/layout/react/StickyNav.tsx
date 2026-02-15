import React, { useState, useEffect } from "react";

export default function StickyNav() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const quickLinks = [
    { label: "ホーム", href: "#home", icon: "🏮" },
    { label: "メニュー", href: "#menu", icon: "🍽️" },
    { label: "営業カレンダー", href: "#events", icon: "📅" },
    { label: "お問い合わせ", href: "#contact", icon: "📱" },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-warm-200 shadow-lg">
        <div className="flex justify-around py-2 overflow-x-auto">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              title={link.label}
              className="flex flex-col items-center gap-1 text-xs font-bold text-warm-700 hover:text-accent-DEFAULT transition-colors flex-shrink-0 px-2 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-DEFAULT rounded"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="max-w-[60px] text-center break-words">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky-nav">
      {quickLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="btn-icon bg-white shadow-soft hover:shadow-lg"
          title={link.label}
        >
          <span className="text-xl">{link.icon}</span>
        </a>
      ))}
    </nav>
  );
}
