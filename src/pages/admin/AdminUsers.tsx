import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageSEO from "@/components/PageSEO";
import {
  EmptyState,
  Field,
  PageHeader,
  Panel,
  inputClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/AdminUI";

interface Member {
  id: string;
  user_id: string;
  role: string;
  email: string;
  is_self: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  tenant_admin: "Mandanten-Admin",
  employee: "Mitarbeiter",
};

const AdminUsers = () => {
  const { tenant, role } = useTenant();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState<"tenant_admin" | "employee">("employee");
  const [confirmRemove, setConfirmRemove] = useState<Member | null>(null);

  const isTenantAdmin = role === "tenant_admin" || role === "admin" || role === "platform_admin";

  const call = async (payload: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("manage-tenant-users", {
      body: { tenant_id: tenant?.id, ...payload },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const load = async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const data = await call({ action: "list" });
      setMembers(data.members ?? []);
    } catch (e) {
      toast({
        title: "Laden fehlgeschlagen",
        description: e instanceof Error ? e.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  const createUser = async () => {
    if (!email.trim() || password.length < 8) {
      toast({
        title: "Eingabe prüfen",
        description: "E-Mail und ein Passwort mit mindestens 8 Zeichen sind erforderlich.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      await call({ action: "create", email: email.trim(), password, role: newRole });
      toast({ title: "Benutzer angelegt", description: `${email.trim()} wurde hinzugefügt.` });
      setEmail("");
      setPassword("");
      setNewRole("employee");
      await load();
    } catch (e) {
      toast({
        title: "Anlegen fehlgeschlagen",
        description: e instanceof Error ? e.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const updateRole = async (member: Member, role: string) => {
    setBusy(true);
    try {
      await call({ action: "update_role", member_id: member.id, role });
      toast({ title: "Rolle aktualisiert" });
      await load();
    } catch (e) {
      toast({
        title: "Rolle konnte nicht geändert werden",
        description: e instanceof Error ? e.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const removeMember = async () => {
    if (!confirmRemove) return;
    setBusy(true);
    try {
      await call({ action: "remove", member_id: confirmRemove.id });
      toast({ title: "Benutzer entfernt", description: confirmRemove.email });
      setConfirmRemove(null);
      await load();
    } catch (e) {
      toast({
        title: "Entfernen fehlgeschlagen",
        description: e instanceof Error ? e.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Benutzerverwaltung"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/benutzer"
        noindex
      />
      <PageHeader
        eyebrow="Verwaltung"
        title="Benutzer"
        description="Lege neue Zugänge für dein Team an und verwalte Rollen."
      />

      {!isTenantAdmin ? (
        <EmptyState
          title="Keine Berechtigung"
          text="Nur Mandanten-Admins können Benutzer verwalten."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Panel>
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4 text-primary" /> Mitglieder von {tenant?.name}
            </h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Mitglieder.</p>
            ) : (
              <ul className="space-y-3">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.email}
                        {member.is_self && (
                          <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                            Du
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Seit {new Date(member.created_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        disabled={busy || member.is_self}
                        onChange={(e) => void updateRole(member, e.target.value)}
                        className={inputClass + " w-auto"}
                      >
                        <option value="tenant_admin">Mandanten-Admin</option>
                        <option value="employee">Mitarbeiter</option>
                      </select>
                      {!member.is_self && (
                        <button
                          onClick={() => setConfirmRemove(member)}
                          disabled={busy}
                          className={secondaryButton + " !px-3"}
                          aria-label={`${member.email} entfernen`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <UserPlus className="h-4 w-4 text-primary" /> Neuer Benutzer
            </h2>
            <div className="space-y-4">
              <Field label="E-Mail-Adresse">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="mitarbeiter@beispiel.de"
                  autoComplete="off"
                />
              </Field>
              <Field label="Passwort" hint="Mindestens 8 Zeichen. Dem Mitarbeiter separat mitteilen.">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Rolle">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "tenant_admin" | "employee")}
                  className={inputClass}
                >
                  <option value="employee">Mitarbeiter</option>
                  <option value="tenant_admin">Mandanten-Admin</option>
                </select>
              </Field>
              <button onClick={() => void createUser()} disabled={busy} className={primaryButton + " w-full justify-center"}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Benutzer anlegen
              </button>
              <p className="text-xs text-muted-foreground">
                Der neue Benutzer kann sich sofort unter /admin/login anmelden. E-Mail-Bestätigung ist
                nicht erforderlich.
              </p>
            </div>
          </Panel>
        </div>
      )}

      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Benutzer entfernen?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong>{confirmRemove.email}</strong> verliert den Zugriff auf diesen Mandanten. Hat
              der Benutzer keine weiteren Mitgliedschaften, wird auch das Konto gelöscht.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmRemove(null)} disabled={busy} className={secondaryButton}>
                Abbrechen
              </button>
              <button
                onClick={() => void removeMember()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Entfernen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
