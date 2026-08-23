import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  FilePlus2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import PageSEO from "@/components/PageSEO";
import { EmptyState, PageHeader, Panel, StatusBadge, primaryButton } from "@/components/admin/AdminUI";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/admin/constants";
import { formatEuro } from "@/lib/rentalCalculations";

const today = () => new Date().toISOString().slice(0, 10);

const AdminDashboard = () => {
  const { tenant } = useTenant();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data: rentals, error } = await supabase
        .from("rentals")
        .select(
          "id, rental_number, status, start_date, end_date, rental_price_cents, deposit_cents, deposit_paid_cents, customers(first_name, last_name)",
        )
        .eq("tenant_id", tenant!.id)
        .order("start_date", { ascending: true });
      if (error) throw error;
      return rentals ?? [];
    },
  });

  const rentals = data ?? [];
  const day = today();
  const handoversToday = rentals.filter((r) => r.start_date === day);
  const returnsToday = rentals.filter((r) => r.end_date === day);
  const overdue = rentals.filter(
    (r) => r.end_date < day && !["completed", "cancelled"].includes(r.status),
  );
  const billingOpen = rentals.filter((r) => ["billing_open", "damage_review"].includes(r.status));
  const upcoming = rentals
    .filter((r) => r.end_date >= day && !["completed", "cancelled"].includes(r.status))
    .slice(0, 8);

  const cards = [
    { label: "Übergaben heute", value: handoversToday.length, icon: ClipboardCheck },
    { label: "Rückgaben heute", value: returnsToday.length, icon: CalendarClock },
    { label: "Überfällig", value: overdue.length, icon: AlertTriangle },
    { label: "Abrechnung offen", value: billingOpen.length, icon: CircleDollarSign },
  ];

  return (
    <AdminShell>
      <PageSEO
        title="Übersicht"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin"
        noindex
      />
      <PageHeader
        eyebrow="Mandantenbereich"
        title="Übersicht"
        description="Alle Aufgaben des Tages und offene Vorgänge auf einen Blick."
        actions={
          <Link to="/admin/mietvertrag/neu" className={primaryButton}>
            <FilePlus2 className="h-4 w-4" />
            Neuer Mietvertrag
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Panel key={label} className="flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{isLoading ? "…" : value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Laufende und kommende Mietverträge</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            title="Keine offenen Mietverträge"
            text="Sobald ein Vertrag angelegt ist, erscheint er hier."
          />
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((rental) => (
              <li key={rental.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">
                    {rental.rental_number} ·{" "}
                    {rental.customers
                      ? `${rental.customers.first_name} ${rental.customers.last_name}`
                      : "Kunde offen"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(rental.start_date)} – {formatDate(rental.end_date)} ·{" "}
                    {formatEuro(rental.rental_price_cents)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={rental.status} />
                  <Link
                    to={`/admin/mietvertrag/${rental.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary"
                  >
                    Öffnen <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AdminShell>
  );
};

export default AdminDashboard;
