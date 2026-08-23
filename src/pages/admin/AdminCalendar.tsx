import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import PageSEO from "@/components/PageSEO";
import { PageHeader, Panel, secondaryButton } from "@/components/admin/AdminUI";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { useBookedDates } from "@/hooks/useBookedDates";
import { formatDate } from "@/admin/constants";

const AdminCalendar = () => {
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const { isDateBooked } = useBookedDates();

  const { data: rentals } = useQuery({
    queryKey: ["admin-calendar-rentals", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select("id, rental_number, status, start_date, end_date, customers(first_name, last_name)")
        .eq("tenant_id", tenant!.id)
        .neq("status", "cancelled")
        .order("start_date");
      if (error) throw error;
      return data ?? [];
    },
  });

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
      }),
    [month],
  );

  const rentalFor = (day: Date) =>
    (rentals ?? []).find((rental) => {
      const start = parseISO(rental.start_date);
      const end = parseISO(rental.end_date);
      return day >= start && day <= end;
    });

  const monthRentals = (rentals ?? []).filter(
    (rental) =>
      isSameMonth(parseISO(rental.start_date), month) || isSameMonth(parseISO(rental.end_date), month),
  );

  return (
    <AdminShell>
      <PageSEO
        title="Belegungskalender"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/kalender"
        noindex
      />
      <PageHeader
        eyebrow="Verwaltung"
        title="Belegungskalender"
        description="Eigene Mietverträge und Portal-Belegungen in einer Ansicht. Klick auf einen freien Tag startet einen neuen Mietvertrag."
        actions={
          <div className="flex items-center gap-2">
            <button
              className={secondaryButton}
              onClick={() => setMonth((value) => addMonths(value, -1))}
              aria-label="Vorheriger Monat"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[10rem] text-center text-sm font-semibold">
              {format(month, "LLLL yyyy", { locale: de })}
            </span>
            <button
              className={secondaryButton}
              onClick={() => setMonth((value) => addMonths(value, 1))}
              aria-label="Nächster Monat"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <Panel className="mb-6">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((label) => (
            <span key={label} className="py-1">
              {label}
            </span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const rental = rentalFor(day);
            const portal = !rental && isDateBooked(day);
            const outside = !isSameMonth(day, month);
            const iso = format(day, "yyyy-MM-dd");
            return (
              <button
                key={iso}
                onClick={() =>
                  rental
                    ? navigate(`/admin/mietvertraege?highlight=${rental.id}`)
                    : navigate(`/admin/mietvertrag/neu?start=${iso}`)
                }
                className={`min-h-[3.5rem] rounded-lg border p-1 text-left text-xs transition ${
                  outside ? "opacity-40" : ""
                } ${
                  rental
                    ? "border-primary bg-primary/20"
                    : portal
                      ? "border-destructive/40 bg-destructive/15"
                      : "border-border hover:bg-secondary"
                }`}
                title={
                  rental
                    ? `${rental.rental_number}`
                    : portal
                      ? "Portal-Belegung"
                      : "Freier Tag – neuen Vertrag anlegen"
                }
              >
                <span className="font-semibold">{format(day, "d")}</span>
                {rental && (
                  <span className="mt-1 block truncate">
                    {rental.customers
                      ? `${rental.customers.first_name} ${rental.customers.last_name}`
                      : rental.rental_number}
                  </span>
                )}
                {portal && <span className="mt-1 block truncate">Portal</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-primary bg-primary/20" /> Eigener Vertrag
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-destructive/40 bg-destructive/15" />
            Portal-Belegung
          </span>
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-3 text-sm font-semibold">Verträge in diesem Monat</h2>
        {monthRentals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Verträge in diesem Monat.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {monthRentals.map((rental) => (
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
      </Panel>
    </AdminShell>
  );
};

export default AdminCalendar;
