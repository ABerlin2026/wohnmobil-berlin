import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FilePlus2, Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminShell from "@/components/admin/AdminShell";
import PageSEO from "@/components/PageSEO";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  inputClass,
  primaryButton,
} from "@/components/admin/AdminUI";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { RENTAL_STATUS, formatDate } from "@/admin/constants";
import { formatEuro } from "@/lib/rentalCalculations";
import { deleteRentalWithDependencies } from "@/admin/deleteRental";
import { toast } from "@/hooks/use-toast";

const AdminRentals = () => {
  const { tenant, role, isPlatformAdmin } = useTenant();
  const canDelete = isPlatformAdmin || role === "tenant_admin" || role === "admin";
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [rentalToDelete, setRentalToDelete] = useState<{ id: string; rental_number: string } | null>(
    null,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-rentals", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("rentals")
        .select(
          "id, rental_number, status, start_date, end_date, rental_price_cents, destination, customers(first_name, last_name, email)",
        )
        .eq("tenant_id", tenant!.id)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return rows ?? [];
    },
  });

  const deleteRental = useMutation({
    mutationFn: deleteRentalWithDependencies,
    onSuccess: () => {
      toast({ title: "Mietvertrag gelöscht" });
      setRentalToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-rentals"] });
    },
    onError: (error: Error) =>
      toast({
        title: "Löschen fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      }),
  });

  const rentals = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((rental) => {
      if (status !== "all" && rental.status !== status) return false;
      if (!term) return true;
      const name = rental.customers
        ? `${rental.customers.first_name} ${rental.customers.last_name} ${rental.customers.email ?? ""}`
        : "";
      return `${rental.rental_number} ${name} ${rental.destination ?? ""}`.toLowerCase().includes(term);
    });
  }, [data, search, status]);

  return (
    <AdminShell>
      <PageSEO
        title="Mietverträge"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/mietvertraege"
        noindex
      />
      <PageHeader
        eyebrow="Mandantenbereich"
        title="Mietverträge"
        description="Alle Verträge mit Status, Zeitraum und Mieter."
        actions={
          <Link to="/admin/mietvertrag/neu" className={primaryButton}>
            <FilePlus2 className="h-4 w-4" />
            Neuer Mietvertrag
          </Link>
        }
      />

      <Panel className="mb-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Vertragsnummer, Mieter oder Ziel …"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="all">Alle Status</option>
            {Object.entries(RENTAL_STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      <Panel>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Lade Verträge …</p>
        ) : rentals.length === 0 ? (
          <EmptyState
            title="Keine Mietverträge gefunden"
            text="Lege den ersten Mietvertrag über „Neuer Mietvertrag“ an."
          />
        ) : (
          <ul className="divide-y divide-border">
            {rentals.map((rental) => (
              <li key={rental.id} className="flex items-center gap-2 py-3">
                <Link
                  to={`/admin/mietvertrag/${rental.id}`}
                  className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3 transition hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {rental.rental_number} ·{" "}
                      {rental.customers
                        ? `${rental.customers.first_name} ${rental.customers.last_name}`
                        : "Kunde offen"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(rental.start_date)} – {formatDate(rental.end_date)}
                      {rental.destination ? ` · ${rental.destination}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatEuro(rental.rental_price_cents)}</span>
                    <StatusBadge status={rental.status} />
                  </div>
                </Link>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() =>
                      setRentalToDelete({ id: rental.id, rental_number: rental.rental_number })
                    }
                    disabled={deleteRental.isPending}
                    className="rounded-lg border border-destructive/40 p-2 text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                    title={`Mietvertrag ${rental.rental_number} löschen`}
                    aria-label={`Mietvertrag ${rental.rental_number} löschen`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <AlertDialog
        open={rentalToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteRental.isPending) setRentalToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mietvertrag {rentalToDelete?.rental_number} löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dabei werden auch Fahrer, Zahlungen, Übergabe- und Rückgabeprotokolle, Rechnungen,
              Schadensmarker sowie alle gespeicherten PDF-Dokumente dieses Vertrags endgültig
              entfernt. Das kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRental.isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rentalToDelete && deleteRental.mutate(rentalToDelete.id)}
              disabled={deleteRental.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRental.isPending ? "Löscht …" : "Endgültig löschen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
};

export default AdminRentals;
