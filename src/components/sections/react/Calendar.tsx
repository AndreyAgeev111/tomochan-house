interface CalendarProps {
  month: number;
  year: number;
  closedDates: readonly number[];
  specialDates?: ReadonlyArray<{
    date: number;
    label: string;
    emoji: string;
    color?: "pink" | "yellow" | "blue" | "green" | "purple" | "orange";
    href?: string;
  }>;
}

export default function Calendar({ month, year, closedDates, specialDates = [] }: CalendarProps) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  const monthName = new Date(year, month - 1).toLocaleString("ja-JP", {
    month: "long",
  });
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const isClosedDay = (day: number): boolean => closedDates.includes(day);

  const getSpecialDate = (day: number) => {
    return specialDates.find((sd) => sd.date === day);
  };

  const getColorClasses = (color?: string) => {
    const colorMap: Record<string, string> = {
      pink: "bg-pink-100 text-pink-700 border-pink-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      green: "bg-green-100 text-green-700 border-green-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
    };
    return colorMap[color || "yellow"] || colorMap.yellow;
  };

  const specialDateLegends = Array.from(
    specialDates.reduce((legends, specialDate) => {
      const key = JSON.stringify([
        specialDate.label,
        specialDate.emoji,
        specialDate.color || "yellow",
        specialDate.href,
      ]);
      const existing = legends.get(key);

      if (existing) {
        if (!existing.dates.includes(specialDate.date)) {
          existing.dates.push(specialDate.date);
        }
      } else {
        legends.set(key, { ...specialDate, dates: [specialDate.date] });
      }

      return legends;
    }, new Map<string, (typeof specialDates)[number] & { dates: number[] }>())
  );

  return (
    <div className="bg-white rounded-xl p-2 sm:p-6 shadow-soft min-w-0">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-warm-900">
          {year}年 {monthName}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2 font-bold text-warm-700 text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {days.map((day) => {
          const isClosed = isClosedDay(day);
          const specialDate = getSpecialDate(day);
          const dateLabel = `${year}年${month}月${day}日${specialDate ? `、${specialDate.label}` : ""}${isClosed ? "、休業日" : ""}`;
          const dateClassName = `aspect-square min-h-11 min-w-0 rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition-colors border-2 ${
            isClosed
              ? "bg-red-100 text-red-700 border-red-300"
              : specialDate
                ? getColorClasses(specialDate.color)
                : "bg-warm-50 text-warm-900 border-transparent hover:border-accent hover:bg-warm-100"
          }`;
          const dateContent = (
            <>
              <span>{day}</span>
              {(specialDate || isClosed) && (
                <span className="flex gap-0.5 text-xs mt-0.5" aria-hidden="true">
                  {specialDate && <span>{specialDate.emoji}</span>}
                  {isClosed && <span>休</span>}
                </span>
              )}
            </>
          );

          if (specialDate?.href) {
            return (
              <a
                key={day}
                href={specialDate.href}
                aria-label={dateLabel}
                title={dateLabel}
                className={`${dateClassName} hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700`}
              >
                {dateContent}
              </a>
            );
          }

          return (
            <div key={day} className={dateClassName} title={dateLabel}>
              {dateContent}
              {specialDate && <span className="sr-only">{specialDate.label}</span>}
              {isClosed && <span className="sr-only">休業日</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 px-2 sm:px-0 border-t border-warm-200 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-sm text-warm-700">営業していない日</span>
        </div>
        {specialDateLegends.map(([key, specialDate]) => {
          const datesLabel = `${month}/${specialDate.dates.sort((a, b) => a - b).join("・")}`;
          const legendContent = (
            <>
              <span
                className={`w-4 h-4 shrink-0 border-2 rounded ${getColorClasses(specialDate.color)}`}
                aria-hidden="true"
              />
              <span className="text-lg shrink-0" aria-hidden="true">
                {specialDate.emoji}
              </span>
              <span className="text-sm text-warm-700">
                {datesLabel} {specialDate.label}
              </span>
            </>
          );

          return specialDate.href ? (
            <a
              key={key}
              href={specialDate.href}
              className="flex items-center gap-2 min-h-11 rounded hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
            >
              {legendContent}
            </a>
          ) : (
            <div key={key} className="flex items-center gap-2">
              {legendContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
