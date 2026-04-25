const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ICAL_BASE = "https://www.paulcamper.de/api/v1/public/ical/export?permalink=";
const ICAL_TOKEN_1 = Deno.env.get("PAULCAMPER_ICAL_TOKEN_1");
const ICAL_TOKEN_2 = Deno.env.get("PAULCAMPER_ICAL_TOKEN_2");
const ICAL_TOKENS = [ICAL_TOKEN_1, ICAL_TOKEN_2].filter(
  (t): t is string => !!t && t.length > 0,
);

interface BookingRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD (exclusive)
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
      // SUMMARY intentionally ignored to avoid leaking guest PII to clients.
    }
  }
  return events;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Surface configuration problems instead of silently returning empty.
  if (ICAL_TOKENS.length === 0) {
    console.error(
      "ical-bookings: no PAULCAMPER_ICAL_TOKEN_1 / PAULCAMPER_ICAL_TOKEN_2 secrets configured",
    );
    return new Response(
      JSON.stringify({
        error: "ICAL_TOKENS_MISSING",
        message:
          "Paul Camper iCal-Tokens sind nicht konfiguriert. Bitte PAULCAMPER_ICAL_TOKEN_1 (und optional _2) als Secret hinterlegen.",
        bookings: [],
      }),
      {
        status: 200, // 200 so client UI degrades gracefully (calendar shows empty)
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const perFeed: Array<{ idx: number; ok: boolean; status?: number; count: number; error?: string }> = [];

  const results = await Promise.all(
    ICAL_TOKENS.map(async (token, idx) => {
      const url = ICAL_BASE + token;
      try {
        const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error(
            `ical-bookings feed ${idx} HTTP ${res.status}`,
            body.slice(0, 500),
          );
          perFeed.push({ idx, ok: false, status: res.status, count: 0, error: `HTTP ${res.status}` });
          return [] as BookingRange[];
        }
        const text = await res.text();
        const events = parseIcs(text, idx);
        console.log(`ical-bookings feed ${idx}: parsed ${events.length} events`);
        perFeed.push({ idx, ok: true, status: res.status, count: events.length });
        return events;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`ical-bookings feed ${idx} fetch error:`, message);
        perFeed.push({ idx, ok: false, count: 0, error: message });
        return [] as BookingRange[];
      }
    }),
  );

  const merged = results.flat().sort((a, b) => a.start.localeCompare(b.start));
  const allFailed = perFeed.every((f) => !f.ok);

  return new Response(
    JSON.stringify({
      bookings: merged,
      fetchedAt: new Date().toISOString(),
      feeds: perFeed,
      ...(allFailed ? { error: "ALL_FEEDS_FAILED" } : {}),
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
});
