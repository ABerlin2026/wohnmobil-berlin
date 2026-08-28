import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const ActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("list"),
    tenant_id: z.string().uuid(),
  }),
  z.object({
    action: z.literal("create"),
    tenant_id: z.string().uuid(),
    email: z.string().email().max(255),
    password: z.string().min(8).max(128),
    role: z.enum(["tenant_admin", "employee"]),
  }),
  z.object({
    action: z.literal("update_role"),
    tenant_id: z.string().uuid(),
    member_id: z.string().uuid(),
    role: z.enum(["tenant_admin", "employee"]),
  }),
  z.object({
    action: z.literal("remove"),
    tenant_id: z.string().uuid(),
    member_id: z.string().uuid(),
  }),
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Anmeldung erforderlich" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Caller identity
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await callerClient.auth.getUser();
    const caller = userData?.user;
    if (userError || !caller) return json({ error: "Ungültige Sitzung" }, 401);

    const parsed = ActionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: "Ungültige Eingabe", details: parsed.error.flatten().fieldErrors }, 400);
    }
    const body = parsed.data;

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    // Authorization: caller must be tenant_admin of this tenant or platform admin
    const { data: isPlatformAdmin } = await admin.rpc("has_role", {
      _user_id: caller.id,
      _role: "platform_admin",
    });
    const { data: isGlobalAdmin } = await admin.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });

    const { data: callerMembership } = await admin
      .from("tenant_members")
      .select("id, role")
      .eq("tenant_id", body.tenant_id)
      .eq("user_id", caller.id)
      .maybeSingle();

    const isTenantAdmin = callerMembership?.role === "tenant_admin";
    if (!isTenantAdmin && !isPlatformAdmin && !isGlobalAdmin) {
      return json({ error: "Keine Berechtigung für diesen Mandanten" }, 403);
    }

    if (body.action === "list") {
      const { data: members, error } = await admin
        .from("tenant_members")
        .select("id, user_id, role, created_at")
        .eq("tenant_id", body.tenant_id)
        .order("created_at", { ascending: true });
      if (error) return json({ error: error.message }, 500);

      // Enrich with emails via auth admin
      const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });
      const emailById = new Map<string, string>(
        (usersPage?.users ?? []).map((u) => [u.id, u.email ?? ""]),
      );

      return json({
        members: (members ?? []).map((m) => ({
          ...m,
          email: emailById.get(m.user_id) ?? "—",
          is_self: m.user_id === caller.id,
        })),
      });
    }

    if (body.action === "create") {
      const email = body.email.trim().toLowerCase();

      let userId: string | null = null;
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password: body.password,
        email_confirm: true,
      });
      if (createError) {
        // Nutzer existiert evtl. bereits -> Mitgliedschaft ergänzen
        const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });
        const existing = usersPage?.users?.find((u) => u.email?.toLowerCase() === email);
        if (!existing) return json({ error: createError.message }, 400);
        userId = existing.id;
        await admin.auth.admin.updateUserById(userId, { password: body.password, email_confirm: true });
      } else {
        userId = created.user?.id ?? null;
      }
      if (!userId) return json({ error: "Benutzer konnte nicht erstellt werden" }, 500);

      const { data: existingMember } = await admin
        .from("tenant_members")
        .select("id")
        .eq("tenant_id", body.tenant_id)
        .eq("user_id", userId)
        .maybeSingle();
      if (existingMember) {
        return json({ error: "Dieser Benutzer ist bereits Mitglied des Mandanten" }, 409);
      }

      const { error: memberError } = await admin
        .from("tenant_members")
        .insert({ tenant_id: body.tenant_id, user_id: userId, role: body.role });
      if (memberError) return json({ error: memberError.message }, 500);

      await admin.from("audit_logs").insert({
        tenant_id: body.tenant_id,
        actor_id: caller.id,
        action: "tenant.user_created",
        entity_type: "tenant_member",
        entity_id: userId,
        after_data: { email, role: body.role },
      });

      return json({ success: true, user_id: userId });
    }

    // For update_role / remove: resolve target membership
    const { data: target } = await admin
      .from("tenant_members")
      .select("id, user_id, role")
      .eq("id", body.member_id)
      .eq("tenant_id", body.tenant_id)
      .maybeSingle();
    if (!target) return json({ error: "Mitglied nicht gefunden" }, 404);

    if (target.user_id === caller.id) {
      return json({ error: "Du kannst dein eigenes Konto nicht ändern oder entfernen" }, 400);
    }

    if (body.action === "update_role") {
      const { error } = await admin
        .from("tenant_members")
        .update({ role: body.role })
        .eq("id", target.id);
      if (error) return json({ error: error.message }, 500);

      await admin.from("audit_logs").insert({
        tenant_id: body.tenant_id,
        actor_id: caller.id,
        action: "tenant.user_role_updated",
        entity_type: "tenant_member",
        entity_id: target.user_id,
        before_data: { role: target.role },
        after_data: { role: body.role },
      });

      return json({ success: true });
    }

    // remove
    const { error: delError } = await admin.from("tenant_members").delete().eq("id", target.id);
    if (delError) return json({ error: delError.message }, 500);

    // Auth-Konto nur löschen, wenn keine weiteren Mitgliedschaften bestehen
    const { count: remaining } = await admin
      .from("tenant_members")
      .select("id", { count: "exact", head: true })
      .eq("user_id", target.user_id);
    if ((remaining ?? 0) === 0) {
      await admin.auth.admin.deleteUser(target.user_id);
    }

    await admin.from("audit_logs").insert({
      tenant_id: body.tenant_id,
      actor_id: caller.id,
      action: "tenant.user_removed",
      entity_type: "tenant_member",
      entity_id: target.user_id,
      before_data: { role: target.role },
    });

    return json({ success: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }, 500);
  }
});
