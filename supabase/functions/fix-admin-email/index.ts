import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const WRONG = "wwohnmobil.berlin@gmx.de";
const CORRECT = "wohnmobil.berlin@gmx.de";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: list, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listError) return json({ error: listError.message }, 500);

    const user = list?.users?.find((u) => u.email?.toLowerCase() === WRONG);
    if (!user) return json({ error: "Benutzer mit fehlerhafter Adresse nicht gefunden" }, 404);

    const { error } = await admin.auth.admin.updateUserById(user.id, {
      email: CORRECT,
      email_confirm: true,
    });
    if (error) return json({ error: error.message }, 400);

    return json({ success: true, email: CORRECT });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }, 500);
  }
});
