import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileDown, Save, Upload } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
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
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { exportTenantPdf, loadImageAsDataUrl } from "@/admin/dataExportPdf";
import { toast } from "@/hooks/use-toast";


type TenantSettingsRow = {
  id: string;
  name: string;
  company_name: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
};

const emptyDraft: Omit<TenantSettingsRow, "id"> = {
  name: "",
  company_name: "",
  street: "",
  postal_code: "",
  city: "",
  phone: "",
  email: "",
  website: "",
  logo_url: null,
};

const AdminTenantSettings = () => {
  const { tenant, reload } = useTenant();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(emptyDraft);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tenant-settings", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select(
          "id, name, company_name, street, postal_code, city, phone, email, website, logo_url",
        )
        .eq("id", tenant!.id)
        .maybeSingle();
      if (error) throw error;
      return data as TenantSettingsRow | null;
    },
  });

  useEffect(() => {
    if (!data) return;
    setDraft({
      name: data.name ?? "",
      company_name: data.company_name ?? "",
      street: data.street ?? "",
      postal_code: data.postal_code ?? "",
      city: data.city ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      website: data.website ?? "",
      logo_url: data.logo_url ?? null,
    });
  }, [data]);

  useEffect(() => {
    let active = true;
    const path = draft.logo_url;
    if (!path) {
      setLogoPreview(null);
      return;
    }
    if (/^https?:\/\//.test(path)) {
      setLogoPreview(path);
      return;
    }
    void supabase.storage
      .from("rental-documents")
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (active) setLogoPreview(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [draft.logo_url]);

  const save = useMutation({
    mutationFn: async () => {
      if (!tenant) throw new Error("Kein Mandant");
      const trimmed = (value: string | null) => {
        const next = (value ?? "").trim();
        return next.length ? next : null;
      };
      const payload = {
        name: draft.name.trim() || tenant.name,
        company_name: trimmed(draft.company_name),
        street: trimmed(draft.street),
        postal_code: trimmed(draft.postal_code),
        city: trimmed(draft.city),
        phone: trimmed(draft.phone),
        email: trimmed(draft.email),
        website: trimmed(draft.website),
        logo_url: draft.logo_url,
      };
      const { error } = await supabase.from("tenants").update(payload).eq("id", tenant.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast({ title: "Mandantendaten gespeichert" });
      void queryClient.invalidateQueries({ queryKey: ["admin-tenant-settings"] });
      await reload();
    },
    onError: (error: Error) =>
      toast({ title: "Speichern fehlgeschlagen", description: error.message }),
  });

  const uploadLogo = async (file: File) => {
    if (!tenant) return;
    setUploading(true);
    const path = `${tenant.id}/branding/logo-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("rental-documents").upload(path, file, {
      upsert: true,
    });
    setUploading(false);
    if (error) {
      toast({ title: "Upload fehlgeschlagen", description: error.message });
      return;
    }
    setDraft((current) => ({ ...current, logo_url: path }));
    toast({ title: "Logo hochgeladen", description: "Bitte noch speichern." });
  };

  const [exporting, setExporting] = useState(false);

  const exportPdf = async () => {
    setExporting(true);
    try {
      const logoDataUrl = logoPreview ? await loadImageAsDataUrl(logoPreview) : null;
      exportTenantPdf({ ...draft, logoDataUrl });
      toast({ title: "PDF erstellt", description: "Die Mandantendaten wurden exportiert." });
    } catch (error) {
      toast({ title: "Export fehlgeschlagen", description: (error as Error).message });
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminShell>
      <PageSEO
        title="Mandantendaten | Verwaltung"
        description="Stammdaten des Mandanten pflegen."
        canonical="https://wohnmobil-berlin.de/admin/mandant"
        noindex
      />
      <PageHeader
        eyebrow="Verwaltung"
        title="Mandantendaten"
        description="Firmenname, Adresse, Kontaktdaten und Logo für Verträge, Rechnungen und E-Mails."
        actions={
          <>
            <button
              className={secondaryButton}
              onClick={() => void exportPdf()}
              disabled={exporting || !tenant}
            >
              <FileDown className="h-4 w-4" />
              {exporting ? "Erstellt…" : "PDF-Export"}
            </button>
            <button
              className={primaryButton}
              onClick={() => save.mutate()}
              disabled={save.isPending || !tenant}
            >
              <Save className="h-4 w-4" />
              {save.isPending ? "Speichert…" : "Speichern"}
            </button>
          </>
        }
      />


      {!tenant ? (
        <EmptyState title="Kein Mandant ausgewählt" text="Bitte zuerst einen Mandanten wählen." />
      ) : isLoading ? (
        <Panel>
          <p className="text-sm text-muted-foreground">Lade Daten…</p>
        </Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <h2 className="mb-4 font-semibold">Stammdaten</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Anzeigename (intern)" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={draft.name}
                  onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
                />
              </Field>
              <Field label="Firmenname" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={draft.company_name ?? ""}
                  placeholder="Wohnmobil Berlin GmbH"
                  onChange={(event) =>
                    setDraft((c) => ({ ...c, company_name: event.target.value }))
                  }
                />
              </Field>
              <Field label="Straße und Hausnummer" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={draft.street ?? ""}
                  onChange={(event) => setDraft((c) => ({ ...c, street: event.target.value }))}
                />
              </Field>
              <Field label="Postleitzahl">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={draft.postal_code ?? ""}
                  onChange={(event) =>
                    setDraft((c) => ({ ...c, postal_code: event.target.value }))
                  }
                />
              </Field>
              <Field label="Ort">
                <input
                  className={inputClass}
                  value={draft.city ?? ""}
                  onChange={(event) => setDraft((c) => ({ ...c, city: event.target.value }))}
                />
              </Field>
              <Field label="Telefonnummer">
                <input
                  className={inputClass}
                  type="tel"
                  value={draft.phone ?? ""}
                  onChange={(event) => setDraft((c) => ({ ...c, phone: event.target.value }))}
                />
              </Field>
              <Field label="E-Mail-Adresse">
                <input
                  className={inputClass}
                  type="email"
                  value={draft.email ?? ""}
                  onChange={(event) => setDraft((c) => ({ ...c, email: event.target.value }))}
                />
              </Field>
              <Field label="Webseite" className="sm:col-span-2" hint="z. B. https://wohnmobil-berlin.de">
                <input
                  className={inputClass}
                  value={draft.website ?? ""}
                  onChange={(event) => setDraft((c) => ({ ...c, website: event.target.value }))}
                />
              </Field>
            </div>
          </Panel>

          <Panel>
            <h2 className="mb-4 font-semibold">Logo</h2>
            <div className="flex flex-col items-start gap-4">
              <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-border bg-background p-3">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo des Mandanten" className="max-h-24 w-auto" />
                ) : (
                  <span className="text-sm text-muted-foreground">Kein Logo hinterlegt</span>
                )}
              </div>
              <label className={secondaryButton}>
                <Upload className="h-4 w-4" />
                {uploading ? "Lädt…" : "Logo hochladen"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadLogo(file);
                    event.target.value = "";
                  }}
                />
              </label>
              {draft.logo_url && (
                <button
                  className="text-sm text-destructive underline"
                  onClick={() => setDraft((c) => ({ ...c, logo_url: null }))}
                >
                  Logo entfernen
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP oder SVG. Nach dem Hochladen bitte speichern.
              </p>
            </div>
          </Panel>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminTenantSettings;
