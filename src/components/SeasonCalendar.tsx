import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import type { CalendarProps } from "@/components/ui/calendar";

const SEASON_START_MONTH = 3; // April
const SEASON_END_MONTH = 9; // October

const isInSeason = (d: Date) =>
  d.getMonth() >= SEASON_START_MONTH && d.getMonth() <= SEASON_END_MONTH;

/** Snap a month to the next valid season month (April–October). */
const snapToSeason = (d: Date, direction: "forward" | "backward" = "forward"): Date => {
  const month = d.getMonth();
  if (isInSeason(d)) return d;
  if (direction === "forward") {
    // Nov/Dec → April next year; Jan–March → April same year
    if (month > SEASON_END_MONTH) return new Date(d.getFullYear() + 1, SEASON_START_MONTH, 1);
    return new Date(d.getFullYear(), SEASON_START_MONTH, 1);
  }
  // backward: Nov/Dec → October same year; Jan–March → October previous year
  if (month > SEASON_END_MONTH) return new Date(d.getFullYear(), SEASON_END_MONTH, 1);
  return new Date(d.getFullYear() - 1, SEASON_END_MONTH, 1);
};

/**
 * Calendar that hides Nov–March entirely. Navigation buttons skip directly
 * from October to April of the next year (and vice versa).
 */
export function SeasonCalendar({ defaultMonth, ...props }: CalendarProps) {
  const initial = snapToSeason(defaultMonth ?? new Date(), "forward");
  const [month, setMonth] = useState<Date>(initial);

  // Keep displayed month in sync if parent updates defaultMonth (e.g. after
  // start date is selected and end picker opens).
  useEffect(() => {
    if (defaultMonth) setMonth(snapToSeason(defaultMonth, "forward"));
  }, [defaultMonth]);

  return (
    <Calendar
      {...props}
      month={month}
      onMonthChange={(m) => {
        if (isInSeason(m)) {
          setMonth(m);
          return;
        }
        // Determine direction by comparing to current month
        const direction = m.getTime() > month.getTime() ? "forward" : "backward";
        setMonth(snapToSeason(m, direction));
      }}
    />
  );
}
