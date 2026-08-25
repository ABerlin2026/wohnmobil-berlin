import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addDays, format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import PageSEO from "@/components/PageSEO";
import {
  Field,
  PageHeader,
  Panel,
  inputClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/AdminUI";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  euroToCents,
  formatEuro,
  includedKilometres,
  rentalDays,
} from "@/lib/rentalCalculations";

const STEPS = ["Zeitraum & Fahrzeug", "Mieter & Fahrer", "Preis & Kaution"] as const;

interface DriverDraft {
  first_name: string;
  last_name: string;
  license_number: string;
  license_expires_at: string;
}

const AdminRentalWizard = () => {
  const { tenant, session } = useTenant();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const initialStart = params.get("start") ?? format(new Date(), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(() =>
    format(addDays(parseISO(initialStart), 4), "yyyy-MM-dd"),
  );
  const [vehicleId, setVehicleId] = useState("");
  const [destination, setDestination] = useState("");
  const [expectedKm, setExpectedKm] = useState("");

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
    license_number: "",
    license_expires_at: "",
  });
  const [extraDrivers, setExtraDrivers] = useState<DriverDraft[]>([]);

  const [priceEuro, setPriceEuro] = useState("");
  const [depositEuro, setDepositEuro] = useState("");
  const [freeKm, setFreeKm] = useState("150");
  const [extraKmPrice, setExtraKmPrice] = useState("0,35");

  useEffect(() => {
    if (tenant) {
      setDepositEuro((value) => value || String(tenant.default_deposit_cents / 100));
      setFreeKm((value) => value || String(tenant.free_km_per_day));
    }
  }, [tenant]);

  const { data: vehicles } = useQuery({
    queryKey: ["wizard-vehicles", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name")
        .eq("tenant_id", tenant!.id)
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!vehicleId && vehicles?.length) setVehicleId(vehicles[0].id);
  }, [vehicles, vehicleId]);

  const { data: conflicts } = useQuery({
    queryKey: ["wizard-conflicts", tenant?.id, vehicleId, startDate, endDate],
    enabled: !!tenant && !!vehicleId && !!startDate && !!endDate,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select("id, rental_number, start_date, end_date")
        .eq("tenant_id", tenant!.id)
        .eq("vehicle_id", vehicleId)
        .neq("status", "cancelled")
        .lte("start_date", endDate)
        .gte("end_date", startDate);
      if (error) throw error;
      return data ?? [];
    },
  });

  const days = useMemo(() => {
    try {
      return rentalDays(parseISO(startDate), parseISO(endDate));
    } catch {
      return 0;
    }
  }, [startDate, endDate]);

  const includedKm = useMemo(() => {
    try {
      return includedKilometres(parseISO(startDate), parseISO(endDate), Number(freeKm) || 0);
    } catch {
      return 0;
    }
  }, [startDate, endDate, freeKm]);

  const canContinue = () => {
    if (step === 0)
      return (
        !!vehicleId &&
        !!startDate &&
        !!endDate &&
        endDate >= startDate &&
        Number(expectedKm) > 0
      );
    if (step === 1) return !!customer.first_name.trim() && !!customer.last_name.trim();
    return true;
  };

  const save = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      const { data: created, error: customerError } = await supabase
        .from("customers")
        .insert({
          tenant_id: tenant.id,
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
        .select("id")
        .single();
      if (customerError) throw customerError;

      const rentalNumber = `MV-${format(new Date(), "yyyyMMdd-HHmmss")}`;
      const { data: rental, error: rentalError } = await supabase
        .from("rentals")
        .insert({
          tenant_id: tenant.id,
          vehicle_id: vehicleId,
          customer_id: created.id,
          rental_number: rentalNumber,
          status: "draft",
          start_date: startDate,
          end_date: endDate,
          destination: destination.trim() || null,
          expected_km: expectedKm ? Number(expectedKm) : null,
          free_km_per_day: Number(freeKm) || 0,
          extra_km_price_cents: euroToCents(extraKmPrice),
          deposit_cents: euroToCents(depositEuro),
          rental_price_cents: euroToCents(priceEuro),
          created_by: session?.user.id ?? null,
        })
        .select("id")
        .single();
      if (rentalError) throw rentalError;

      const drivers = [
        {
          tenant_id: tenant.id,
          rental_id: rental.id,
          customer_id: created.id,
          first_name: customer.first_name.trim(),
          last_name: customer.last_name.trim(),
          is_primary: true,
          license_number: customer.license_number.trim() || null,
          license_expires_at: customer.license_expires_at || null,
        },
        ...extraDrivers
          .filter((driver) => driver.first_name.trim() && driver.last_name.trim())
          .map((driver) => ({
            tenant_id: tenant.id,
            rental_id: rental.id,
            first_name: driver.first_name.trim(),
            last_name: driver.last_name.trim(),
            is_primary: false,
            license_number: driver.license_number.trim() || null,
            license_expires_at: driver.license_expires_at || null,
          })),
      ];
      const { error: driverError } = await supabase.from("drivers").insert(drivers);
      if (driverError) throw driverError;

      toast({ title: "Mietvertrag angelegt", description: rentalNumber });
      navigate("/admin/mietvertraege");
    } catch (error) {
      toast({
        title: "Speichern fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <PageSEO
        title="Neuer Mietvertrag"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/mietvertrag/neu"
        noindex
      />
      <PageHeader
        eyebrow="Verwaltung"
        title="Neuer Mietvertrag"
        description="Zeitraum prüfen, Mieter erfassen und Preise festlegen. Der Vertrag wird als Entwurf gespeichert."
      />

      <ol className="mb-6 flex flex-wrap gap-2 text-sm">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1.5 ${
              index === step
                ? "bg-primary text-primary-foreground"
                : index < step
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary text-muted-foreground"
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <Panel>
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fahrzeug">
              <select
                value={vehicleId}
                onChange={(event) => setVehicleId(event.target.value)}
                className={inputClass}
              >
                {(vehicles ?? []).map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Reiseziel" hint="Optional">
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Beginn">
              <input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  if (event.target.value > endDate) setEndDate(event.target.value);
                }}
                className={inputClass}
              />
            </Field>
            <Field label="Ende">
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Erwartete Kilometer *"
              hint="Pflichtfeld"
              error={
                expectedKm !== "" && !(Number(expectedKm) > 0)
                  ? "Bitte erwartete Kilometer größer 0 angeben."
                  : null
              }
            >
              <input
                type="number"
                min={1}
                required
                value={expectedKm}
                onChange={(event) => setExpectedKm(event.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2 rounded-xl bg-secondary p-3 text-sm">
              <p>
                Mietdauer: <strong>{days} Tage</strong>
              </p>
              {(conflicts ?? []).length > 0 && (
                <p className="mt-2 text-destructive">
                  Achtung: Überschneidung mit{" "}
                  {(conflicts ?? []).map((entry) => entry.rental_number).join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Vorname">
                <input
                  value={customer.first_name}
                  onChange={(event) => setCustomer({ ...customer, first_name: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Nachname">
                <input
                  value={customer.last_name}
                  onChange={(event) => setCustomer({ ...customer, last_name: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="E-Mail">
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Telefon">
                <input
                  value={customer.phone}
                  onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Straße und Hausnummer" className="sm:col-span-2">
                <input
                  value={customer.street}
                  onChange={(event) => setCustomer({ ...customer, street: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="PLZ">
                <input
                  value={customer.postal_code}
                  onChange={(event) => setCustomer({ ...customer, postal_code: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Ort">
                <input
                  value={customer.city}
                  onChange={(event) => setCustomer({ ...customer, city: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Ausweisnummer">
                <input
                  value={customer.identity_number}
                  onChange={(event) =>
                    setCustomer({ ...customer, identity_number: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Ausweis gültig bis">
                <input
                  type="date"
                  value={customer.identity_expires_at}
                  onChange={(event) =>
                    setCustomer({ ...customer, identity_expires_at: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Führerscheinnummer">
                <input
                  value={customer.license_number}
                  onChange={(event) =>
                    setCustomer({ ...customer, license_number: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Führerschein gültig bis">
                <input
                  type="date"
                  value={customer.license_expires_at}
                  onChange={(event) =>
                    setCustomer({ ...customer, license_expires_at: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Weitere Fahrer</h2>
                <button
                  className={secondaryButton}
                  onClick={() =>
                    setExtraDrivers((list) => [
                      ...list,
                      { first_name: "", last_name: "", license_number: "", license_expires_at: "" },
                    ])
                  }
                >
                  Fahrer hinzufügen
                </button>
              </div>
              {extraDrivers.map((driver, index) => (
                <div key={index} className="grid gap-3 rounded-xl bg-secondary p-3 sm:grid-cols-4">
                  <input
                    placeholder="Vorname"
                    value={driver.first_name}
                    onChange={(event) =>
                      setExtraDrivers((list) =>
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
                      setExtraDrivers((list) =>
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
                      setExtraDrivers((list) =>
                        list.map((entry, i) =>
                          i === index ? { ...entry, license_number: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                  <input
                    type="date"
                    value={driver.license_expires_at}
                    onChange={(event) =>
                      setExtraDrivers((list) =>
                        list.map((entry, i) =>
                          i === index ? { ...entry, license_expires_at: event.target.value } : entry,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mietpreis (EUR)">
              <input
                value={priceEuro}
                onChange={(event) => setPriceEuro(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Kaution (EUR)">
              <input
                value={depositEuro}
                onChange={(event) => setDepositEuro(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Freikilometer pro Tag">
              <input
                type="number"
                value={freeKm}
                onChange={(event) => setFreeKm(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Mehrkilometer (EUR/km)">
              <input
                value={extraKmPrice}
                onChange={(event) => setExtraKmPrice(event.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2 space-y-1 rounded-xl bg-secondary p-3 text-sm">
              <p>
                {days} Tage · {includedKm} Freikilometer inklusive
              </p>
              <p>
                Mietpreis {formatEuro(euroToCents(priceEuro))} · Kaution{" "}
                {formatEuro(euroToCents(depositEuro))}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            className={secondaryButton}
            onClick={() => (step === 0 ? navigate("/admin/mietvertraege") : setStep(step - 1))}
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? "Abbrechen" : "Zurück"}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className={primaryButton}
              disabled={!canContinue()}
              onClick={() => setStep(step + 1)}
            >
              Weiter
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button className={primaryButton} disabled={saving} onClick={() => void save()}>
              <Check className="h-4 w-4" />
              {saving ? "Speichert …" : "Entwurf speichern"}
            </button>
          )}
        </div>
      </Panel>
    </AdminShell>
  );
};

export default AdminRentalWizard;
