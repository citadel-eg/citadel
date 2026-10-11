"use client";

import React, { useState } from "react";

const availableDates = [
  { day: "Mon", date: "5", month: "Oct" },
  { day: "Tue", date: "6", month: "Oct" },
  { day: "Wed", date: "7", month: "Oct" },
  { day: "Thu", date: "8", month: "Oct" },
  { day: "Fri", date: "9", month: "Oct" },
];

const availableTimes = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
];

export function ScheduleConversation() {
  const [selectedDate, setSelectedDate] = useState("7");
  const [selectedTime, setSelectedTime] = useState("11:30 AM");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="schedule" className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white font-mono">
            08
          </span>
          <span className="w-10 h-[1px] bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            Schedule a conversation
          </span>
        </div>

        {/* Dual Form Card */}
        <div className="border border-white/15 rounded-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#070b12]">
          {/* Left Column: Date & Time Picker */}
          <div className="lg:col-span-6 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/15 flex flex-col justify-between space-y-10">
            <div className="space-y-8">
              <div>
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                  01 / DATE &amp; TIME
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2">
                  Schedule a conversation
                </h3>
                <p className="text-sm sm:text-base text-white/60 font-normal mt-2">
                  Choose a convenient date and time for a first conversation with our team.
                </p>
              </div>

              {/* Date Selector */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono">
                  Date
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.date;
                    return (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => setSelectedDate(item.date)}
                        className={`flex flex-col items-center justify-center py-4 rounded-sm border transition-all duration-200 ${
                          isSelected
                            ? "bg-brand text-[#1C2633] border-brand shadow-sm font-semibold"
                            : "bg-[#090e17] text-white/70 border-white/15 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        <span className="text-[11px] font-medium uppercase tracking-wider">
                          {item.day}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold my-1 font-mono">
                          {item.date}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider">
                          {item.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selector */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono">
                  Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableTimes.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-sm border text-xs sm:text-sm font-mono transition-all duration-200 ${
                          isSelected
                            ? "bg-brand text-[#1C2633] border-brand font-bold shadow-sm"
                            : "bg-[#090e17] text-white/70 border-white/15 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timezone bar */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/40 tracking-[2px] uppercase">TIME ZONE</span>
              <span className="text-white font-semibold tracking-wider">Africa/Cairo</span>
            </div>
          </div>

          {/* Right Column: User Information Form */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-8 bg-[#080d16]">
            <div>
              <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                02 / YOUR INFORMATION
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2">
                Tell us about your business
              </h3>
              <p className="text-xs sm:text-sm text-white/50 font-normal mt-2">
                We&apos;ll use your information only to follow up about your request.
              </p>

              {formSubmitted ? (
                <div className="p-8 my-8 border border-brand/50 bg-brand/10 rounded-sm text-center space-y-3">
                  <span className="text-brand font-semibold text-base block font-mono">
                    REQUEST RECEIVED
                  </span>
                  <p className="text-sm text-white/80">
                    Thank you. We have penciled in <strong>{selectedDate} Oct at {selectedTime} (Africa/Cairo)</strong>. Our team will follow up via email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                  {/* Row 1: Name & Business */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-[#05070a] border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Business / Company</label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Corp"
                        className="w-full bg-[#05070a] border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full bg-[#05070a] border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Phone</label>
                      <input
                        type="tel"
                        placeholder="+20 100 000 0000"
                        className="w-full bg-[#05070a] border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand transition-colors"
                      />
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70">
                      Tell us briefly about your problem
                    </label>
                    <textarea
                      rows={4}
                      placeholder="What would you like to solve or improve?"
                      className="w-full bg-[#05070a] border border-white/20 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-brand focus:border-brand transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 bg-brand hover:bg-brand/90 text-[#1C2633] font-semibold text-xs sm:text-sm tracking-[2px] uppercase py-4 rounded-sm transition-colors shadow-sm cursor-pointer"
                    >
                      <span>SCHEDULE CONVERSATION</span>
                      <span className="text-base leading-none">↗</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
