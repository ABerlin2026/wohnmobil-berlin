// Sendet eine WhatsApp-Benachrichtigung über CallMeBot.
// Wird vom Kontaktformular nach erfolgreicher Anfrage aufgerufen.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Origin allowlist — blockt Aufrufe von fremden Seiten / Bots ohne Browser-Origin.
const ALLOWED_ORIGINS = [
  "https://wohnmobil-berlin.de",
  "https://www.wohnmobil-berlin.de",
  "https://wohnmobil-berlin.lovable.app",
];
const ALLOWED_ORIGIN_SUFFIXES = [".lovable.app", ".lovable.dev"];
const ALLOW_LOCALHOST = true;

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const url = new URL(origin);
    if (ALLOW_LOCALHOST && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) return true;
    return ALLOWED_ORIGIN_SUFFIXES.some((s) => url.hostname.endsWith(s));
  } catch {
    return false;
  }
}

// In-memory IP rate limit (per-instance, resets on cold start).
// Stoppt opportunistische Bursts; produktiv reicht das für ein Kontaktformular.
const RATE_LIMIT_PER_MINUTE = 3;
const RATE_LIMIT_PER_HOUR = 10;
type IpEntry = {
  minuteBucketStart: number;
  minuteCount: number;
  hourBucketStart: number;
  hourCount: number;
};
const ipBuckets = new Map<string, IpEntry>();

function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const entry = ipBuckets.get(ip) ?? {
    minuteBucketStart: now,
    minuteCount: 0,
    hourBucketStart: now,
    hourCount: 0,
  };
  if (now - entry.minuteBucketStart > 60_000) {
    entry.minuteBucketStart = now;
    entry.minuteCount = 0;
  }
  if (now - entry.hourBucketStart > 3_600_000) {
    entry.hourBucketStart = now;
    entry.hourCount = 0;
  }
  entry.minuteCount += 1;
  entry.hourCount += 1;
  ipBuckets.set(ip, entry);

  if (ipBuckets.size > 5000) {
    for (const [k, v] of ipBuckets) {
      if (now - v.hourBucketStart > 3_600_000) ipBuckets.delete(k);
    }
  }

  if (entry.minuteCount > RATE_LIMIT_PER_MINUTE) return { allowed: false, reason: "minute" };
  if (entry.hourCount > RATE_LIMIT_PER_HOUR) return { allowed: false, reason: "hour" };
  return { allowed: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Origin-Check: blockiert Cross-Site / Server-zu-Server Aufrufe ohne gültige Browser-Origin.
  const origin = req.headers.get("origin");
  if (!isOriginAllowed(origin)) {
    console.warn(`[notify-whatsapp-block] reason=origin origin=${origin}`);
    return new Response(
      JSON.stringify({ success: false, error: "forbidden_origin" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // IP-basiertes Rate Limit: schützt den Vermieter vor WhatsApp-Spam-Floods.
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    console.warn(`[notify-whatsapp-block] reason=ratelimit-${rl.reason} ip=${ip}`);
    return new Response(
      JSON.stringify({ success: false, error: "rate_limited" }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": rl.reason === "minute" ? "60" : "3600",
        },
      },
    );
  }

  try {
    const phone = Deno.env.get("CALLMEBOT_PHONE");
    const apikey = Deno.env.get("CALLMEBOT_APIKEY");
    if (!phone || !apikey) {
      console.error("CALLMEBOT_PHONE oder CALLMEBOT_APIKEY fehlt");
      return new Response(
        JSON.stringify({ success: false, error: "missing_config" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawMessage = (body?.message ?? "Neue Anfrage über wohnmobil-berlin.de").toString();
    // Cap length to prevent abuse / quota exhaustion via overly long messages.
    const MAX_LEN = 1000;
    const message: string = rawMessage.slice(0, MAX_LEN);

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      phone,
    )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`;

    const res = await fetch(url, { method: "GET" });
    const text = await res.text();

    const normalizedText = text.toLowerCase();
    const isQueued = normalizedText.includes("message queued") || normalizedText.includes("queued");

    console.log("CallMeBot Antwort", res.status, text);

    if (!res.ok || !isQueued) {
      console.error("CallMeBot Fehler", res.status, text);
      return new Response(
        JSON.stringify({ success: false, queued: false, error: "provider_rejected", status: res.status, body: text }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true, queued: true, status: res.status, body: text }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("notify-whatsapp Ausnahme:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
