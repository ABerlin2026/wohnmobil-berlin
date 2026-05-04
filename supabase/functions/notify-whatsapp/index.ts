// Sendet eine WhatsApp-Benachrichtigung über CallMeBot.
// Wird vom Kontaktformular nach erfolgreicher Anfrage aufgerufen.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
    const message: string = (body?.message ?? "Neue Anfrage über wohnmobil-berlin.de").toString();

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
