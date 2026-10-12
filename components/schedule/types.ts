export interface DateOption {
  dayName: string;
  dateNum: string;
  monthName: string;
  fullYear: number;
  fullDisplay: string;
  rawDate: string; // YYYY-MM-DD
}

export interface CalendarDay {
  dayNum: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  rawDate: string;
}

export interface ConfirmedBooking {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  dateDisplay: string;
  rawDate?: string;
  timeSlot: string;
  createdAt: string;
}

export const availableTimes = [
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Host configuration for direct client appointment sync
export const HOST_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_HOST_WHATSAPP ||
  process.env.NEXT_PUBLIC_HOST_WHATSAPP_NUMBER ||
  process.env.HOST_WHATSAPP_NUMBER ||
  "201000000000";

export const HOST_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_HOST_EMAIL ||
  process.env.NEXT_PUBLIC_HOST_CONTACT_EMAIL ||
  process.env.HOST_CONTACT_EMAIL ||
  "adel@citadel.systems";

// Static fallback dates for safe SSR/prerender
export const DEFAULT_BUSINESS_DAYS: DateOption[] = [
  { dayName: "Sun", dateNum: "18", monthName: "Oct", fullYear: 2026, fullDisplay: "Sun, 18 Oct 2026", rawDate: "2026-10-18" },
  { dayName: "Mon", dateNum: "19", monthName: "Oct", fullYear: 2026, fullDisplay: "Mon, 19 Oct 2026", rawDate: "2026-10-19" },
  { dayName: "Tue", dateNum: "20", monthName: "Oct", fullYear: 2026, fullDisplay: "Tue, 20 Oct 2026", rawDate: "2026-10-20" },
  { dayName: "Wed", dateNum: "21", monthName: "Oct", fullYear: 2026, fullDisplay: "Wed, 21 Oct 2026", rawDate: "2026-10-21" },
  { dayName: "Thu", dateNum: "22", monthName: "Oct", fullYear: 2026, fullDisplay: "Thu, 22 Oct 2026", rawDate: "2026-10-22" },
];

export function generateUpcomingBusinessDays(count: number = 5): DateOption[] {
  const days: DateOption[] = [];
  const now = new Date();
  const current = new Date(now);
  current.setDate(current.getDate() + 1); // Start from tomorrow

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  while (days.length < count) {
    const dayOfWeek = current.getDay();
    // Exclude Friday (5) & Saturday (6) - standard Egyptian / Middle East business week
    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const date = String(current.getDate()).padStart(2, "0");

      days.push({
        dayName: dayNames[dayOfWeek],
        dateNum: current.getDate().toString(),
        monthName: monthNames[current.getMonth()],
        fullYear: year,
        fullDisplay: `${dayNames[dayOfWeek]}, ${current.getDate()} ${monthNames[current.getMonth()]} ${year}`,
        rawDate: `${year}-${month}-${date}`,
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  // Tail of previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const mStr = String(prevMonth + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    days.push({
      dayNum: d,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      rawDate: `${prevYear}-${mStr}-${dStr}`,
    });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    days.push({
      dayNum: d,
      month,
      year,
      isCurrentMonth: true,
      rawDate: `${year}-${mStr}-${dStr}`,
    });
  }

  // Head of next month (grid 35 or 42 cells)
  const totalCells = days.length <= 35 ? 35 : 42;
  const remaining = totalCells - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const mStr = String(nextMonth + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    days.push({
      dayNum: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      rawDate: `${nextYear}-${mStr}-${dStr}`,
    });
  }

  return days;
}

export function parseCustomDate(dateStr: string): DateOption {
  if (!dateStr) return DEFAULT_BUSINESS_DAYS[0];
  const parts = dateStr.split("-");
  if (parts.length !== 3) return DEFAULT_BUSINESS_DAYS[0];
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = d.getDay();
  return {
    dayName: dayNames[dayOfWeek] || "Day",
    dateNum: String(day),
    monthName: monthNames[month] || "",
    fullYear: year,
    fullDisplay: `${dayNames[dayOfWeek] || ""}, ${day} ${monthNames[month] || ""} ${year}`,
    rawDate: dateStr,
  };
}
