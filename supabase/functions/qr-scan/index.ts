import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';
const CHAT_ID = 333188209;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) return json({ error: 'not configured' }, 500);

    let source = 'flyer';
    try {
      const body = await req.json();
      if (typeof body?.source === 'string') source = body.source;
    } catch { /* ignore */ }
    source = source.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'flyer';

    const ua = (req.headers.get('user-agent') ?? '').slice(0, 150);
    const time = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
    const text = `📱 QR-Code gescannt!\nQuelle: ${source}\nZeit: ${time}\nGerät: ${ua}`;

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
