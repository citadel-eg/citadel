"use client";

import React, { useMemo } from "react";
import {
  CalendarDay,
  DateOption,
  MONTH_NAMES,
  WEEKDAYS,
  getCalendarDays,
  parseCustomDate,
} from "./types";

interface CalendarPickerProps {
  selectedDate: DateOption;
  onSelectDate: (date: DateOption) => void;
  minDateStr: string;
  viewMonth: number;
  viewYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarPicker({
  selectedDate,
  onSelectDate,
  minDateStr,
  viewMonth,
  viewYear,
  onPrevMonth,
  onNextMonth,
}: CalendarPickerProps) {
  const calendarDays = useMemo(() => {
    return getCalendarDays(viewYear, viewMonth);
  }, [viewYear, viewMonth]);

  const handleSelectDay = (dayItem: CalendarDay) => {
    if (dayItem.rawDate < minDateStr) return;
    const dateObj = parseCustomDate(dayItem.rawDate);
    onSelectDate(dateObj);
  };

  return (
    <div className="border border-brand/40 rounded-sm p-4 sm:p-5 space-y-3.5 shadow-[0_0_25px_rgba(196,162,84,0.12)]">
      {/* Calendar Month Navigation Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-sm border border-white/20 bg-[#05070a] text-white/80 hover:text-white hover:border-brand/60 transition-colors cursor-pointer text-sm font-mono active:scale-95"
            aria-label="Previous Month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-sm border border-white/20 bg-[#05070a] text-white/80 hover:text-white hover:border-brand/60 transition-colors cursor-pointer text-sm font-mono active:scale-95"
            aria-label="Next Month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-[11px] font-mono uppercase font-semibold text-white/40 py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* 7-Column Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {calendarDays.map((item, idx) => {
          const isSelected = selectedDate.rawDate === item.rawDate;
          const isPast = item.rawDate < minDateStr;
          const isCurrentMonth = item.isCurrentMonth;
          const isToday = item.rawDate === minDateStr;

          return (
            <button
              key={`${item.rawDate}-${idx}`}
              type="button"
              disabled={isPast}
              onClick={() => handleSelectDay(item)}
              className={`h-8 sm:h-9 flex flex-col items-center justify-center rounded-sm text-xs font-mono transition-all duration-150 relative cursor-pointer active:scale-95 ${
                isSelected
                  ? "bg-brand text-[#1C2633] font-bold shadow-[0_0_12px_rgba(196,162,84,0.35)] scale-105 z-10"
                  : isPast
                    ? "text-white/15 cursor-not-allowed opacity-25"
                    : !isCurrentMonth
                      ? "text-white/25 hover:text-white/60 hover:bg-white/5"
                      : "text-white/90 hover:bg-white/10 hover:text-white border border-transparent hover:border-brand/40"
              }`}
            >
              <span>{item.dayNum}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-brand absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Indicator */}
      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
        <span className="text-white/40 tracking-wider uppercase">CHOSEN:</span>
        <span className="text-white font-bold tracking-wide">
          {selectedDate.fullDisplay}
        </span>
      </div>
    </div>
  );
}
