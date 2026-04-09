// Indian National & Government Public Holidays

// Fixed-date national holidays (MM-DD) — same every year
const FIXED_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-14": "Makar Sankranti",
  "01-26": "Republic Day",
  "04-14": "Dr. Ambedkar Jayanti",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "12-25": "Christmas Day",
};

// Lunar/moveable holidays — hardcoded per year (YYYY-MM-DD)
const MOVEABLE_HOLIDAYS: Record<string, string> = {
  // ── 2025 ──
  "2025-02-26": "Maha Shivaratri",
  "2025-03-14": "Holi",
  "2025-03-31": "Eid ul-Fitr",
  "2025-04-06": "Ram Navami",
  "2025-04-10": "Mahavir Jayanti",
  "2025-04-18": "Good Friday",
  "2025-05-12": "Buddha Purnima",
  "2025-06-07": "Eid ul-Adha",
  "2025-07-06": "Muharram",
  "2025-08-16": "Janmashtami",
  "2025-09-05": "Milad-un-Nabi",
  "2025-10-02": "Dussehra",
  "2025-10-20": "Diwali",
  "2025-11-05": "Guru Nanak Jayanti",

  // ── 2026 ──
  "2026-02-15": "Maha Shivaratri",
  "2026-03-03": "Holi",
  "2026-03-20": "Eid ul-Fitr",
  "2026-03-27": "Ram Navami",
  "2026-04-01": "Mahavir Jayanti",
  "2026-04-03": "Good Friday",
  "2026-05-01": "Buddha Purnima",
  "2026-05-27": "Eid ul-Adha",
  "2026-06-26": "Muharram",
  "2026-08-05": "Janmashtami",
  "2026-08-25": "Milad-un-Nabi",
  "2026-10-08": "Dussehra",
  "2026-10-27": "Diwali",
  "2026-11-23": "Guru Nanak Jayanti",

  // ── 2027 ──
  "2027-02-04": "Maha Shivaratri",
  "2027-03-22": "Holi",
  "2027-03-09": "Eid ul-Fitr",
  "2027-04-15": "Ram Navami",
  "2027-04-19": "Mahavir Jayanti",
  "2027-03-26": "Good Friday",
  "2027-05-20": "Buddha Purnima",
  "2027-05-16": "Eid ul-Adha",
  "2027-08-25": "Janmashtami",
  "2027-10-21": "Dussehra",
  "2027-11-08": "Diwali",
  "2027-11-12": "Guru Nanak Jayanti",
};

export function getHoliday(date: Date): string | null {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const mmdd = `${month}-${day}`;
  const yyyymmdd = `${date.getFullYear()}-${mmdd}`;

  return FIXED_HOLIDAYS[mmdd] || MOVEABLE_HOLIDAYS[yyyymmdd] || null;
}
