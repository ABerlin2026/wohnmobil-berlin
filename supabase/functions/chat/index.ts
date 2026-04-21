import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { KNOWLEDGE_BASE } from "./knowledge.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const messages = (body?.messages ?? []) as IncomingMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages must be a non-empty array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic validation + size guard
    const safeMessages = messages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-20) // keep only last 20 turns
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

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

    return new Response(response.body, {
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
