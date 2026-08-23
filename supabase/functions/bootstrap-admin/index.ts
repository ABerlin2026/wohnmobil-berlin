import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const email = Deno.env.get("ADMIN_BOOTSTRAP_EMAIL")?.trim().toLowerCase();
    const password = Deno.env.get("ADMIN_BOOTSTRAP_PASSWORD");
    if (!email || !password) return json({ error: "Bootstrap-Zugangsdaten fehlen" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Einmal-Schutz: nur solange kein Mandanten-Mitglied existiert.
    const { count, error: countError } = await admin
      .from("tenant_members")
      .select("id", { count: "exact", head: true });
    if (countError) return json({ error: countError.message }, 500);
    if ((count ?? 0) > 0) return json({ error: "Backend ist bereits eingerichtet" }, 409);

    let userId: string | null = null;
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      // Nutzer existiert evtl. schon -> Passwort setzen
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);
      if (!existing) return json({ error: createError.message }, 400);
      userId = existing.id;
      await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    } else {
      userId = created.user?.id ?? null;
    }
    if (!userId) return json({ error: "Benutzer konnte nicht erstellt werden" }, 500);

    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .select("id, slug")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (tenantError) return json({ error: tenantError.message }, 500);
    if (!tenant) return json({ error: "Kein Mandant vorhanden" }, 400);

    const { error: memberError } = await admin
      .from("tenant_members")
      .insert({ tenant_id: tenant.id, user_id: userId, role: "tenant_admin" });
    if (memberError) return json({ error: memberError.message }, 500);

    await admin.from("user_roles").insert({ user_id: userId, role: "admin" });
    await admin.from("audit_logs").insert({
      tenant_id: tenant.id,
      actor_id: userId,
      action: "tenant.admin_bootstrapped",
      entity_type: "tenant",
      entity_id: tenant.id,
    });

    return json({ success: true, email, tenant_slug: tenant.slug });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }, 500);
  }
});
