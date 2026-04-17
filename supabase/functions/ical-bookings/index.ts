const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ICAL_URLS = [
  "https://www.paulcamper.de/api/v1/public/ical/export?permalink=72065-d24e427491ae9f97",
  "https://www.paulcamper.de/api/v1/public/ical/export?permalink=023a4c6a477e1d13b602",
];

interface BookingRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD (exclusive)
  summary: string;
  source: number;
}

function parseIcsDate(value: string): string | null {
  // YYYYMMDD or YYYYMMDDTHHMMSSZ
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function unfoldIcs(text: string): string[] {
  // RFC5545: lines starting with space/tab continue the previous line
  const raw = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function parseIcs(text: string, source: number): BookingRange[] {
  const lines = unfoldIcs(text);
  const events: BookingRange[] = [];
  let current: Partial<BookingRange> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = { source };
    } else if (line === "END:VEVENT") {
      if (current?.start && current.end) {
        events.push({
          start: current.start,
          end: current.end,
          summary: current.summary || "",
          source,
        });
      }
      current = null;
    } else if (current) {
      const colon = line.indexOf(":");
      if (colon === -1) continue;
      const keyPart = line.slice(0, colon);
      const value = line.slice(colon + 1);
      const key = keyPart.split(";")[0];
      if (key === "DTSTART") current.start = parseIcsDate(value) ?? undefined;
      else if (key === "DTEND") current.end = parseIcsDate(value) ?? undefined;
      else if (key === "SUMMARY") current.summary = value.replace(/\\,/g, ",").replace(/\\n/g, " ");
    }
  }
  return events;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const results = await Promise.all(
      ICAL_URLS.map(async (url, idx) => {
        const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
        if (!res.ok) throw new Error(`Feed ${idx} returned ${res.status}`);
        const text = await res.text();
        return parseIcs(text, idx);
      }),
    );

    const merged = results.flat().sort((a, b) => a.start.localeCompare(b.start));

    return new Response(
      JSON.stringify({ bookings: merged, fetchedAt: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("ical-bookings error:", message);
    return new Response(JSON.stringify({ error: message, bookings: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
