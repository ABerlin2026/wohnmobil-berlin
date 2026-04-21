import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BookingRange {
  start: Date;
  end: Date;
  source: number;
}

interface RawBooking {
  start: string;
  end: string;
  source: number;
}

const STALE_MS = 60_000; // refetch at most once per minute on open

export function useBookedDates() {
  const [bookedRanges, setBookedRanges] = useState<BookingRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const inflightRef = useRef<Promise<void> | null>(null);

  const fetchBookings = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < STALE_MS) return;
    if (inflightRef.current) return inflightRef.current;

    const promise = (async () => {
      try {
        setLoading(true);
        const { data, error: fnError } = await supabase.functions.invoke("ical-bookings");
        if (fnError) throw fnError;

        const raw: RawBooking[] = data?.bookings ?? [];
        const parsed: BookingRange[] = raw
          .map((b) => ({
            start: new Date(`${b.start}T00:00:00`),
            end: new Date(`${b.end}T00:00:00`),
            source: b.source,
          }))
          .filter((b) => !Number.isNaN(b.start.getTime()) && !Number.isNaN(b.end.getTime()));

        setBookedRanges(parsed);
        setError(null);
        lastFetchRef.current = Date.now();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load bookings";
        setError(msg);
        console.error("ical-bookings fetch error:", err);
      } finally {
        setLoading(false);
        inflightRef.current = null;
      }
    })();

    inflightRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const firstBookedDate = useMemo(() => {
    return (
      bookedRanges.find((event) => {
        const end = new Date(event.end);
        end.setHours(0, 0, 0, 0);
        return end >= today;
      })?.start ?? bookedRanges[0]?.start
    );
  }, [bookedRanges, today]);

  const isDateBooked = useCallback(
    (date: Date): boolean => {
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      return bookedRanges.some((event) => {
        const start = new Date(event.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(event.end);
        end.setHours(0, 0, 0, 0);
        return check >= start && check < end;
      });
    },
    [bookedRanges],
  );

  /**
   * Returns true if the date itself is booked, OR it sits in a free gap
   * between bookings whose total bookable length (in calendar days, including
   * arrival and departure day) is shorter than `minDays`.
   *
   * Example: gap with `prevEnd = 19.4.` and `nextStart = 24.4.` allows a guest
   * to arrive on the 19th and depart on the 24th → 6 calendar days.
   */
  const isDateUnavailable = useCallback(
    (date: Date, minDays: number, from?: Date): boolean => {
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      if (isDateBooked(check)) return true;

      const lowerBound = new Date(from ?? today);
      lowerBound.setHours(0, 0, 0, 0);

      // Normalize ranges
      const ranges = bookedRanges
        .map((r) => {
          const s = new Date(r.start); s.setHours(0, 0, 0, 0);
          const e = new Date(r.end); e.setHours(0, 0, 0, 0);
          return { s, e };
        })
        .sort((a, b) => a.s.getTime() - b.s.getTime());

      // Find previous booking end (or lowerBound) and next booking start
      let prevEnd = lowerBound; // first available day in this gap
      let nextStart: Date | null = null;
      for (const r of ranges) {
        if (r.e <= check) {
          if (r.e > prevEnd) prevEnd = r.e;
        } else if (r.s > check) {
          nextStart = r.s;
          break;
        }
      }
      if (!nextStart) return false; // open-ended future, no gap limit

      // Nights between prevEnd (first free day) and nextStart (next arrival).
      // Available booking length in DAYS (incl. arrival + departure) = nights + 1.
      const gapNights = Math.round((nextStart.getTime() - prevEnd.getTime()) / 86_400_000);
      const availableDays = gapNights + 1;
      return availableDays < minDays;
    },
    [bookedRanges, isDateBooked, today],
  );

  return { bookedRanges, isDateBooked, isDateUnavailable, firstBookedDate, loading, error, refetch: fetchBookings };
}
