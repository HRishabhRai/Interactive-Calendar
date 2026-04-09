import { useState } from "react";
import {
  format, isSameDay, isSameMonth,
  startOfWeek, endOfWeek, eachDayOfInterval,
  startOfMonth, endOfMonth, isToday,
} from "date-fns";
import { getHoliday } from "@/lib/holidays";
import { AnimatePresence, motion } from "framer-motion";

interface CalendarGridProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  hoveredDate: Date | null;
}

const ROW_HEIGHT = 72; // px — each week row, adjust if needed

export function CalendarGrid({
  currentMonth,
  onMonthChange,
  selectionStart,
  selectionEnd,
  onDateClick,
  onDateHover,
  hoveredDate,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const [direction, setDirection] = useState(0);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const numRows = Math.ceil(days.length / 7);
  // Week starts Monday; Sunday is last
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const isSelected = (day: Date) => {
    if (!selectionStart) return false;
    if (selectionEnd) return day >= selectionStart && day <= selectionEnd;
    return isSameDay(day, selectionStart);
  };

  const isHoverRange = (day: Date) => {
    if (!hoveredDate) return false;
    return isSameDay(day, hoveredDate);
  };

  const isRangeStart = (day: Date) => selectionStart ? isSameDay(day, selectionStart) : false;
  const isRangeEnd = (day: Date) => selectionEnd ? isSameDay(day, selectionEnd) : false;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  };

  return (
    <div className="w-full bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">

      {/* ── Day-of-week labels ── */}
      <div className="grid grid-cols-7 px-3 lg:px-5 pt-3 pb-1">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={[
              "text-center text-[10px] lg:text-xs font-semibold uppercase tracking-widest",
              idx === 6
                ? "text-rose-500 dark:text-rose-400"   // Sun (last column)
                : idx === 5
                ? "text-rose-500 dark:text-rose-400"   // Sat
                : "text-muted-foreground",
            ].join(" ")}
          >
            {day}
          </div>
        ))}
      </div>

      {/* ── Calendar day grid — natural height, never clipped ── */}
      {/* Wrapper has explicit height = numRows × ROW_HEIGHT so AnimatePresence doesn't collapse */}
      <div
        className="relative overflow-hidden mx-3 lg:mx-5 mb-4"
        style={{ height: numRows * ROW_HEIGHT }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 35 },
              opacity: { duration: 0.15 },
            }}
            className="absolute inset-0 grid grid-cols-7"
            style={{ gridTemplateRows: `repeat(${numRows}, ${ROW_HEIGHT}px)` }}
          >
            {days.map((day) => {
              const holiday = getHoliday(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const selected = isSelected(day);
              const hoverRange = isHoverRange(day);
              const isStart = isRangeStart(day);
              const isEnd = isRangeEnd(day);
              const today = isToday(day);
              const dayOfWeek = day.getDay(); // 0 = Sunday, 6 = Saturday
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <div
                  key={day.toString()}
                  className={[
                    "relative flex flex-col items-center p-1.5 lg:p-2 cursor-pointer transition-colors duration-150",
                    "border-t-2",
                    isCurrentMonth
                      ? "border-border/25 hover:border-primary/40"
                      : "border-transparent",
                    selected && !isStart && !isEnd ? "bg-primary/8" : "",
                    hoverRange && !selected ? "bg-primary/5" : "",
                  ].join(" ")}
                  onClick={() => onDateClick(day)}
                  onMouseEnter={() => onDateHover(day)}
                  onMouseLeave={() => onDateHover(null)}
                  data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                >
                  {/* Range fill */}
                  {selected && (
                    <div
                      className={[
                        "absolute inset-0 bg-primary/12 -z-10",
                        isStart ? "rounded-l-md" : "",
                        isEnd ? "rounded-r-md" : "",
                      ].join(" ")}
                    />
                  )}

                  {/* Hover dashed outline */}
                  {hoverRange && !selected && (
                    <div className="absolute inset-0 border border-dashed border-primary/30 rounded-sm -z-10" />
                  )}

                  {/* Date number */}
                  <div
                    className={[
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm lg:text-base font-display transition-transform duration-100",
                      // Not in current month → always dim
                      !isCurrentMonth
                        ? "text-muted-foreground/25"
                        // Selected start/end → white on primary background
                        : (isStart || isEnd) && selected
                        ? "bg-primary text-primary-foreground shadow font-semibold scale-110"
                        // Today (unselected) → primary ring
                        : today
                        ? "text-primary font-bold ring-2 ring-primary/30"
                        // Holiday → always red (overrides Saturday blue)
                        : holiday
                        ? "text-rose-500 dark:text-rose-400 font-semibold"
                        // Sunday → red
                        : isSunday
                        ? "text-rose-500 dark:text-rose-400"
                        // Saturday → red
                        : isSaturday
                        ? "text-rose-500 dark:text-rose-400"
                        // Weekday → default
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                  </div>

                  {/* Holiday label */}
                  {holiday && isCurrentMonth && (
                    <div className="mt-auto flex flex-col items-center">
                      <p className="text-[9px] leading-tight text-rose-500/80 dark:text-rose-400/80 font-medium truncate text-center">
                        {holiday}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-rose-500/60 mt-0.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
