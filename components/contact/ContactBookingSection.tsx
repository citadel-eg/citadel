"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import {
  ConfirmedBooking,
  DEFAULT_BUSINESS_DAYS,
  DateOption,
  generateUpcomingBusinessDays,
} from "@/components/schedule/types";
import { SessionPicker } from "@/components/schedule/SessionPicker";
import { BookingForm } from "@/components/schedule/BookingForm";
import { BookingConfirmed } from "@/components/schedule/BookingConfirmed";

export function ContactBookingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dateOptions, setDateOptions] = useState<DateOption[]>(
    DEFAULT_BUSINESS_DAYS,
  );
  const [selectedDate, setSelectedDate] = useState<DateOption>(
    DEFAULT_BUSINESS_DAYS[0],
  );
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const liveDays = generateUpcomingBusinessDays(5);
      setDateOptions(liveDays);
      setSelectedDate((prev) =>
        prev && liveDays.some((d) => d.rawDate === prev.rawDate)
          ? prev
          : liveDays[0],
      );

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
    } catch {
      // Ignore storage errors
    }
  };

  const handleBookAnother = () => {
    setConfirmedBooking(null);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setNotes("");
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
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.fromTo(
          "[data-animate='booking-card']",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: motion.ease.out },
          0,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="booking-container"
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      {/* Dual Form Card Container matching Figma Node 89:2 */}
      <div
        data-animate="booking-card"
        className="border border-white/20 rounded-md overflow-hidden grid grid-cols-1 lg:grid-cols-12  shadow-[0_0_40px_rgba(0,0,0,0.4)]"
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
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-8  h-full">
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
    </section>
  );
}
