import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { KNOWLEDGE_BASE } from "./knowledge.ts";

// ─── CORS ────────────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Layer 3a: Origin allowlist ──────────────────────────────────────────────
// Only browsers from these origins should be calling the chatbot.
// Skript-Kiddies können den Header zwar fälschen, aber 90 % des
// opportunistischen Missbrauchs (Embedding auf Fremdseiten) wird hier gestoppt.
const ALLOWED_ORIGINS = [
  "https://wohnmobil-berlin.de",
  "https://www.wohnmobil-berlin.de",
  "https://wohnmobil-berlin.lovable.app",
];
const ALLOWED_ORIGIN_SUFFIXES = [".lovable.app", ".lovable.dev"]; // preview URLs
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

// ─── Layer 4: Daily token circuit-breaker ────────────────────────────────────
const DAILY_TOKEN_LIMIT = 50_000;

// ─── Layer 2: In-memory IP rate limit ────────────────────────────────────────
// Caveat: resets on cold-start; pro Edge-Function-Instanz separat.
// Trotzdem wirksam gegen Bursts und Massen-Spam von einer einzelnen IP.
const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_HOUR = 60;
type IpEntry = { minuteBucketStart: number; minuteCount: number; hourBucketStart: number; hourCount: number };
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

  // Soft GC to avoid unbounded growth
  if (ipBuckets.size > 5000) {
    for (const [k, v] of ipBuckets) {
      if (now - v.hourBucketStart > 3_600_000) ipBuckets.delete(k);
    }
  }

  if (entry.minuteCount > RATE_LIMIT_PER_MINUTE) return { allowed: false, reason: "minute" };
  if (entry.hourCount > RATE_LIMIT_PER_HOUR) return { allowed: false, reason: "hour" };
  return { allowed: true };
}

// ─── Layer 1: Input validation (Zod) ─────────────────────────────────────────
const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1000),
});
const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  // Honeypot — checked separately (silent fail) so it never triggers a 400.
  website: z.string().optional(),
});

// ─── System prompt (knowledge base injected once) ────────────────────────────
const SYSTEM_PROMPT = `Du bist der freundliche Assistent für die Webseite "Camper Berlin" (Wohnmobil-Vermietung in Berlin & Brandenburg).

Sprache:
- Antworte automatisch in der Sprache, in der der Nutzer schreibt (Deutsch oder Englisch).
- Sei freundlich, kurz, hilfsbereit. Gerne ein passendes Emoji, aber dezent.
- Antworten kompakt halten (max. 4–6 Sätze, außer bei explizit detaillierten Fragen).

WICHTIG — Quellen & Grenzen deines Wissens:
- Du nutzt AUSSCHLIESSLICH die Informationen aus der unten stehenden WISSENSBASIS.
- Erfinde NIEMALS Preise, Daten, technische Werte oder Ausstattungsdetails.
- Wenn die Antwort nicht in der Wissensbasis steht, sage das ehrlich und verweise an
  WhatsApp (+49 173 1980777) oder E-Mail (info@wohnmobil-berlin.de).

KRITISCHE REGEL — Verlust- und Schadenskosten:
- Die Wissensbasis enthält BEWUSST KEINE Verlust- oder Defektpreise für Ausstattungsgegenstände.
- Wenn ein Gast fragt, was bei Verlust, Defekt oder Beschädigung eines Gegenstands
  (z. B. Geschirr, Markise, Campingstühle, Gasflasche, Schlüssel etc.) bezahlt werden muss,
  nenne KEINE konkreten Beträge. Antworte stattdessen sinngemäß:
  "Die genauen Kosten bei Verlust oder Beschädigung einzelner Ausstattungsgegenstände
  bespreche bitte direkt mit dem Vermieter — am schnellsten per WhatsApp unter
  +49 173 1980777. Dort bekommst du verbindliche Angaben."
- Allgemeine Beträge aus der Wissensbasis (Mietpreis, Kaution 1.500 €, Selbstbeteiligung
  1.500 €, Reinigungspauschale 200 €, Extras-Preise) darfst du natürlich nennen.

Stil:
- Antworte direkt — ohne dich jedes Mal vorzustellen.
- Bei Buchungswunsch: freundlich auf das Anfrageformular der Webseite oder WhatsApp verweisen.

=== WISSENSBASIS ===
${KNOWLEDGE_BASE}
=== ENDE WISSENSBASIS ===`;

// ─── Supabase admin client (for circuit-breaker DB calls) ────────────────────
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ── Layer 3a: Origin check ──────────────────────────────────────────────
    const origin = req.headers.get("origin");
    if (!isOriginAllowed(origin)) {
      console.warn(`[chat-block] reason=origin origin=${origin}`);
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Layer 2: IP rate limit ──────────────────────────────────────────────
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      console.warn(`[chat-block] reason=ratelimit-${rl.reason} ip=${ip}`);
      return new Response(
        JSON.stringify({ error: "Aktuell zu viele Anfragen. Bitte einen Moment warten." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Layer 1: Input validation ───────────────────────────────────────────
    const rawBody = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      console.warn(`[chat-block] reason=validation issues=${JSON.stringify(parsed.error.issues)}`);
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Layer 3b: Honeypot ──────────────────────────────────────────────────
    // Silent OK — don't tell the bot it failed.
    if (rawBody?.website && String(rawBody.website).trim().length > 0) {
      console.warn(`[chat-block] reason=honeypot ip=${ip}`);
      return new Response(JSON.stringify({ choices: [{ delta: {} }] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Layer 4: Daily token circuit-breaker ────────────────────────────────
    const { data: usedToday, error: usageErr } = await supabaseAdmin.rpc("get_today_chat_tokens");
    if (usageErr) {
      console.error("[chat] get_today_chat_tokens failed:", usageErr);
      // Fail open — don't block users if the DB hiccups.
    } else if ((usedToday as number) >= DAILY_TOKEN_LIMIT) {
      console.warn(`[chat-block] reason=daily-limit used=${usedToday} limit=${DAILY_TOKEN_LIMIT}`);
      return new Response(
        JSON.stringify({
          error:
            "Der Chat hat heute sein Tageslimit erreicht. Bitte schreib uns direkt auf WhatsApp (+49 173 1980777).",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Trim to last 20 turns and clamp content (defense in depth on top of Zod)
    const safeMessages = parsed.data.messages
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
        stream: true,
        stream_options: { include_usage: true },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Aktuell zu viele Anfragen. Bitte einen Moment warten und erneut versuchen." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Das KI-Guthaben ist aufgebraucht. Bitte den Betreiber informieren." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.body) {
      return new Response(JSON.stringify({ error: "Empty AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the stream: client gets one branch, we sniff the other for usage logging + DB increment.
    const [clientStream, logStream] = response.body.tee();

    (async () => {
      try {
        const reader = logStream.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        const lastUserMsg = safeMessages.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
        const userPreview = lastUserMsg.slice(0, 80).replace(/\s+/g, " ");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]" || !payload) continue;
            try {
              const parsedChunk = JSON.parse(payload);
              if (parsedChunk.usage) {
                const u = parsedChunk.usage;
                const promptT = u.prompt_tokens ?? 0;
                const completionT = u.completion_tokens ?? 0;
                const totalT = u.total_tokens ?? 0;
                console.log(
                  `[chat-usage] model=google/gemini-3-flash-preview ` +
                    `prompt_tokens=${promptT} completion_tokens=${completionT} total_tokens=${totalT} ` +
                    `turns=${safeMessages.length} ip=${ip} user_preview="${userPreview}"`,
                );
                // Persist to DB so the circuit-breaker has fresh numbers
                const { data: newTotal, error: incErr } = await supabaseAdmin.rpc("increment_chat_usage", {
                  p_prompt_tokens: promptT,
                  p_completion_tokens: completionT,
                  p_total_tokens: totalT,
                });
                if (incErr) console.error("[chat-usage] DB increment failed:", incErr);
                else console.log(`[chat-usage-daily] today_total=${newTotal}/${DAILY_TOKEN_LIMIT}`);
              }
            } catch {
              // Partial JSON — usage chunk arrives whole at end, safe to ignore.
            }
          }
        }
      } catch (err) {
        console.error("[chat-usage] log stream error:", err);
      }
    })();

    return new Response(clientStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
