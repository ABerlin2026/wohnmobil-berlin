import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CarFront, Plus, Upload } from "lucide-react";
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
import { VEHICLE_SIDES } from "@/admin/constants";
import { toast } from "@/hooks/use-toast";

type VehicleRow = {
  id: string;
  name: string;
  make: string | null;
  model: string | null;
  registration_number: string | null;
  vin: string | null;
  active: boolean;
  diagram_front_url: string | null;
  diagram_rear_url: string | null;
  diagram_driver_url: string | null;
  diagram_passenger_url: string | null;
};

const DIAGRAM_COLUMN: Record<string, keyof VehicleRow> = {
  front: "diagram_front_url",
  rear: "diagram_rear_url",
  driver: "diagram_driver_url",
  passenger: "diagram_passenger_url",
};

const AdminVehicles = () => {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<VehicleRow> | null>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles-full", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select(
          "id, name, make, model, registration_number, vin, active, diagram_front_url, diagram_rear_url, diagram_driver_url, diagram_passenger_url",
        )
        .eq("tenant_id", tenant!.id)
        .order("name");
      if (error) throw error;
      return (data ?? []) as VehicleRow[];
    },
  });

  const { data: damages } = useQuery({
    queryKey: ["admin-damages", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("damage_markers")
        .select("id, vehicle_id, vehicle_side, marker_label, description, status, severity")
        .eq("tenant_id", tenant!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (vehicle: Partial<VehicleRow>) => {
      if (!tenant) throw new Error("Kein Mandant");
      const payload = {
        tenant_id: tenant.id,
        name: (vehicle.name ?? "").trim(),
        make: vehicle.make ?? null,
        model: vehicle.model ?? null,
        registration_number: vehicle.registration_number ?? null,
        vin: vehicle.vin ?? null,
        active: vehicle.active ?? true,
      };
      if (vehicle.id) {
        const { error } = await supabase.from("vehicles").update(payload).eq("id", vehicle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vehicles").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setDraft(null);
      toast({ title: "Fahrzeug gespeichert" });
      void queryClient.invalidateQueries({ queryKey: ["admin-vehicles-full"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
    },
    onError: (error: Error) => toast({ title: "Speichern fehlgeschlagen", description: error.message }),
  });

  const uploadDiagram = async (vehicle: VehicleRow, side: string, file: File) => {
    if (!tenant) return;
    const path = `${tenant.id}/vehicles/${vehicle.id}/${side}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("rental-documents").upload(path, file, {
      upsert: true,
    });
    if (error) {
      toast({ title: "Upload fehlgeschlagen", description: error.message });
      return;
    }
    const { error: updateError } = await supabase
      .from("vehicles")
      .update({ [DIAGRAM_COLUMN[side]]: path })
      .eq("id", vehicle.id);
    if (updateError) {
      toast({ title: "Speichern fehlgeschlagen", description: updateError.message });
      return;
    }
    toast({ title: "Skizze hochgeladen" });
    void queryClient.invalidateQueries({ queryKey: ["admin-vehicles-full"] });
  };

  return (
    <AdminShell>
      <PageSEO
        title="Fahrzeuge"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/fahrzeuge"
        noindex
      />
      <PageHeader
        eyebrow="Mandantenbereich"
        title="Fahrzeuge"
        description="Fahrzeugstammdaten, die vier Schaden-Skizzen und die Schadenshistorie."
        actions={
          <button onClick={() => setDraft({ active: true })} className={primaryButton}>
            <Plus className="h-4 w-4" /> Fahrzeug
          </button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Lade Fahrzeuge …</p>
      ) : (vehicles ?? []).length === 0 ? (
        <EmptyState title="Noch kein Fahrzeug" text="Lege das erste Fahrzeug an." />
      ) : (
        <div className="space-y-4">
          {(vehicles ?? []).map((vehicle) => {
            const vehicleDamages = (damages ?? []).filter((entry) => entry.vehicle_id === vehicle.id);
            return (
              <Panel key={vehicle.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                      <CarFront className="h-5 w-5 text-primary" />
                      {vehicle.name}
                      {!vehicle.active && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          inaktiv
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {[vehicle.make, vehicle.model, vehicle.registration_number, vehicle.vin]
                        .filter(Boolean)
                        .join(" · ") || "Keine weiteren Stammdaten"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDraft(vehicle)} className={secondaryButton}>
                      Bearbeiten
                    </button>
                    <Link to="/admin/inventar" className={secondaryButton}>
                      Inventar
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {VEHICLE_SIDES.map((side) => {
                    const stored = vehicle[DIAGRAM_COLUMN[side.value]] as string | null;
                    return (
                      <div key={side.value} className="rounded-xl border border-border p-3">
                        <p className="text-sm font-medium">{side.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stored ? "Skizze hinterlegt" : "Keine Skizze"}
                        </p>
                        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-primary">
                          <Upload className="h-3.5 w-3.5" />
                          Skizze wählen
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadDiagram(vehicle, side.value, file);
                            }}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold">Schadenshistorie ({vehicleDamages.length})</h3>
                  {vehicleDamages.length === 0 ? (
                    <p className="mt-1 text-sm text-muted-foreground">Keine Schäden erfasst.</p>
                  ) : (
                    <ul className="mt-2 divide-y divide-border text-sm">
                      {vehicleDamages.slice(0, 8).map((damage) => (
                        <li key={damage.id} className="py-2">
                          <span className="font-medium">{damage.marker_label}</span> ·{" "}
                          {VEHICLE_SIDES.find((s) => s.value === damage.vehicle_side)?.label} ·{" "}
                          {damage.description}{" "}
                          <span className="text-muted-foreground">({damage.status})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
            <h2 className="text-xl font-semibold">Fahrzeug</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Bezeichnung" className="sm:col-span-2">
                <input
                  value={draft.name ?? ""}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Hersteller">
                <input
                  value={draft.make ?? ""}
                  onChange={(event) => setDraft({ ...draft, make: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Modell">
                <input
                  value={draft.model ?? ""}
                  onChange={(event) => setDraft({ ...draft, model: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Kennzeichen">
                <input
                  value={draft.registration_number ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, registration_number: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Fahrgestellnummer">
                <input
                  value={draft.vin ?? ""}
                  onChange={(event) => setDraft({ ...draft, vin: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.active ?? true}
                  onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
                />
                Fahrzeug ist aktiv und buchbar
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setDraft(null)} className={secondaryButton}>
                Abbrechen
              </button>
              <button
                onClick={() => (draft.name ?? "").trim() && save.mutate(draft)}
                disabled={save.isPending}
                className={primaryButton}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminVehicles;
