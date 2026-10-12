"use client";

import React from "react";
import {
  ConfirmedBooking,
  HOST_CONTACT_EMAIL,
  HOST_WHATSAPP_NUMBER,
} from "./types";

interface BookingConfirmedProps {
  booking: ConfirmedBooking;
  onBookAnother: () => void;
}

export function BookingConfirmed({
  booking,
  onBookAnother,
}: BookingConfirmedProps) {
  // Helper to construct exact ISO timestamps for Cairo timezone
  const getCalendarStamps = () => {
    let datePart = "";
    if (booking.rawDate && /^\d{4}-\d{2}-\d{2}$/.test(booking.rawDate)) {
      datePart = booking.rawDate.replace(/-/g, "");
    } else {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      datePart = `${y}${m}${day}`;
    }

    let hour = 11;
    let minute = 30;
    if (booking.timeSlot) {
      const match = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        hour = parseInt(match[1], 10);
        minute = parseInt(match[2], 10);
        const isPM = match[3].toUpperCase() === "PM";
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
      }
    }

    const startHourStr = String(hour).padStart(2, "0");
    const startMinStr = String(minute).padStart(2, "0");

    let endHour = hour;
    let endMinute = minute + 30;
    if (endMinute >= 60) {
      endMinute -= 60;
      endHour = (endHour + 1) % 24;
    }
    const endHourStr = String(endHour).padStart(2, "0");
    const endMinStr = String(endMinute).padStart(2, "0");

    return {
      startStamp: `${datePart}T${startHourStr}${startMinStr}00`,
      endStamp: `${datePart}T${endHourStr}${endMinStr}00`,
    };
  };

  // One-click Google Calendar Link (Tentative Hold - Clean Template Format)
  const getGoogleCalendarUrl = () => {
    const { startStamp, endStamp } = getCalendarStamps();
    const title = encodeURIComponent(
      `[Pending Confirmation] Citadel Discovery Call / ${booking.company}`,
    );
    const details = encodeURIComponent(
      `Discovery Consultation Request with Citadel Smart Solutions.\n\nStatus: Pending Adel's review & confirmation.\nAttendee: ${booking.name} (${booking.company})\nEmail: ${booking.email}\nPhone: ${booking.phone}\nNotes: ${booking.notes || "None provided"}\n\nTimezone: Africa/Cairo (UTC+2)\nMeeting format: Google Meet (link sent upon host acceptance).\nHost Contact: ${HOST_CONTACT_EMAIL}`,
    );
    const location = encodeURIComponent("Google Meet (Video Consultation)");

    // Properly formatted Google Calendar URL with dates and NO unsupported 'add=' parameter
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStamp}/${endStamp}&ctz=Africa/Cairo&details=${details}&location=${location}`;
  };

  // One-click .ICS file download (RFC 5545 Tentative Status)
  const handleDownloadIcs = () => {
    const { startStamp, endStamp } = getCalendarStamps();
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Citadel Smart Solutions//Booking System//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${booking.id}@citadel.smartsolutions`,
      `DTSTART;TZID=Africa/Cairo:${startStamp}`,
      `DTEND;TZID=Africa/Cairo:${endStamp}`,
      `ORGANIZER;CN=Adel Yasser (Citadel):mailto:${HOST_CONTACT_EMAIL}`,
      `ATTENDEE;CN=${booking.name}:mailto:${booking.email}`,
      `SUMMARY:[Tentative] Citadel Discovery Call / ${booking.company}`,
      `DESCRIPTION:Discovery consultation request with Citadel Smart Solutions for ${booking.name} (${booking.company}). Status: Pending host acceptance.`,
      "LOCATION:Google Meet Video Call",
      "STATUS:TENTATIVE",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `citadel-appointment-request-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Direct WhatsApp instant notification message
  const getWhatsAppConfirmationUrl = () => {
    const lines = [
      "Hello Adel, I would like to request a discovery appointment with Citadel:",
      "",
      `*Requested Date:* ${booking.dateDisplay}`,
      `*Requested Time:* ${booking.timeSlot} (Cairo Time)`,
      `*Client:* ${booking.name} (${booking.company})`,
      `*Email:* ${booking.email}`,
      `*Phone:* ${booking.phone}`,
    ];

    if (booking.notes && booking.notes.trim()) {
      lines.push(`*Overview:* ${booking.notes.trim()}`);
    }

    lines.push(
      "",
      `*Ref:* #${booking.id}`,
      "",
      "Please let me know if this time slot works for you!",
    );

    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${HOST_WHATSAPP_NUMBER}?text=${text}`;
  };

  // Direct Email notification draft
  const getEmailConfirmationUrl = () => {
    const subject = encodeURIComponent(
      `Appointment Request [#${booking.id}]: ${booking.company} - ${booking.dateDisplay} (Pending Review)`,
    );
    const lines = [
      "Hi Adel,",
      "",
      "I would like to request a discovery consultation with Citadel Smart Solutions:",
      "",
      `Requested Date: ${booking.dateDisplay}`,
      `Requested Time: ${booking.timeSlot} (Cairo Time)`,
      `Client: ${booking.name} (${booking.company})`,
      `Email: ${booking.email}`,
      `Phone: ${booking.phone}`,
    ];

    if (booking.notes && booking.notes.trim()) {
      lines.push(`Overview: ${booking.notes.trim()}`);
    }

    lines.push(
      "",
      `Request ID: #${booking.id}`,
      "",
      "Please let me know if this slot works for your schedule.",
    );

    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${HOST_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 my-auto">
      <div className="border border-brand/40 bg-brand/10 p-6 sm:p-8 rounded-sm space-y-4 shadow-[0_0_30px_rgba(196,162,84,0.12)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-[2px] uppercase text-brand font-bold">
            ✓ REQUEST SUBMITTED · PENDING CONFIRMATION
          </span>
          <span className="text-xs font-mono text-white/60">
            ID: {booking.id}
          </span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Request Received for {booking.dateDisplay}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
            Adel reviews all incoming sessions to confirm availability and fit. You will receive your Google Meet link upon confirmation.
          </p>
        </div>

        <div className="space-y-2 py-3 border-y border-white/15 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/50 font-mono text-xs">REQUESTED TIME:</span>
            <span className="text-white font-semibold font-mono">
              {booking.timeSlot} (Cairo Time)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50 font-mono text-xs">ATTENDEE:</span>
            <span className="text-white font-medium">
              {booking.name} ({booking.company})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50 font-mono text-xs">STATUS:</span>
            <span className="text-brand font-mono text-xs font-semibold bg-brand/15 px-2 py-0.5 rounded-xs border border-brand/30">
              Pending Host Review (Reply within 2–4 hrs)
            </span>
          </div>
        </div>

        {/* Direct Contact & Sync Actions */}
        <div className="pt-2 space-y-3">
          <span className="text-xs font-mono text-white/50 block">
            CONFIRM WITH ADEL (FASTEST RESPONSE):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={getWhatsAppConfirmationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand/90 text-[#1C2633] font-semibold text-xs tracking-[1.5px] uppercase rounded-sm transition-colors shadow-sm"
            >
              <span>SEND REQUEST ON WHATSAPP</span>
              <span>↗</span>
            </a>
            <a
              href={getEmailConfirmationUrl()}
              className="flex items-center justify-center gap-2 py-3.5 bg-[#0a0f18] hover:bg-white/10 text-white border border-white/20 hover:border-brand font-semibold text-xs tracking-[1.5px] uppercase rounded-sm transition-colors font-mono"
            >
              <span>NOTIFY VIA EMAIL</span>
              <span>↗</span>
            </a>
          </div>

          <span className="text-xs font-mono text-white/50 block pt-1">
            SAVE TENTATIVE HOLD TO CALENDAR:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0a0f18] hover:bg-white/10 text-white border border-white/20 hover:border-brand rounded-sm text-xs font-mono font-semibold transition-all duration-200"
            >
              <span>Google Calendar</span>
              <span>↗</span>
            </a>
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0a0f18] hover:bg-white/10 text-white border border-white/20 hover:border-brand rounded-sm text-xs font-mono font-semibold transition-all duration-200 cursor-pointer"
            >
              <span>Download (.ics)</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBookAnother}
          className="text-xs text-white/50 hover:text-white font-mono tracking-wider underline cursor-pointer transition-colors"
        >
          Need to change? Request another slot
        </button>
      </div>
    </div>
  );
}
