"use client";

import React from "react";
import { DateOption } from "./types";

interface BookingFormProps {
  selectedDate: DateOption;
  selectedTime: string;
  name: string;
  setName: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BookingForm({
  selectedDate,
  selectedTime,
  name,
  setName,
  company,
  setCompany,
  email,
  setEmail,
  phone,
  setPhone,
  notes,
  setNotes,
  onSubmit,
}: BookingFormProps) {
  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      {/* Top Header & Selected Session Summary */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
            02 / YOUR DETAILS
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1.5 sm:mt-2">
            Tell us about your business
          </h3>
        </div>

        {/* Selected Slot Interactive Badge */}
        <div className="bg-[#05070a] border border-white/15 rounded-sm p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                SELECTED CONSULTATION
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white font-mono block">
                {selectedDate.fullDisplay}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-xs shrink-0 self-start sm:self-auto">
            {selectedTime} (Cairo)
          </span>
        </div>
      </div>

      {/* Main Form Inputs */}
      <form
        onSubmit={onSubmit}
        suppressHydrationWarning
        className="space-y-4 flex flex-col justify-between flex-1"
      >
        <div className="space-y-3.5 flex flex-col flex-1">
          {/* Row 1: Name & Business */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 shrink-0">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">
                Your Name *
              </label>
              <input
                type="text"
                required
                suppressHydrationWarning
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adel Yasser"
                className="w-full bg-[#05070a] border border-white/20 rounded-sm px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand hover:border-white/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">
                Business / Company *
              </label>
              <input
                type="text"
                required
                suppressHydrationWarning
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="w-full bg-[#05070a] border border-white/20 rounded-sm px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand hover:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 shrink-0">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">
                Work Email *
              </label>
              <input
                type="email"
                required
                suppressHydrationWarning
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adel@company.com"
                className="w-full bg-[#05070a] border border-white/20 rounded-sm px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand hover:border-white/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                suppressHydrationWarning
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full bg-[#05070a] border border-white/20 rounded-sm px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand hover:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Notes / Message - Stretches to fill rest of card height */}
          <div className="space-y-1.5 flex flex-col flex-1">
            <label className="text-xs font-medium text-white/70 shrink-0">
              Brief overview of what you want to solve (Optional)
            </label>
            <textarea
              value={notes}
              suppressHydrationWarning
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. We have manual dispatch bottlenecks across multiple branches..."
              className="w-full flex-1 min-h-22.5 bg-[#05070a] border border-white/20 rounded-sm px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand hover:border-white/30 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Submit Button & Subtext */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-brand hover:bg-brand/90 text-[#1C2633] font-semibold text-xs sm:text-sm tracking-[2px] uppercase py-3.5 rounded-sm transition-all duration-200 shadow-[0_0_20px_rgba(196,162,84,0.2)] hover:shadow-[0_0_30px_rgba(196,162,84,0.4)] cursor-pointer active:scale-[0.99]"
          >
            <span>REQUEST APPOINTMENT</span>
            <span className="text-base leading-none">↗</span>
          </button>
          <p className="text-[11px] text-white/40 font-mono text-center">
            Direct 1-on-1 consultation · Subject to Adel&apos;s review &amp; confirmation
          </p>
        </div>
      </form>

      {/* Symmetrical Bottom Metadata Bar */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="text-white/40 tracking-[2px] uppercase">
          APPROVAL PROCESS
        </span>
        <span className="text-white font-semibold tracking-wider">
          Reviewed &amp; Confirmed via WhatsApp
        </span>
      </div>
    </div>
  );
}
