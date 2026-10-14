"use client";

import React from "react";
import { DateOption, availableTimes } from "./types";
import { CalendarPicker } from "./CalendarPicker";

interface SessionPickerProps {
  dateOptions: DateOption[];
  selectedDate: DateOption;
  onSelectDate: (date: DateOption) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  isCustomDate: boolean;
  onToggleCustomDate: () => void;
  minDateStr: string;
  viewMonth: number;
  viewYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function SessionPicker({
  dateOptions,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  isCustomDate,
  onToggleCustomDate,
  minDateStr,
  viewMonth,
  viewYear,
  onPrevMonth,
  onNextMonth,
}: SessionPickerProps) {
  return (
    <div className="p-6 sm:p-10 flex flex-col justify-between space-y-8 h-full">
      <div className="space-y-8">
        {/* Step Header */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
              01 / DATE &amp; TIME
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            Select Your Session
          </h3>
          <p className="text-sm text-white/60 font-normal mt-2">
            Choose a convenient date and time for a 1-on-1 strategy consultation
            with our systems engineering team.
          </p>
        </div>

        {/* Date Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono">
              {isCustomDate ? "Custom Consultation Date" : "Available Days"}
            </label>
            <button
              type="button"
              onClick={onToggleCustomDate}
              className="text-[11px] font-mono text-white hover:text-brand flex items-center gap-1 py-2 px-4 border border-brand/20 rounded-sm font-semibold hover:border-brand hover:bg-[#0c1422] transition-all duration-300 shadow-[0_0_20px_rgba(196,162,84,0.12)] cursor-pointer"
            >
              {isCustomDate ? (
                <span>← Back to quick 5 days</span>
              ) : (
                <span>Not suitable? Pick a date →</span>
              )}
            </button>
          </div>

          {isCustomDate ? (
            /* Custom Shadcn-Style Interactive Calendar */
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
              minDateStr={minDateStr}
              viewMonth={viewMonth}
              viewYear={viewYear}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
            />
          ) : (
            /* Default 5 Days Quick Grid */
            <div className="grid grid-cols-5 gap-2">
              {dateOptions.map((item) => {
                const isSelected = selectedDate.rawDate === item.rawDate;
                return (
                  <button
                    key={item.rawDate}
                    type="button"
                    onClick={() => onSelectDate(item)}
                    className={`flex flex-col items-center justify-center py-4 sm:py-4.5 rounded-sm border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? "bg-brand text-[#1C2633] border-brand shadow-[0_0_15px_rgba(196,162,84,0.3)] font-semibold"
                        : " text-white/70 border-white/15 hover:border-brand/50 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      {item.dayName}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold my-1 font-mono">
                      {item.dateNum}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider">
                      {item.monthName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Time Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono">
            Time Slot (Cairo Time)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableTimes.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelectTime(time)}
                  className={`py-3.5 px-3.5 rounded-sm border text-xs sm:text-sm font-mono transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    isSelected
                      ? "bg-brand text-[#1C2633] border-brand font-bold shadow-[0_0_15px_rgba(196,162,84,0.25)]"
                      : " text-white/70 border-white/15 hover:border-brand/50 hover:text-white"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timezone & Location Bar */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="text-white/40 tracking-[2px] uppercase">
          LOCATION &amp; TIME ZONE
        </span>
        <span className="text-white font-semibold tracking-wider">
          Google Meet · Africa/Cairo (UTC+2)
        </span>
      </div>
    </div>
  );
}
