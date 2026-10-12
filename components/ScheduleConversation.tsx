"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  ConfirmedBooking,
  DEFAULT_BUSINESS_DAYS,
  DateOption,
  generateUpcomingBusinessDays,
} from "./schedule/types";
import { SessionPicker } from "./schedule/SessionPicker";
import { BookingForm } from "./schedule/BookingForm";
import { BookingConfirmed } from "./schedule/BookingConfirmed";

export function ScheduleConversation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dateOptions, setDateOptions] =
    useState<DateOption[]>(DEFAULT_BUSINESS_DAYS);
  const [selectedDate, setSelectedDate] =
    useState<DateOption>(DEFAULT_BUSINESS_DAYS[0]);
  const [selectedTime, setSelectedTime] = useState<string>("11:30 AM");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [minDateStr, setMinDateStr] = useState<string>("2026-10-13");
  const [viewMonth, setViewMonth] = useState<number>(9); // Oct default for SSR
  const [viewYear, setViewYear] = useState<number>(2026);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBooking | null>(null);

  // Compute live client business days, min selectable date, and calendar view safely
  useEffect(() => {
    const timer = setTimeout(() => {
      const liveDays = generateUpcomingBusinessDays(5);
      setDateOptions(liveDays);
      setSelectedDate((prev) => (prev && liveDays.some((d) => d.rawDate === prev.rawDate) ? prev : liveDays[0]));

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const y = tomorrow.getFullYear();
      const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const d = String(tomorrow.getDate()).padStart(2, "0");
      setMinDateStr(`${y}-${m}-${d}`);
      setViewMonth(tomorrow.getMonth());
      setViewYear(tomorrow.getFullYear());

      try {
        const saved = localStorage.getItem("citadel_confirmed_appointment");
        if (saved) {
          setConfirmedBooking(JSON.parse(saved));
        }
      } catch {
        // Ignore localStorage errors
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const booking: ConfirmedBooking = {
      id: `CIT-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      dateDisplay: selectedDate.fullDisplay,
      rawDate: selectedDate.rawDate,
      timeSlot: selectedTime,
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(booking);
    try {
      localStorage.setItem(
        "citadel_confirmed_appointment",
        JSON.stringify(booking),
      );
      // Also append to local appointment logs
      const pastAppointments = JSON.parse(
        localStorage.getItem("citadel_appointments_history") || "[]",
      );
      pastAppointments.unshift(booking);
      localStorage.setItem(
        "citadel_appointments_history",
        JSON.stringify(pastAppointments.slice(0, 10)),
      );
    } catch {
      // Ignore localStorage restrictions
    }
  };

  const handleBookAnother = () => {
    setConfirmedBooking(null);
    try {
      localStorage.removeItem("citadel_confirmed_appointment");
    } catch {
      // Ignore
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-animate='schedule-card']", {
          opacity: 0,
          y: 24,
          scale: 0.99,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        });

        // 1. Header marker
        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          0,
        );
        tl.fromTo(
          "[data-animate='header-line']",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.28, ease: "power2.out" },
          0.02,
        );
        tl.fromTo(
          "[data-animate='header-title']",
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          0.04,
        );

        // 2. Schedule Card entrance
        tl.to(
          "[data-animate='schedule-card']",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
          },
          0.08,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          "[data-animate]",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            stagger: 0.03,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="schedule"
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            08
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            Schedule a conversation
          </span>
        </div>

        {/* Dual Form Card Container */}
        <div
          data-animate="schedule-card"
          className="border border-white/15 rounded-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#070b12] opacity-0 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        >
          {/* Left Column: Date & Time Picker */}
          <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-white/15">
            <SessionPicker
              dateOptions={dateOptions}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              isCustomDate={isCustomDate}
              onToggleCustomDate={() => setIsCustomDate(!isCustomDate)}
              minDateStr={minDateStr}
              viewMonth={viewMonth}
              viewYear={viewYear}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </div>

          {/* Right Column: User Information Form or Confirmed State */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-8 bg-[#080d16] h-full">
            {confirmedBooking ? (
              <BookingConfirmed
                booking={confirmedBooking}
                onBookAnother={handleBookAnother}
              />
            ) : (
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                name={name}
                setName={setName}
                company={company}
                setCompany={setCompany}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                notes={notes}
                setNotes={setNotes}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
