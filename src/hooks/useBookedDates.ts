import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BookingRange {
  start: Date;
  end: Date;
  summary: string;
  source: number;
}

interface RawBooking {
  start: string;
  end: string;
  summary: string;
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
            summary: b.summary,
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

  return { bookedRanges, isDateBooked, firstBookedDate, loading, error, refetch: fetchBookings };
}
