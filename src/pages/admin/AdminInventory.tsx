import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PackagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
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
import { euroToCents, formatEuro } from "@/lib/rentalCalculations";
import { toast } from "@/hooks/use-toast";

interface ComponentDraft {
  id?: string;
  name: string;
  quantity: number;
  sort_order: number;
}

interface ItemDraft {
  id?: string;
  name: string;
  item_type: "single" | "set";
  quantity: number;
  quantityText: string;
  priceText: string;
  sort_order: number;
  active: boolean;
  components: ComponentDraft[];
}

const emptyDraft = (sortOrder: number): ItemDraft => ({
  name: "",
  item_type: "single",
  quantity: 1,
  quantityText: "1",
  priceText: "",
  sort_order: sortOrder,
  active: true,
  components: [],
});

const AdminInventory = () => {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ItemDraft | null>(null);

  const { data: vehicles } = useQuery({
    queryKey: ["admin-vehicles", tenant?.id],
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

  const [vehicleId, setVehicleId] = useState<string>("");
  useEffect(() => {
    if (!vehicleId && vehicles?.length) setVehicleId(vehicles[0].id);
  }, [vehicles, vehicleId]);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-inventory", tenant?.id, vehicleId],
    enabled: !!tenant && !!vehicleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(
          "id, name, item_type, quantity, replacement_price_cents, sort_order, active, inventory_components(id, name, quantity, sort_order)",
        )
        .eq("tenant_id", tenant!.id)
        .eq("vehicle_id", vehicleId)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (draft: ItemDraft) => {
      if (!tenant || !vehicleId) throw new Error("Kein Fahrzeug gewählt");
      const payload = {
        tenant_id: tenant.id,
        vehicle_id: vehicleId,
        name: draft.name.trim(),
        item_type: draft.item_type,
        quantity: Math.max(1, Number(draft.quantityText.replace(",", ".")) || 1),
        replacement_price_cents: Math.max(0, euroToCents(draft.priceText || "0")),
        sort_order: draft.sort_order,
        active: draft.active,
      };
      let itemId = draft.id;
      if (itemId) {
        const { error } = await supabase.from("inventory_items").update(payload).eq("id", itemId);
        if (error) throw error;
        const { error: delError } = await supabase
          .from("inventory_components")
          .delete()
          .eq("inventory_item_id", itemId);
        if (delError) throw delError;
      } else {
        const { data, error } = await supabase
          .from("inventory_items")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        itemId = data.id;
      }
      if (draft.item_type === "set" && draft.components.length) {
        const { error } = await supabase.from("inventory_components").insert(
          draft.components
            .filter((component) => component.name.trim())
            .map((component, index) => ({
              tenant_id: tenant.id,
              inventory_item_id: itemId!,
              name: component.name.trim(),
              quantity: Math.max(1, component.quantity),
              sort_order: index,
            })),
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setEditing(null);
      toast({ title: "Inventarposition gespeichert" });
      void queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    },
    onError: (error: Error) => toast({ title: "Speichern fehlgeschlagen", description: error.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inventory_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Position gelöscht" });
      void queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    },
    onError: (error: Error) => toast({ title: "Löschen fehlgeschlagen", description: error.message }),
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (items ?? []).filter((item) => item.name.toLowerCase().includes(term));
  }, [items, search]);

  const nextSortOrder = ((items ?? []).at(-1)?.sort_order ?? 0) + 10;

  return (
    <AdminShell>
      <PageSEO
        title="Inventarliste"
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/inventar"
        noindex
      />
      <PageHeader
        eyebrow="Fahrzeugvorlage"
        title="Inventarliste"
        description="Diese Liste wird beim Anlegen eines Mietvertrags als unveränderbare Momentaufnahme übernommen."
        actions={
          <button onClick={() => setEditing(emptyDraft(nextSortOrder))} className={primaryButton}>
            <Plus className="h-4 w-4" /> Position
          </button>
        }
      />

      <Panel className="mb-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Inventar durchsuchen …"
            className={inputClass}
          />
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}>
            {(vehicles ?? []).map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {(items ?? []).length} Positionen ·{" "}
          {formatEuro(
            (items ?? []).reduce(
              (sum, item) =>
                sum +
                item.replacement_price_cents * (item.item_type === "set" ? 1 : item.quantity),
              0,
            ),
          )}{" "}
          Gesamtwert
        </p>
      </Panel>

      <Panel>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Lade Inventar …</p>
        ) : filtered.length === 0 ? (
          <EmptyState title="Keine Positionen" text="Füge die erste Inventarposition hinzu." />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {item.quantity}× {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.item_type === "set" ? "Set" : "Einzelartikel"} ·{" "}
                    {formatEuro(item.replacement_price_cents)} Ersatzpreis
                    {item.item_type === "set" && item.inventory_components?.length
                      ? ` · ${item.inventory_components
                          .map((component) => `${component.quantity}× ${component.name}`)
                          .join(", ")}`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setEditing({
                        id: item.id,
                        name: item.name,
                        item_type: item.item_type as "single" | "set",
                         quantity: item.quantity,
                         quantityText: String(item.quantity),
                         priceText: (item.replacement_price_cents / 100)
                           .toFixed(2)
                           .replace(".", ","),
                        sort_order: item.sort_order,
                        active: item.active,
                        components: (item.inventory_components ?? []).map((component) => ({
                          id: component.id,
                          name: component.name,
                          quantity: component.quantity,
                          sort_order: component.sort_order,
                        })),
                      })
                    }
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                    aria-label="Bearbeiten"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove.mutate(item.id)}
                    className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                    aria-label="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">Inventarposition</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name" className="sm:col-span-2">
                <input
                  autoFocus
                  value={editing.name}
                  onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Art">
                <select
                  value={editing.item_type}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      item_type: event.target.value as "single" | "set",
                      components: event.target.value === "set" ? editing.components : [],
                    })
                  }
                  className={inputClass}
                >
                  <option value="single">Einzelartikel</option>
                  <option value="set">Set</option>
                </select>
              </Field>
              <Field label="Sollmenge">
                <input
                  type="text"
                  inputMode="numeric"
                  value={editing.quantityText}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      quantityText: event.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  onBlur={() =>
                    setEditing((current) =>
                      current
                        ? { ...current, quantityText: String(Math.max(1, Number(current.quantityText) || 1)) }
                        : current,
                    )
                  }
                  className={inputClass}
                />
              </Field>
              <Field
                label={`Ersatzpreis ${editing.item_type === "set" ? "des gesamten Sets" : "je Artikel"} in EUR`}
                className="sm:col-span-2"
                hint="Dezimaltrennzeichen: Komma oder Punkt, z. B. 12,50"
              >
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={editing.priceText}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      priceText: event.target.value.replace(/[^0-9.,]/g, ""),
                    })
                  }
                  onBlur={() =>
                    setEditing((current) =>
                      current
                        ? {
                            ...current,
                            priceText: (euroToCents(current.priceText || "0") / 100)
                              .toFixed(2)
                              .replace(".", ","),
                          }
                        : current,
                    )
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            {editing.item_type === "set" && (
              <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Set-Bestandteile</h3>
                    <p className="text-xs text-muted-foreground">
                      Fehlt ein Bestandteil, gilt der Ersatzpreis des gesamten Sets.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditing({
                        ...editing,
                        components: [
                          ...editing.components,
                          { name: "", quantity: 1, sort_order: editing.components.length },
                        ],
                      })
                    }
                    className={secondaryButton}
                  >
                    <PackagePlus className="h-4 w-4" /> Artikel
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {editing.components.map((component, index) => (
                    <div key={index} className="grid grid-cols-[90px_1fr_40px] gap-2">
                      <input
                        type="number"
                        min="1"
                        value={component.quantity}
                        onChange={(event) => {
                          const components = [...editing.components];
                          components[index] = { ...component, quantity: Number(event.target.value) };
                          setEditing({ ...editing, components });
                        }}
                        className={inputClass}
                      />
                      <input
                        value={component.name}
                        placeholder="z. B. Gabeln"
                        onChange={(event) => {
                          const components = [...editing.components];
                          components[index] = { ...component, name: event.target.value };
                          setEditing({ ...editing, components });
                        }}
                        className={inputClass}
                      />
                      <button
                        onClick={() =>
                          setEditing({
                            ...editing,
                            components: editing.components.filter((_, i) => i !== index),
                          })
                        }
                        className="text-destructive"
                        aria-label="Entfernen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className={secondaryButton}>
                Abbrechen
              </button>
              <button
                onClick={() => editing.name.trim() && save.mutate(editing)}
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

export default AdminInventory;
