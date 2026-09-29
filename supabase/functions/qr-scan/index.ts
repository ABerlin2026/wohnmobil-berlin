import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';
const TELEGRAM_API_BASE = 'https://api.telegram.org';
const CHAT_ID = 333188209;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    let source = 'flyer';
    try {
      const body = await req.json();
      if (typeof body?.source === 'string') source = body.source;
    } catch { /* ignore */ }
    source = source.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'flyer';

    const ua = (req.headers.get('user-agent') ?? '').slice(0, 150);
    const time = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
    const text = `📱 QR-Code gescannt!\nQuelle: ${source}\nZeit: ${time}\nGerät: ${ua}`;

    // Preferred: dedicated project bot (wohnmobil_berlin_bot) via its Bot API token.
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (BOT_TOKEN) {
      const res = await fetch(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
      if (res.ok) return json({ ok: true });
      const details = await res.text();
      console.error(`Telegram bot failed [${res.status}]: ${details}`);
      // Fall through to the gateway bot only while the recipient has not started the new bot yet (403).
      if (res.status !== 403) return json({ error: 'telegram failed', status: res.status, details }, 502);
    }

    // Fallback: connector gateway (previous bot).
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) return json({ error: 'not configured' }, 500);

    const res = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    if (!res.ok) {
      const details = await res.text();
      console.error(`Telegram failed [${res.status}]: ${details}`);
      return json({ error: 'telegram failed', status: res.status, details }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});
