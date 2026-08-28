import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, UserRound } from "lucide-react";
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
import { EmptyState, PageHeader, Panel, inputClass } from "@/components/admin/AdminUI";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/admin/constants";
import { deleteCustomerWithDependencies } from "@/admin/deleteCustomer";
import { toast } from "@/hooks/use-toast";

const AdminCustomers = () => {
  const { tenant, role, isPlatformAdmin } = useTenant();
  const queryClient = useQueryClient();
  const canDelete = isPlatformAdmin || role === "tenant_admin" || role === "admin";
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(
    null,
  );

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select(
          "id, first_name, last_name, email, phone, city, postal_code, street, identity_expires_at, created_at",
        )
        .eq("tenant_id", tenant!.id)
        .order("last_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: rentals } = useQuery({
    queryKey: ["admin-customer-rentals", selected],
    enabled: !!selected,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select("id, rental_number, status, start_date, end_date")
        .eq("customer_id", selected!)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: deleteCustomerWithDependencies,
    onSuccess: (_data, customerId) => {
      toast({ title: "Kunde gelöscht" });
      setCustomerToDelete(null);
      if (selected === customerId) setSelected(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-rentals"] });
    },
    onError: (error: Error) =>
      toast({
        title: "Löschen fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      }),
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers ?? [];
    return (customers ?? []).filter((customer) =>
      `${customer.first_name} ${customer.last_name} ${customer.email ?? ""} ${customer.city ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [customers, search]);

  const active = filtered.find((entry) => entry.id === selected) ?? null;

  return (
    <AdminShell>
      <PageSEO
        title="Kunden"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/kunden"
        noindex
      />
      <PageHeader
        eyebrow="Verwaltung"
        title="Kunden"
        description="Alle Mieter dieses Mandanten mit Kontaktdaten, Dokumentgültigkeiten und Vertragshistorie."
      />

      <Panel className="mb-6">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, E-Mail oder Ort suchen"
            className={`${inputClass} pl-9`}
          />
        </label>
      </Panel>

      {isLoading ? (
        <Panel>Lade Kunden …</Panel>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Keine Kunden gefunden"
          text="Kunden werden automatisch angelegt, sobald du einen Mietvertrag erstellst."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel className="space-y-2">
            {filtered.map((customer) => (
              <div key={customer.id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelected(customer.id)}
                  className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    selected === customer.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {customer.last_name}, {customer.first_name}
                    </span>
                    <span className="block truncate text-xs opacity-80">
                      {customer.email ?? customer.phone ?? "keine Kontaktdaten"}
                    </span>
                  </span>
                </button>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() =>
                      setCustomerToDelete({
                        id: customer.id,
                        name: `${customer.first_name} ${customer.last_name}`,
                      })
                    }
                    disabled={deleteCustomer.isPending}
                    className="rounded-lg border border-destructive/40 p-2 text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                    title={`Kunde ${customer.first_name} ${customer.last_name} löschen`}
                    aria-label={`Kunde ${customer.first_name} ${customer.last_name} löschen`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </Panel>

          <Panel>
            {!active ? (
              <p className="text-sm text-muted-foreground">
                Wähle links einen Kunden, um die Kundenakte zu sehen.
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {active.first_name} {active.last_name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Kunde seit {formatDate(active.created_at)}
                  </p>
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">E-Mail</dt>
                    <dd className="break-all">{active.email ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Telefon</dt>
                    <dd>{active.phone ?? "-"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Adresse</dt>
                    <dd>
                      {[active.street, [active.postal_code, active.city].filter(Boolean).join(" ")]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Ausweis gültig bis</dt>
                    <dd>{formatDate(active.identity_expires_at)}</dd>
                  </div>
                </dl>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Mietverträge</h3>
                  {(rentals ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Noch keine Verträge.</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {(rentals ?? []).map((rental) => (
                        <li
                          key={rental.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary px-3 py-2"
                        >
                          <span className="font-medium">{rental.rental_number}</span>
                          <span className="text-muted-foreground">
                            {formatDate(rental.start_date)} – {formatDate(rental.end_date)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </Panel>
        </div>
      )}

      <AlertDialog
        open={customerToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteCustomer.isPending) setCustomerToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunde {customerToDelete?.name} löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dabei werden auch alle Mietverträge dieses Kunden mit Fahrern, Zahlungen, Übergabe-
              und Rückgabeprotokollen, Rechnungen, Schadensmarkern, Bankdaten sowie allen
              gespeicherten Dokumenten endgültig entfernt. Das kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCustomer.isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => customerToDelete && deleteCustomer.mutate(customerToDelete.id)}
              disabled={deleteCustomer.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCustomer.isPending ? "Löscht …" : "Endgültig löschen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
};

export default AdminCustomers;
