import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

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
import { RENTAL_STATUS } from "@/admin/constants";
import { TANK_LEVELS, euroToCents, formatEuro } from "@/lib/rentalCalculations";
import { toast } from "@/hooks/use-toast";

const centsToEuro = (cents?: number | null) =>
  typeof cents === "number" ? (cents / 100).toFixed(2).replace(".", ",") : "";

interface DriverRow {
  id?: string;
  first_name: string;
  last_name: string;
  is_primary: boolean;
  license_number: string;
  license_expires_at: string;
}

const AdminRentalEdit = () => {
  const { id } = useParams();
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    status: "draft",
    vehicle_id: "",
    start_date: "",
    end_date: "",
    handover_time: "",
    return_time: "",
    handover_location: "",
    return_location: "",
    destination: "",
    planned_route: "",
    expected_km: "",
    free_km_per_day: "",
    extra_km_price: "",
    rental_price: "",
    deposit: "",
    tank_handover: "",
  });
  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "",
    postal_code: "",
    city: "",
    identity_number: "",
    identity_expires_at: "",
  });
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [removedDriverIds, setRemovedDriverIds] = useState<string[]>([]);

  const { data: rental, isLoading } = useQuery({
    queryKey: ["admin-rental-edit", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select("*, customers(*), drivers(*)")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: vehicles } = useQuery({
    queryKey: ["edit-vehicles", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name")
        .eq("tenant_id", tenant!.id)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!rental) return;
    setForm({
      status: rental.status ?? "draft",
      vehicle_id: rental.vehicle_id ?? "",
      start_date: rental.start_date ?? "",
      end_date: rental.end_date ?? "",
      handover_time: rental.handover_time?.slice(0, 5) ?? "",
      return_time: rental.return_time?.slice(0, 5) ?? "",
      handover_location: rental.handover_location ?? "",
      return_location: rental.return_location ?? "",
      destination: rental.destination ?? "",
      planned_route: rental.planned_route ?? "",
      expected_km: rental.expected_km != null ? String(rental.expected_km) : "",
      free_km_per_day: String(rental.free_km_per_day ?? 0),
      extra_km_price: centsToEuro(rental.extra_km_price_cents),
      rental_price: centsToEuro(rental.rental_price_cents),
      deposit: centsToEuro(rental.deposit_cents),
      tank_handover: rental.tank_handover ?? "",
    });
    const c = rental.customers;
    if (c) {
      setCustomer({
        first_name: c.first_name ?? "",
        last_name: c.last_name ?? "",
        email: c.email ?? "",
        phone: c.phone ?? "",
        street: c.street ?? "",
        postal_code: c.postal_code ?? "",
        city: c.city ?? "",
        identity_number: c.identity_number ?? "",
        identity_expires_at: c.identity_expires_at ?? "",
      });
    }
    setDrivers(
      (rental.drivers ?? [])
        .slice()
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
        .map((driver) => ({
          id: driver.id,
          first_name: driver.first_name ?? "",
          last_name: driver.last_name ?? "",
          is_primary: driver.is_primary,
          license_number: driver.license_number ?? "",
          license_expires_at: driver.license_expires_at ?? "",
        })),
    );
    setRemovedDriverIds([]);
  }, [rental]);

  const invalidDates =
    !!form.start_date && !!form.end_date && form.end_date < form.start_date;
  const invalidExpectedKm = !(Number(form.expected_km) > 0);
  const missingCustomer = (
    [
      "first_name",
      "last_name",
      "email",
      "phone",
      "street",
      "postal_code",
      "city",
      "identity_number",
      "identity_expires_at",
    ] as const
  ).some((key) => !customer[key].trim());

  const save = useMutation({
    mutationFn: async () => {
      if (!rental || !tenant) throw new Error("Kein Mietvertrag");
      const { error: rentalError } = await supabase
        .from("rentals")
        .update({
          status: form.status,
          vehicle_id: form.vehicle_id || null,
          start_date: form.start_date,
          end_date: form.end_date,
          handover_time: form.handover_time || null,
          return_time: form.return_time || null,
          handover_location: form.handover_location.trim() || null,
          return_location: form.return_location.trim() || null,
          destination: form.destination.trim() || null,
          planned_route: form.planned_route.trim() || null,
          expected_km: form.expected_km ? Number(form.expected_km) : null,
          free_km_per_day: Number(form.free_km_per_day) || 0,
          extra_km_price_cents: euroToCents(form.extra_km_price),
          rental_price_cents: euroToCents(form.rental_price),
          deposit_cents: euroToCents(form.deposit),
          tank_handover: form.tank_handover || null,
        })
        .eq("id", rental.id);
      if (rentalError) throw rentalError;

      if (rental.customer_id) {
        const { error: customerError } = await supabase
          .from("customers")
          .update({
            first_name: customer.first_name.trim(),
            last_name: customer.last_name.trim(),
            email: customer.email.trim() || null,
            phone: customer.phone.trim() || null,
            street: customer.street.trim() || null,
            postal_code: customer.postal_code.trim() || null,
            city: customer.city.trim() || null,
            identity_number: customer.identity_number.trim() || null,
            identity_expires_at: customer.identity_expires_at || null,
          })
          .eq("id", rental.customer_id);
        if (customerError) throw customerError;
      }

      for (const driverId of removedDriverIds) {
        const { error } = await supabase.from("drivers").delete().eq("id", driverId);
        if (error) throw error;
      }

      for (const driver of drivers) {
        if (!driver.first_name.trim() && !driver.last_name.trim()) continue;
        const payload = {
          first_name: driver.first_name.trim(),
          last_name: driver.last_name.trim(),
          license_number: driver.license_number.trim() || null,
          license_expires_at: driver.license_expires_at || null,
        };
        if (driver.id) {
          const { error } = await supabase.from("drivers").update(payload).eq("id", driver.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("drivers").insert({
            ...payload,
            tenant_id: tenant.id,
            rental_id: rental.id,
            is_primary: false,
          });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast({ title: "Mietvertrag aktualisiert" });
      void queryClient.invalidateQueries({ queryKey: ["admin-rental", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-rental-drivers", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-rentals"] });
      navigate(`/admin/mietvertrag/${id}`);
    },
    onError: (error: Error) =>
      toast({
        title: "Speichern fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      }),
  });

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
        <EmptyState
          title="Mietvertrag nicht gefunden"
          text="Der Vertrag existiert nicht oder gehört zu einem anderen Mandanten."
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <PageSEO
        title={`Mietvertrag ${rental.rental_number} bearbeiten`}
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/mietvertraege"
        noindex
      />
      <PageHeader
        eyebrow="Mietvertrag bearbeiten"
        title={rental.rental_number}
        description="Tippfehler und Änderungen korrigieren. Änderungen gelten sofort für neue PDFs."
        actions={
          <>
            <Link to={`/admin/mietvertrag/${rental.id}`} className={secondaryButton}>
              <ArrowLeft className="h-4 w-4" /> Zurück
            </Link>
            <button
              onClick={() => !invalidDates && !invalidExpectedKm && !missingCustomer && save.mutate()}
              disabled={save.isPending || invalidDates || invalidExpectedKm || missingCustomer}
              className={primaryButton}
            >
              <Save className="h-4 w-4" />
              {save.isPending ? "Speichert …" : "Änderungen speichern"}
            </button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-semibold">Vertrag &amp; Zeitraum</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className={inputClass}
              >
                {Object.entries(RENTAL_STATUS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fahrzeug">
              <select
                value={form.vehicle_id}
                onChange={(event) => setForm({ ...form, vehicle_id: event.target.value })}
                className={inputClass}
              >
                <option value="">Kein Fahrzeug</option>
                {(vehicles ?? []).map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Beginn"
              error={invalidDates ? "Ende darf nicht vor dem Beginn liegen." : null}
            >
              <input
                type="date"
                value={form.start_date}
                onChange={(event) => setForm({ ...form, start_date: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Ende">
              <input
                type="date"
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={(event) => setForm({ ...form, end_date: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Übergabezeit">
              <input
                type="time"
                value={form.handover_time}
                onChange={(event) => setForm({ ...form, handover_time: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Rückgabezeit">
              <input
                type="time"
                value={form.return_time}
                onChange={(event) => setForm({ ...form, return_time: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Übergabeort">
              <input
                value={form.handover_location}
                onChange={(event) => setForm({ ...form, handover_location: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Rückgabeort">
              <input
                value={form.return_location}
                onChange={(event) => setForm({ ...form, return_location: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Reiseziel">
              <input
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Tankstand bei Übergabe">
              <select
                value={form.tank_handover}
                onChange={(event) => setForm({ ...form, tank_handover: event.target.value })}
                className={inputClass}
              >
                <option value="">Keine Angabe</option>
                {TANK_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Geplante Route" className="sm:col-span-2">
              <input
                value={form.planned_route}
                onChange={(event) => setForm({ ...form, planned_route: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">Preise &amp; Kilometer</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Mietpreis (EUR)">
              <input
                value={form.rental_price}
                inputMode="decimal"
                onChange={(event) => setForm({ ...form, rental_price: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Kaution (EUR)">
              <input
                value={form.deposit}
                inputMode="decimal"
                onChange={(event) => setForm({ ...form, deposit: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Freikilometer je Miettag">
              <input
                type="number"
                min={0}
                value={form.free_km_per_day}
                onChange={(event) => setForm({ ...form, free_km_per_day: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Mehrkilometer (EUR je km)">
              <input
                value={form.extra_km_price}
                inputMode="decimal"
                onChange={(event) => setForm({ ...form, extra_km_price: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field
              label="Erwartete Kilometer *"
              hint="Pflichtfeld"
              error={invalidExpectedKm ? "Bitte erwartete Kilometer größer 0 angeben." : null}
            >
              <input
                type="number"
                min={1}
                required
                value={form.expected_km}
                onChange={(event) => setForm({ ...form, expected_km: event.target.value })}
                className={inputClass}
              />
            </Field>
            <div className="rounded-xl bg-secondary p-3 text-sm sm:col-span-2">
              Mietpreis {formatEuro(euroToCents(form.rental_price))} · Kaution{" "}
              {formatEuro(euroToCents(form.deposit))} · Mehrkilometer{" "}
              {formatEuro(euroToCents(form.extra_km_price))} je km
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">Mieter</h2>
          {rental.customer_id ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Vorname *">
                <input
                  value={customer.first_name}
                  onChange={(event) => setCustomer({ ...customer, first_name: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Nachname *">
                <input
                  value={customer.last_name}
                  onChange={(event) => setCustomer({ ...customer, last_name: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="E-Mail *">
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Telefon *">
                <input
                  value={customer.phone}
                  onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Straße und Hausnummer *" className="sm:col-span-2">
                <input
                  value={customer.street}
                  onChange={(event) => setCustomer({ ...customer, street: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="PLZ *">
                <input
                  value={customer.postal_code}
                  onChange={(event) => setCustomer({ ...customer, postal_code: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Ort *">
                <input
                  value={customer.city}
                  onChange={(event) => setCustomer({ ...customer, city: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Ausweisnummer *">
                <input
                  value={customer.identity_number}
                  onChange={(event) =>
                    setCustomer({ ...customer, identity_number: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Ausweis gültig bis *">
                <input
                  type="date"
                  value={customer.identity_expires_at}
                  onChange={(event) =>
                    setCustomer({ ...customer, identity_expires_at: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Diesem Vertrag ist kein Mieter zugeordnet.
            </p>
          )}
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Fahrer</h2>
            <button
              className={secondaryButton}
              onClick={() =>
                setDrivers((list) => [
                  ...list,
                  {
                    first_name: "",
                    last_name: "",
                    is_primary: false,
                    license_number: "",
                    license_expires_at: "",
                  },
                ])
              }
            >
              Fahrer hinzufügen
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {drivers.map((driver, index) => (
              <div key={driver.id ?? `new-${index}`} className="rounded-xl bg-secondary p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Vorname"
                    value={driver.first_name}
                    onChange={(event) =>
                      setDrivers((list) =>
                        list.map((entry, i) =>
                          i === index ? { ...entry, first_name: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                  <input
                    placeholder="Nachname"
                    value={driver.last_name}
                    onChange={(event) =>
                      setDrivers((list) =>
                        list.map((entry, i) =>
                          i === index ? { ...entry, last_name: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                  <input
                    placeholder="Führerscheinnummer"
                    value={driver.license_number}
                    onChange={(event) =>
                      setDrivers((list) =>
                        list.map((entry, i) =>
                          i === index ? { ...entry, license_number: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                  <input
                    type="date"
                    title="Führerschein gültig bis"
                    value={driver.license_expires_at}
                    onChange={(event) =>
                      setDrivers((list) =>
                        list.map((entry, i) =>
                          i === index ? { ...entry, license_expires_at: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{driver.is_primary ? "Hauptfahrer" : "Zusätzlicher Fahrer"}</span>
                  {!driver.is_primary && (
                    <button
                      onClick={() => {
                        if (
                          driver.id &&
                          !window.confirm("Diesen Fahrer dauerhaft aus dem Vertrag entfernen?")
                        )
                          return;
                        if (driver.id) setRemovedDriverIds((ids) => [...ids, driver.id!]);
                        setDrivers((list) => list.filter((_, i) => i !== index));
                      }}
                      className="inline-flex items-center gap-1 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Entfernen
                    </button>
                  )}
                </div>
              </div>
            ))}
            {drivers.length === 0 && (
              <p className="text-sm text-muted-foreground">Noch keine Fahrer eingetragen.</p>
            )}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
};

export default AdminRentalEdit;
