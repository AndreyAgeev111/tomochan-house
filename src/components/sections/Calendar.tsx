import React from "react";

interface CalendarProps {
  month: number;
  year: number;
  closedDates: number[];
  specialDates?: Array<{ date: number; label: string; emoji: string }>;
}

export default function Calendar({ month, year, closedDates, specialDates = [] }: CalendarProps) {
  // Get first day of month and total days
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create array of calendar days
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-warm-900">
          {year}年 {monthName}
        </h3>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2 font-bold text-warm-700 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const isClosed = isClosedDay(day);
          const specialDate = getSpecialDate(day);

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition-all ${
                isClosed
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-warm-50 text-warm-900 border-2 border-transparent hover:border-accent-DEFAULT hover:bg-warm-100"
              }`}
            >
              <div>{day}</div>
              {specialDate && <div className="text-xs mt-0.5">{specialDate.emoji}</div>}
              {isClosed && <div className="text-xs mt-0.5">休</div>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-warm-200 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-sm text-warm-700">営業していない日</span>
        </div>
        {specialDates.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="text-lg">{specialDates[0].emoji}</div>
            <span className="text-sm text-warm-700">{specialDates[0].label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
