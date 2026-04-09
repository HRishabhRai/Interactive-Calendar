import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { CalendarGrid } from "@/components/calendar-grid";
import { NotesSidebar } from "@/components/notes-sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";

const getMonthImage = (monthNum: number) => {
  const images = [
    import("@/assets/images/01-january.png"),
    import("@/assets/images/02-february.png"),
    import("@/assets/images/03-march.png"),
    import("@/assets/images/04-april.png"),
    import("@/assets/images/05-may.png"),
    import("@/assets/images/06-june.png"),
    import("@/assets/images/07-july.png"),
    import("@/assets/images/08-august.png"),
    import("@/assets/images/09-september.png"),
    import("@/assets/images/10-october.png"),
    import("@/assets/images/11-november.jpg"),
    import("@/assets/images/12-december.jpg"),
  ];
  return images[monthNum - 1];
};

export default function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const monthIndex = currentMonth.getMonth() + 1;
        const module = await getMonthImage(monthIndex);
        setCurrentImageSrc(module.default);
      } catch (e) {
        console.error("Failed to load month image", e);
      }
    };
    fetchImage();
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    if (selectionEnd && isSameDay(date, selectionEnd)) {
      setSelectionEnd(null);
      return;
    }
    if (selectionStart && isSameDay(date, selectionStart)) {
      if (selectionEnd) {
        setSelectionStart(selectionEnd);
        setSelectionEnd(null);
      } else {
        setSelectionStart(null);
      }
      return;
    }
    if (!selectionStart || selectionEnd) {
      setSelectionStart(date);
      setSelectionEnd(null);
    } else {
      if (date < selectionStart) {
        setSelectionEnd(selectionStart);
        setSelectionStart(date);
      } else {
        setSelectionEnd(date);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setHoveredDate(null);
  };

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center items-start lg:items-center p-0 lg:p-8 font-sans transition-colors duration-500">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-[1400px] min-h-[100dvh] lg:min-h-0 lg:h-[94vh] bg-card lg:rounded-[2rem] shadow-2xl flex flex-col lg:flex-row border-border/50 relative z-10 overflow-hidden">

        {/* ── PANEL 1: Notes Sidebar ── */}
        <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:h-full border-b lg:border-b-0 lg:border-r border-border/40 overflow-y-auto">
          <NotesSidebar
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
            onClearSelection={handleClearSelection}
          />
        </div>

        {/* ── PANEL 2: Hero Image + Calendar Grid ── */}
        <div className="flex-1 flex flex-col lg:h-full overflow-y-auto">

          {/* Hero banner with month/year + controls overlaid */}
          <div className="h-52 lg:h-64 w-full relative overflow-hidden shrink-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentMonth.toISOString()}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {currentImageSrc && (
                  <img
                    src={currentImageSrc}
                    alt={`Landscape for ${format(currentMonth, "MMMM")}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Gradient so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Month name + controls overlaid on image */}
            <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-5 flex items-end justify-between">
              <div>
                <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white drop-shadow-lg leading-none">
                  {format(currentMonth, "MMMM")}
                </h2>
                <p className="text-base lg:text-xl font-serif text-white/70 mt-1 ml-0.5">
                  {format(currentMonth, "yyyy")}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToday}
                  className="font-serif italic border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm h-8"
                >
                  Today
                </Button>
                <div className="flex items-center gap-0.5 border border-white/30 rounded-md p-0.5 bg-white/10 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="h-7 w-7 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="h-7 w-7 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8 rounded-full text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="p-4 lg:p-6">
            <CalendarGrid
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              selectionStart={selectionStart}
              selectionEnd={selectionEnd}
              onDateClick={handleDateClick}
              onDateHover={setHoveredDate}
              hoveredDate={hoveredDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}