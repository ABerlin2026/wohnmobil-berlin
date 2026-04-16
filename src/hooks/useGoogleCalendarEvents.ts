import { useState, useEffect } from "react";

const GOOGLE_CALENDAR_API_KEY = "AIzaSyC7sqdTwZ7FtNGCCq98xMp9aTylfo3DRdg";
const CALENDAR_ID = "wohnmobil.pankow@gmail.com";

interface CalendarEvent {
  start: Date;
  end: Date;
  summary: string;
}

export function useGoogleCalendarEvents() {
  const [bookedRanges, setBookedRanges] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date();
        const timeMin = now.toISOString();
        const futureDate = new Date(now);
        futureDate.setMonth(futureDate.getMonth() + 12);
        const timeMax = futureDate.toISOString();

        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&fields=items(summary,start,end)`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Calendar API error: ${response.status}`);
        }

        const data = await response.json();
        const events: CalendarEvent[] = (data.items || []).map((item: any) => ({
          start: new Date(item.start.dateTime || item.start.date),
          end: new Date(item.end.dateTime || item.end.date),
          summary: item.summary || "",
        }));

        setBookedRanges(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load calendar");
        console.error("Google Calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const isDateBooked = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return bookedRanges.some((event) => {
      const start = new Date(event.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(event.end);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate < end;
    });
  };

  return { bookedRanges, isDateBooked, loading, error };
}
