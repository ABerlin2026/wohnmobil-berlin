import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ClipboardCheck,
  Download,
  FileArchive,
  FileText,
  Mail,
  Pencil,
  Plus,
  Printer,

  Undo2,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import PageSEO from "@/components/PageSEO";
import {
  EmptyState,
  Field,
  PageHeader,
  Panel,
  StatusBadge,
  inputClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/AdminUI";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { PAYMENT_TYPES, formatDate } from "@/admin/constants";
import {
  euroToCents,
  formatEuro,
  includedKilometres,
  rentalDays,
} from "@/lib/rentalCalculations";
import { toast } from "@/hooks/use-toast";
import { deliverFile, generateRentalPdf, printRentalPdf } from "@/admin/rentalPdf";


const AdminRentalDetail = () => {
  const { id } = useParams();
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [payment, setPayment] = useState({
    payment_type: "rent",
    amount: "",
    payment_method: "Überweisung",
    payment_date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const { data: rental, isLoading } = useQuery({
    queryKey: ["admin-rental", id],
    enabled: !!id && !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select(
          "*, customers(first_name, last_name, email, phone, street, postal_code, city), vehicles(name, registration_number)",
        )
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ["admin-rental-drivers", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("rental_id", id!)
        .order("is_primary", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["admin-rental-payments", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("rental_id", id!)
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: documents } = useQuery({
    queryKey: ["admin-rental-documents", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, document_type, file_name, file_path, version, created_at")
        .eq("rental_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: inspections } = useQuery({
    queryKey: ["admin-rental-inspections", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspections")
        .select("id, inspection_type, status, signed_at, odometer")
        .eq("rental_id", id!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const addPayment = useMutation({
    mutationFn: async () => {
      if (!tenant || !rental) throw new Error("Kein Mietvertrag");
      const { error } = await supabase.from("payments").insert({
        tenant_id: tenant.id,
        rental_id: rental.id,
        payment_type: payment.payment_type,
        amount_cents: euroToCents(payment.amount),
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
        notes: payment.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Zahlung erfasst" });
      setPayment({ ...payment, amount: "", notes: "" });
      void queryClient.invalidateQueries({ queryKey: ["admin-rental-payments", id] });
    },
    onError: (error: Error) =>
      toast({ title: "Speichern fehlgeschlagen", description: error.message }),
  });

  const download = async (path: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("rental-documents")
      .createSignedUrl(path, 60 * 5);
    if (error || !data) {
      toast({ title: "Download fehlgeschlagen", description: error?.message });
      return;
    }
    await deliverFile(data.signedUrl, fileName);
  };

  const downloadAll = async () => {
    for (const doc of documents ?? []) {
      await download(doc.file_path, doc.file_name);
    }
  };

  const [pdfBusy, setPdfBusy] = useState<"create" | "send" | "print" | null>(null);

  const createContractPdf = async (mode: "create" | "send" | "print") => {
    if (!id) return;
    setPdfBusy(mode);
    try {
      if (mode === "print") {
        const result = await printRentalPdf({ rentalId: id, kind: "contract" });
        void queryClient.invalidateQueries({ queryKey: ["admin-rental-documents", id] });
        toast({
          title: "Druck gestartet",
          description: `${result.fileName} wurde erstellt und an den Drucker geschickt.`,
        });
        return;
      }
      const send = mode === "send";
      const result = await generateRentalPdf({ rentalId: id, kind: "contract", send });
      void queryClient.invalidateQueries({ queryKey: ["admin-rental-documents", id] });
      if (send) {
        if (result.emailQueued) {
          toast({
            title: "Mietvertrag versendet",
            description: `${result.fileName} wurde als Download-Link an den Mieter geschickt.`,
          });
        } else {
          toast({
            title: "PDF erstellt, Versand offen",
            description: result.emailError ?? "E-Mail konnte nicht zugestellt werden.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "PDF erstellt",
          description: `${result.fileName} liegt im Dokumentenarchiv.`,
        });
        if (result.signedUrl) await deliverFile(result.signedUrl, result.fileName);
      }
    } catch (error) {
      toast({
        title: "PDF fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setPdfBusy(null);
    }
  };



  const totals = useMemo(() => {
    if (!rental) return null;
    const paidRent = (payments ?? [])
      .filter((entry) => entry.payment_type === "rent")
      .reduce((sum, entry) => sum + entry.amount_cents, 0);
    const paidDeposit = (payments ?? [])
      .filter((entry) => entry.payment_type === "deposit")
      .reduce((sum, entry) => sum + entry.amount_cents, 0);
    const days = rentalDays(new Date(rental.start_date), new Date(rental.end_date));
    return {
      days,
      includedKm: includedKilometres(
        new Date(rental.start_date),
        new Date(rental.end_date),
        rental.free_km_per_day,
      ),
      paidRent,
      paidDeposit,
      openRent: Math.max(0, rental.rental_price_cents - paidRent),
      openDeposit: Math.max(0, rental.deposit_cents - paidDeposit),
    };
  }, [rental, payments]);

  const handover = (inspections ?? []).find((entry) => entry.inspection_type === "handover");
  const returnInspection = (inspections ?? []).find((entry) => entry.inspection_type === "return");

  if (isLoading) {
    return (
      <AdminShell>
        <p className="text-sm text-muted-foreground">Lade Mietvertrag …</p>
      </AdminShell>
    );
  }

  if (!rental) {
    return (
      <AdminShell>
        <EmptyState title="Mietvertrag nicht gefunden" text="Der Vertrag existiert nicht oder gehört zu einem anderen Mandanten." />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <PageSEO
        title={`Mietvertrag ${rental.rental_number}`}
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/mietvertraege"
        noindex
      />
      <PageHeader
        eyebrow="Mietvertrag"
        title={rental.rental_number}
        description={`${formatDate(rental.start_date)} – ${formatDate(rental.end_date)} · ${
          rental.vehicles?.name ?? "Fahrzeug offen"
        }`}
        actions={
          <>
            <Link to={`/admin/mietvertrag/${rental.id}/bearbeiten`} className={secondaryButton}>
              <Pencil className="h-4 w-4" />
              Bearbeiten
            </Link>
            <Link to={`/admin/mietvertrag/${rental.id}/uebergabe`} className={primaryButton}>
              <ClipboardCheck className="h-4 w-4" />
              {handover ? "Übergabe öffnen" : "Übergabe starten"}
            </Link>
            <Link to={`/admin/mietvertrag/${rental.id}/rueckgabe`} className={secondaryButton}>
              <Undo2 className="h-4 w-4" />
              {returnInspection ? "Rückgabe öffnen" : "Rückgabe"}
            </Link>
            <button
              onClick={() => void createContractPdf("create")}
              disabled={pdfBusy !== null}
              className={secondaryButton}
            >
              <FileText className="h-4 w-4" />
              {pdfBusy === "create" ? "Erstellt …" : "Vertrags-PDF erstellen"}
            </button>
            <button
              onClick={() => void createContractPdf("send")}
              disabled={pdfBusy !== null || !rental.customers?.email}
              title={
                rental.customers?.email
                  ? undefined
                  : "Für den Mieter ist keine E-Mail-Adresse hinterlegt."
              }
              className={secondaryButton}
            >
              <Mail className="h-4 w-4" />
              {pdfBusy === "send" ? "Sendet …" : "Per E-Mail senden"}
            </button>
            <button
              onClick={() => void createContractPdf("print")}
              disabled={pdfBusy !== null}
              className={secondaryButton}
              title="PDF erstellen und direkt drucken"
            >
              <Printer className="h-4 w-4" />
              {pdfBusy === "print" ? "Druckt …" : "Drucken"}
            </button>
          </>

        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-semibold">Status &amp; Zeitraum</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              Status: <StatusBadge status={rental.status} />
            </p>
            <p>Miettage: {totals?.days}</p>
            <p>
              Freikilometer: {totals?.includedKm} km ({rental.free_km_per_day} km je Miettag)
            </p>
            <p>Mehrkilometer: {formatEuro(rental.extra_km_price_cents)} je km</p>
            <p>Übergabe: {rental.handover_location ?? "-"} {rental.handover_time ?? ""}</p>
            <p>Rückgabe: {rental.return_location ?? "-"} {rental.return_time ?? ""}</p>
            <p>Reiseziel: {rental.destination ?? "-"}</p>
            {rental.planned_route && <p>Route: {rental.planned_route}</p>}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">Mieter</h2>
          {rental.customers ? (
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium">
                {rental.customers.first_name} {rental.customers.last_name}
              </p>
              <p>{rental.customers.street}</p>
              <p>
                {rental.customers.postal_code} {rental.customers.city}
              </p>
              <p>{rental.customers.email}</p>
              <p>{rental.customers.phone}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Noch kein Mieter zugeordnet.</p>
          )}
          <h3 className="mt-5 text-sm font-semibold">Fahrer ({(drivers ?? []).length})</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {(drivers ?? []).map((driver) => (
              <li key={driver.id}>
                {driver.first_name} {driver.last_name}
                {driver.is_primary ? " (Hauptfahrer)" : ""}
                {driver.license_expires_at &&
                new Date(driver.license_expires_at) < new Date(rental.end_date) ? (
                  <span className="ml-2 text-destructive">Führerschein läuft ab</span>
                ) : null}
              </li>
            ))}
            {(drivers ?? []).length === 0 && (
              <li className="text-muted-foreground">Noch keine Fahrer eingetragen.</li>
            )}
          </ul>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">Zahlungen &amp; Kaution</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <p>Mietpreis: {formatEuro(rental.rental_price_cents)}</p>
            <p>Gezahlt: {formatEuro(totals?.paidRent ?? 0)}</p>
            <p>Offen: {formatEuro(totals?.openRent ?? 0)}</p>
            <p>Kaution: {formatEuro(rental.deposit_cents)}</p>
            <p>Kaution gezahlt: {formatEuro(totals?.paidDeposit ?? 0)}</p>
            <p>Kaution offen: {formatEuro(totals?.openDeposit ?? 0)}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Art">
              <select
                value={payment.payment_type}
                onChange={(event) => setPayment({ ...payment, payment_type: event.target.value })}
                className={inputClass}
              >
                {PAYMENT_TYPES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Betrag (EUR)">
              <input
                value={payment.amount}
                onChange={(event) => setPayment({ ...payment, amount: event.target.value })}
                inputMode="decimal"
                className={inputClass}
              />
            </Field>
            <Field label="Zahlungsart">
              <select
                value={payment.payment_method}
                onChange={(event) => setPayment({ ...payment, payment_method: event.target.value })}
                className={inputClass}
              >
                {((tenant?.payment_methods as string[]) ?? [
                  "Überweisung",
                  "Bar",
                  "EC-Karte",
                  "PayPal",
                ]).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Zahlungsdatum">
              <input
                type="date"
                value={payment.payment_date}
                onChange={(event) => setPayment({ ...payment, payment_date: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Bemerkung" className="sm:col-span-2">
              <input
                value={payment.notes}
                onChange={(event) => setPayment({ ...payment, notes: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <button
            onClick={() => euroToCents(payment.amount) > 0 && addPayment.mutate()}
            disabled={addPayment.isPending}
            className={`${primaryButton} mt-3`}
          >
            <Plus className="h-4 w-4" /> Zahlung erfassen
          </button>

          <ul className="mt-4 divide-y divide-border text-sm">
            {(payments ?? []).map((entry) => (
              <li key={entry.id} className="flex justify-between py-2">
                <span>
                  {PAYMENT_TYPES.find((type) => type.value === entry.payment_type)?.label ??
                    entry.payment_type}{" "}
                  · {entry.payment_method} · {formatDate(entry.payment_date)}
                </span>
                <span className="font-medium">{formatEuro(entry.amount_cents)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dokumentenarchiv</h2>
            {(documents ?? []).length > 0 && (
              <button onClick={() => void downloadAll()} className={secondaryButton}>
                <FileArchive className="h-4 w-4" /> Gesamtpaket
              </button>
            )}
          </div>
          {(documents ?? []).length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Noch keine Dokumente. Uploads entstehen im Mietvertrags-, Übergabe- und
              Rücknahmeworkflow.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border text-sm">
              {(documents ?? []).map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-2">
                  <span>
                    {doc.document_type} · {doc.file_name}{" "}
                    <span className="text-muted-foreground">v{doc.version}</span>
                  </span>
                  <button
                    onClick={() => void download(doc.file_path, doc.file_name)}
                    className={`${secondaryButton} !px-3 !py-1.5 text-xs`}
                  >
                    <Download className="h-3.5 w-3.5" /> Laden
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Downloads laufen über kurzlebige signierte Links. Jede PDF-Erstellung legt eine neue
            Version an, ältere Versionen bleiben erhalten.
          </p>

        </Panel>
      </div>

      <footer className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">
          {tenant?.company_name || tenant?.name || "Vermieter"}
        </p>
        {tenant?.street && <p>{tenant.street}</p>}
        {(tenant?.postal_code || tenant?.city) && (
          <p>
            {tenant?.postal_code} {tenant?.city}
          </p>
        )}
        <p>
          {[
            tenant?.phone ? `Tel. ${tenant.phone}` : null,
            tenant?.email,
            tenant?.website,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </footer>

    </AdminShell>
  );
};

export default AdminRentalDetail;
