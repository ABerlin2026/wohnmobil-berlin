import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Camera, Save, ShieldCheck } from "lucide-react";
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
import VehicleDiagram from "@/components/admin/VehicleDiagram";
import SignaturePad from "@/components/admin/SignaturePad";
import { useTenant } from "@/admin/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { DAMAGE_AREAS, DAMAGE_SEVERITY, INVENTORY_STATUS, VEHICLE_SIDES } from "@/admin/constants";
import { DIAGRAM_COLUMN, type VehicleSideValue } from "@/admin/vehicleDiagrams";
import {
  TANK_LEVELS,
  depositSettlement,
  euroToCents,
  extraKilometreCharge,
  formatEuro,
  includedKilometres,
  inventoryDeduction,
} from "@/lib/rentalCalculations";
import { formatIban, isValidIban, normaliseIban } from "@/lib/iban";
import { toast } from "@/hooks/use-toast";

type Mode = "handover" | "return";

interface InventoryLine {
  inventory_item_id: string;
  name: string;
  item_type: string;
  quantity: number;
  replacement_price_cents: number;
  components: { name: string; quantity: number }[];
  status: string;
  missing_quantity: number;
  damaged_quantity: number;
  notes: string;
}

const dataUrlToBlob = (dataUrl: string) => {
  const [meta, base64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(meta)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
};

const AdminInspection = ({ mode }: { mode: Mode }) => {
  const { id } = useParams();
  const { tenant, session } = useTenant();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isReturn = mode === "return";

  const [values, setValues] = useState({
    odometer: "",
    tank_level: "full",
    gas_bottles: "2",
    fresh_water: "",
    waste_water: "",
    motor_oil: "",
    keys_count: "2",
    vehicle_papers: true,
    onboard_tools: true,
    warning_triangle: true,
    first_aid_kit: true,
    safety_vests: "4",
    car_jack: true,
    tire_tread: "",
    cleaning_status: "",
    delay_minutes: "0",
    actual_return_at: new Date().toISOString().slice(0, 16),
    notes: "",
  });
  const [confirmations, setConfirmations] = useState({
    instruction_complete: false,
    no_open_questions: false,
    no_new_damage_confirmed: false,
  });
  const [customerSignature, setCustomerSignature] = useState<string | null>(null);
  const [staffSignature, setStaffSignature] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryLine[]>([]);
  const [bank, setBank] = useState({ account_holder: "", iban: "", bic: "", confirmed: false });
  const [activeSide, setActiveSide] = useState<VehicleSideValue | "interior">("front");
  const [newMarker, setNewMarker] = useState<{ x: number; y: number } | null>(null);
  const [markerDraft, setMarkerDraft] = useState<{
    damage_type: string;
    severity: string;
    description: string;
    media: File | null;
  }>({
    damage_type: "",
    severity: "light",
    description: "",
    media: null,
  });
  const [overviewPhotos, setOverviewPhotos] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data: rental, isLoading } = useQuery({
    queryKey: ["inspection-rental", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select("*, vehicles(*), customers(first_name, last_name, id)")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: inspection } = useQuery({
    queryKey: ["inspection", id, mode],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspections")
        .select("*")
        .eq("rental_id", id!)
        .eq("inspection_type", mode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: handoverInspection } = useQuery({
    queryKey: ["inspection", id, "handover"],
    enabled: !!id && isReturn,
    queryFn: async () => {
      const { data } = await supabase
        .from("inspections")
        .select("id, odometer, tank_level")
        .eq("rental_id", id!)
        .eq("inspection_type", "handover")
        .maybeSingle();
      return data;
    },
  });

  const { data: items } = useQuery({
    queryKey: ["inspection-inventory-items", tenant?.id],
    enabled: !!tenant,
    queryFn: async () => {
      const [{ data: itemRows, error }, { data: componentRows }] = await Promise.all([
        supabase
          .from("inventory_items")
          .select("id, name, item_type, quantity, replacement_price_cents, sort_order")
          .eq("tenant_id", tenant!.id)
          .eq("active", true)
          .order("sort_order"),
        supabase
          .from("inventory_components")
          .select("inventory_item_id, name, quantity, sort_order")
          .eq("tenant_id", tenant!.id)
          .order("sort_order"),
      ]);
      if (error) throw error;
      return (itemRows ?? []).map((item) => ({
        ...item,
        components: (componentRows ?? []).filter((c) => c.inventory_item_id === item.id),
      }));
    },
  });

  const { data: markers, refetch: refetchMarkers } = useQuery({
    queryKey: ["inspection-markers", rental?.vehicle_id],
    enabled: !!rental?.vehicle_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("damage_markers")
        .select("*")
        .eq("vehicle_id", rental!.vehicle_id!)
        .neq("status", "repaired")
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: markerMedia, refetch: refetchMarkerMedia } = useQuery({
    queryKey: ["inspection-marker-media", rental?.id],
    enabled: !!rental?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, damage_marker_id, file_name, file_path, mime_type")
        .eq("rental_id", rental!.id)
        .not("damage_marker_id", "is", null)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!items || inventory.length > 0) return;
    setInventory(
      items.map((item) => ({
        inventory_item_id: item.id,
        name: item.name,
        item_type: item.item_type,
        quantity: item.quantity,
        replacement_price_cents: item.replacement_price_cents,
        components: (item.components ?? []).map((c) => ({ name: c.name, quantity: c.quantity })),
        status: "complete",
        missing_quantity: 0,
        damaged_quantity: 0,
        notes: "",
      })),
    );
  }, [items, inventory.length]);

  useEffect(() => {
    if (!inspection) return;
    setValues((current) => ({
      ...current,
      odometer: inspection.odometer?.toString() ?? current.odometer,
      tank_level: inspection.tank_level ?? current.tank_level,
      fresh_water: inspection.fresh_water ?? "",
      waste_water: inspection.waste_water ?? "",
      motor_oil: inspection.motor_oil ?? "",
      gas_bottles: inspection.gas_bottles?.toString() ?? current.gas_bottles,
      keys_count: inspection.keys_count?.toString() ?? current.keys_count,
      vehicle_papers: inspection.vehicle_papers ?? false,
      onboard_tools: inspection.onboard_tools ?? false,
      warning_triangle: inspection.warning_triangle ?? false,
      first_aid_kit: inspection.first_aid_kit ?? false,
      safety_vests: inspection.safety_vests?.toString() ?? current.safety_vests,
      car_jack: inspection.car_jack ?? false,
      tire_tread: inspection.tire_tread ?? "",
      cleaning_status: inspection.cleaning_status ?? "",
      notes: inspection.notes ?? "",
    }));
    setConfirmations({
      instruction_complete: inspection.instruction_complete ?? false,
      no_open_questions: inspection.no_open_questions ?? false,
      no_new_damage_confirmed: inspection.no_new_damage_confirmed ?? false,
    });
  }, [inspection]);

  const sideMarkers = (markers ?? []).filter((marker) => marker.vehicle_side === activeSide);
  const isInterior = activeSide === "interior";
  const mediaForMarker = (markerId: string) =>
    (markerMedia ?? []).filter((doc) => doc.damage_marker_id === markerId);

  const kmSummary = useMemo(() => {
    if (!rental) return null;
    const included = includedKilometres(
      new Date(rental.start_date),
      new Date(rental.end_date),
      rental.free_km_per_day,
    );
    const driven =
      Number(values.odometer || 0) - Number(handoverInspection?.odometer ?? 0) || 0;
    const { extraKm, chargeCents } = extraKilometreCharge(
      Math.max(0, driven),
      included,
      rental.extra_km_price_cents,
    );
    return { included, driven: Math.max(0, driven), extraKm, chargeCents };
  }, [rental, values.odometer, handoverInspection]);

  const deductions = useMemo(
    () =>
      inventory.map((line) => ({
        line,
        cents: inventoryDeduction(
          line.replacement_price_cents,
          line.missing_quantity,
          line.damaged_quantity,
          line.item_type === "set" ? "set" : "single",
        ),
      })),
    [inventory],
  );

  const deductionTotal =
    deductions.reduce((sum, entry) => sum + entry.cents, 0) + (kmSummary?.chargeCents ?? 0);
  const settlement = depositSettlement(rental?.deposit_cents ?? 0, deductionTotal);

  const uploadSignature = async (dataUrl: string, role: string, inspectionId: string) => {
    const path = `${tenant!.id}/rentals/${rental!.id}/signatures/${mode}-${role}-${Date.now()}.png`;
    const { error } = await supabase.storage
      .from("rental-documents")
      .upload(path, dataUrlToBlob(dataUrl), { contentType: "image/png", upsert: true });
    if (error) throw error;
    await supabase.from("documents").insert({
      tenant_id: tenant!.id,
      rental_id: rental!.id,
      document_type: `Unterschrift ${role} (${isReturn ? "Rücknahme" : "Übergabe"})`,
      file_path: path,
      file_name: `${mode}-${role}.png`,
      mime_type: "image/png",
      created_by: session?.user.id ?? null,
      is_final: true,
    });
    void inspectionId;
    return path;
  };

  const uploadPhoto = async (side: string, file: File) => {
    if (!tenant || !rental) return;
    const path = `${tenant.id}/rentals/${rental.id}/${mode}/${side}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("rental-documents").upload(path, file);
    if (error) {
      toast({ title: "Upload fehlgeschlagen", description: error.message });
      return;
    }
    await supabase.from("documents").insert({
      tenant_id: tenant.id,
      rental_id: rental.id,
      document_type: `Übersichtsfoto ${side} (${isReturn ? "Rücknahme" : "Übergabe"})`,
      file_path: path,
      file_name: file.name,
      mime_type: file.type,
      created_by: session?.user.id ?? null,
    });
    setOverviewPhotos((current) => ({ ...current, [side]: path }));
    void queryClient.invalidateQueries({ queryKey: ["admin-rental-documents", rental.id] });
    toast({ title: "Foto gespeichert" });
  };

  const saveMarker = async () => {
    if (!newMarker || !tenant || !rental?.vehicle_id) return;
    if (!markerDraft.description.trim()) {
      toast({ title: "Beschreibung ist Pflicht" });
      return;
    }
    const label = `X${(markers ?? []).length + 1}`;
    const { data: created, error } = await supabase
      .from("damage_markers")
      .insert({
        tenant_id: tenant.id,
        vehicle_id: rental.vehicle_id,
        inspection_id: inspection?.id ?? null,
        marker_label: label,
        vehicle_side: activeSide,
        x_percent: newMarker.x,
        y_percent: newMarker.y,
        damage_type: markerDraft.damage_type || null,
        severity: markerDraft.severity,
        description: markerDraft.description.trim(),
        status: isReturn ? "new" : "existing",
      })
      .select("id")
      .single();
    if (error) {
      toast({ title: "Speichern fehlgeschlagen", description: error.message });
      return;
    }
    if (markerDraft.media && created) {
      const uploaded = await uploadMarkerMedia(created.id, label, markerDraft.media);
      if (!uploaded) return;
    }
    setNewMarker(null);
    setMarkerDraft({ damage_type: "", severity: "light", description: "", media: null });
    void refetchMarkers();
    void refetchMarkerMedia();
    toast({ title: `Schaden ${label} gespeichert` });
  };

  /** Foto oder Video zu einem Schaden hochladen und im Dokumentenarchiv verknüpfen. */
  const uploadMarkerMedia = async (markerId: string, label: string, file: File) => {
    if (!tenant || !rental) return false;
    const path = `${tenant.id}/rentals/${rental.id}/damages/${markerId}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("rental-documents")
      .upload(path, file);
    if (uploadError) {
      toast({ title: "Upload fehlgeschlagen", description: uploadError.message });
      return false;
    }
    const { error: docError } = await supabase.from("documents").insert({
      tenant_id: tenant.id,
      rental_id: rental.id,
      damage_marker_id: markerId,
      document_type: `Schadensnachweis ${label}`,
      file_path: path,
      file_name: file.name,
      mime_type: file.type,
      created_by: session?.user.id ?? null,
    });
    if (docError) {
      toast({ title: "Speichern fehlgeschlagen", description: docError.message });
      return false;
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-rental-documents", rental.id] });
    void refetchMarkerMedia();
    return true;
  };

  const openMarkerMedia = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("rental-documents")
      .createSignedUrl(filePath, 60 * 10);
    if (error || !data?.signedUrl) {
      toast({ title: "Datei konnte nicht geöffnet werden", description: error?.message });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const markMarkerRepaired = async (markerId: string, label: string) => {
    const { error } = await supabase
      .from("damage_markers")
      .update({ status: "repaired" })
      .eq("id", markerId);
    if (error) {
      toast({ title: "Aktualisieren fehlgeschlagen", description: error.message });
      return;
    }
    void refetchMarkers();
    toast({
      title: `Schaden ${label} als behoben markiert`,
      description: "Er wird nicht mehr in die nächste Vermietung übernommen.",
    });
  };

  const deleteMarker = async (markerId: string, label: string, status: string) => {
    const isResolved = status === "existing";
    const message = isResolved
      ? `Schaden ${label} ist ein behobener/Vorschaden. Wenn du ihn löschst, wird er dauerhaft entfernt und nicht mehr in die nächste Vermietung übernommen. Trotzdem löschen?`
      : `Schaden ${label} endgültig löschen?`;
    if (!window.confirm(message)) return;
    const { error } = await supabase.from("damage_markers").delete().eq("id", markerId);
    if (error) {
      toast({ title: "Löschen fehlgeschlagen", description: error.message });
      return;
    }
    void refetchMarkers();
    toast({ title: `Schaden ${label} gelöscht` });
  };


  const persist = async (complete: boolean) => {
    if (!tenant || !rental) return;
    if (complete && isReturn && !isValidIban(bank.iban)) {
      toast({ title: "IBAN ungültig", description: "Der Abschluss ist ohne gültige IBAN gesperrt." });
      return;
    }
    if (complete && !isReturn) {
      const missingPhoto = VEHICLE_SIDES.some((side) => !overviewPhotos[side.value]);
      if (missingPhoto) {
        toast({ title: "Übersichtsfotos fehlen", description: "Alle vier Ansichten sind Pflicht." });
        return;
      }
      if (!confirmations.instruction_complete || !confirmations.no_open_questions) {
        toast({ title: "Einweisung bestätigen", description: "Bitte alle Bestätigungen setzen." });
        return;
      }
    }
    if (complete && (!customerSignature || !staffSignature)) {
      toast({ title: "Unterschriften fehlen" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tenant_id: tenant.id,
        rental_id: rental.id,
        inspection_type: mode,
        status: complete ? "completed" : "draft",
        odometer: values.odometer ? Number(values.odometer) : null,
        tank_level: values.tank_level,
        fresh_water: values.fresh_water || null,
        waste_water: values.waste_water || null,
        motor_oil: values.motor_oil || null,
        gas_status: `${values.gas_bottles} Flaschen`,
        gas_bottles: Number(values.gas_bottles || 0),
        keys_count: Number(values.keys_count || 0),
        vehicle_papers: values.vehicle_papers,
        onboard_tools: values.onboard_tools,
        warning_triangle: values.warning_triangle,
        first_aid_kit: values.first_aid_kit,
        safety_vests: Number(values.safety_vests || 0),
        car_jack: values.car_jack,
        tire_tread: values.tire_tread || null,
        cleaning_status: values.cleaning_status || null,
        delay_minutes: isReturn ? Number(values.delay_minutes || 0) : null,
        actual_return_at: isReturn ? new Date(values.actual_return_at).toISOString() : null,
        notes: values.notes || null,
        instruction_complete: confirmations.instruction_complete,
        no_open_questions: confirmations.no_open_questions,
        no_new_damage_confirmed: confirmations.no_new_damage_confirmed,
        completed_by: complete ? session?.user.id ?? null : null,
        completed_at: complete ? new Date().toISOString() : null,
        signed_at: complete ? new Date().toISOString() : null,
      };

      let inspectionId = inspection?.id ?? null;
      if (inspectionId) {
        const { error } = await supabase.from("inspections").update(payload).eq("id", inspectionId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("inspections")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        inspectionId = data.id;
      }

      if (customerSignature) {
        const path = await uploadSignature(customerSignature, "Mieter", inspectionId!);
        await supabase.from("inspections").update({ customer_signature_url: path }).eq("id", inspectionId!);
      }
      if (staffSignature) {
        const path = await uploadSignature(staffSignature, "Vermieter", inspectionId!);
        await supabase.from("inspections").update({ lessor_signature_url: path }).eq("id", inspectionId!);
      }

      // Inventarsnapshot / Rücknahmeprüfung
      await supabase.from("inspection_inventory").delete().eq("inspection_id", inspectionId!);
      if (inventory.length > 0) {
        const rows = inventory.map((line) => ({
          tenant_id: tenant.id,
          inspection_id: inspectionId!,
          inventory_item_id: line.inventory_item_id,
          item_snapshot: {
            name: line.name,
            item_type: line.item_type,
            quantity: line.quantity,
            replacement_price_cents: line.replacement_price_cents,
            components: line.components,
          },
          status: line.status,
          missing_quantity: line.missing_quantity,
          damaged_quantity: line.damaged_quantity,
          deduction_cents: isReturn
            ? inventoryDeduction(
                line.replacement_price_cents,
                line.missing_quantity,
                line.damaged_quantity,
                line.item_type === "set" ? "set" : "single",
              )
            : 0,
          notes: line.notes || null,
        }));
        const { error } = await supabase.from("inspection_inventory").insert(rows);
        if (error) throw error;
      }

      if (isReturn && complete) {
        const { error } = await supabase.from("bank_accounts").insert({
          tenant_id: tenant.id,
          customer_id: rental.customer_id,
          account_holder: bank.account_holder.trim(),
          iban: normaliseIban(bank.iban),
          bic: bank.bic || null,
          confirmed_by_customer: bank.confirmed,
          confirmed_by_employee: true,
        });
        if (error) throw error;
      }

      if (complete) {
        await supabase
          .from("rentals")
          .update({ status: isReturn ? "billing_open" : "active" })
          .eq("id", rental.id);
      }

      await supabase.from("audit_logs").insert({
        tenant_id: tenant.id,
        actor_id: session?.user.id ?? null,
        action: complete ? `${mode}.completed` : `${mode}.saved`,
        entity_type: "inspection",
        entity_id: inspectionId,
      });

      toast({ title: complete ? "Protokoll abgeschlossen" : "Zwischenstand gespeichert" });
      void queryClient.invalidateQueries({ queryKey: ["inspection", id, mode] });
      if (complete) navigate(`/admin/mietvertrag/${rental.id}`);
    } catch (error) {
      toast({ title: "Speichern fehlgeschlagen", description: (error as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <p className="text-sm text-muted-foreground">Lade Vorgang …</p>
      </AdminShell>
    );
  }
  if (!rental) {
    return (
      <AdminShell>
        <EmptyState title="Mietvertrag nicht gefunden" />
      </AdminShell>
    );
  }

  const locked = inspection?.status === "completed";

  return (
    <AdminShell>
      <PageSEO
        title={isReturn ? "Rücknahme" : "Übergabe"}
        description="Interner Bereich"
        canonical="https://wohnmobil-berlin.de/admin/mietvertraege"
        noindex
      />
      <PageHeader
        eyebrow={`Mietvertrag ${rental.rental_number}`}
        title={isReturn ? "Rücknahmeprotokoll" : "Übergabeprotokoll"}
        description={
          isReturn
            ? "Rückgabewerte, Inventarprüfung, Kautionsabrechnung und Bankverbindung."
            : "Fahrzeugwerte, Vorschäden, Inventar, Einweisung und Unterschriften."
        }
        actions={
          <Link to={`/admin/mietvertrag/${rental.id}`} className={secondaryButton}>
            Zurück zum Vertrag
          </Link>
        }
      />

      {locked && (
        <Panel className="mb-4 border-primary/40">
          <p className="text-sm">
            Dieses Protokoll ist abgeschlossen und wird als unveränderbarer Snapshot geführt.
            Korrekturen entstehen als neue Version.
          </p>
        </Panel>
      )}

      <div className="space-y-4">
        <Panel>
          <h2 className="text-lg font-semibold">
            {isReturn ? "Rückgabewerte" : "Fahrzeugwerte bei Übergabe"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {isReturn && (
              <Field label="Tatsächliche Rückgabe">
                <input
                  type="datetime-local"
                  value={values.actual_return_at}
                  onChange={(e) => setValues({ ...values, actual_return_at: e.target.value })}
                  className={inputClass}
                />
              </Field>
            )}
            <Field label="Kilometerstand">
              <input
                inputMode="numeric"
                value={values.odometer}
                onChange={(e) => setValues({ ...values, odometer: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Tankfüllung">
              <select
                value={values.tank_level}
                onChange={(e) => setValues({ ...values, tank_level: e.target.value })}
                className={inputClass}
              >
                {TANK_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Gasflaschen (Anzahl)">
              <input
                inputMode="numeric"
                value={values.gas_bottles}
                onChange={(e) => setValues({ ...values, gas_bottles: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Frischwassertank">
              <input
                value={values.fresh_water}
                onChange={(e) => setValues({ ...values, fresh_water: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Abwassertank">
              <input
                value={values.waste_water}
                onChange={(e) => setValues({ ...values, waste_water: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Motoröl">
              <input
                value={values.motor_oil}
                onChange={(e) => setValues({ ...values, motor_oil: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Schlüsselanzahl">
              <input
                inputMode="numeric"
                value={values.keys_count}
                onChange={(e) => setValues({ ...values, keys_count: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Warnwesten">
              <input
                inputMode="numeric"
                value={values.safety_vests}
                onChange={(e) => setValues({ ...values, safety_vests: e.target.value })}
                className={inputClass}
              />
            </Field>
            {isReturn && (
              <>
                <Field label="Reifenprofil">
                  <input
                    value={values.tire_tread}
                    onChange={(e) => setValues({ ...values, tire_tread: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Reinigung">
                  <input
                    value={values.cleaning_status}
                    onChange={(e) => setValues({ ...values, cleaning_status: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Verspätung (Minuten)">
                  <input
                    inputMode="numeric"
                    value={values.delay_minutes}
                    onChange={(e) => setValues({ ...values, delay_minutes: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </>
            )}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["vehicle_papers", "Fahrzeugpapiere vorhanden"],
              ["onboard_tools", "Bordwerkzeug vorhanden"],
              ["warning_triangle", "Warndreieck vorhanden"],
              ["first_aid_kit", "Verbandskasten vorhanden"],
              ["car_jack", "Wagenheber vorhanden"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={values[key as keyof typeof values] as boolean}
                  onChange={(e) => setValues({ ...values, [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>
          <Field label="Bemerkungen" className="mt-4">
            <textarea
              rows={3}
              value={values.notes}
              onChange={(e) => setValues({ ...values, notes: e.target.value })}
              className={inputClass}
            />
          </Field>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">Fahrzeugzustand &amp; Schäden</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {DAMAGE_AREAS.map((side) => (
              <button
                key={side.value}
                onClick={() => {
                  setActiveSide(side.value as VehicleSideValue | "interior");
                  setNewMarker(null);
                }}
                className={activeSide === side.value ? primaryButton : secondaryButton}
              >
                {side.label}
              </button>
            ))}
          </div>
          {isInterior ? (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Innenbereich: Schäden werden ohne Skizze erfasst – Beschreibung plus Foto oder
                Video.
              </p>
              {!locked && (
                <button
                  className={`${secondaryButton} mt-3`}
                  onClick={() => {
                    setNewMarker({ x: 50, y: 50 });
                    requestAnimationFrame(() => {
                      document
                        .getElementById("marker-form")
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    });
                  }}
                >
                  Schaden im Innenbereich erfassen
                </button>
              )}
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Auf die Skizze tippen, um einen neuen Marker zu setzen. Marker werden als
                Prozentkoordinaten gespeichert.
              </p>
              <div className="mt-3 max-w-2xl">
                <VehicleDiagram
                  side={activeSide as VehicleSideValue}
                  storedPath={
                    (rental.vehicles?.[
                      DIAGRAM_COLUMN[activeSide as VehicleSideValue] as keyof typeof rental.vehicles
                    ] as string | null) ?? null
                  }
                  markers={sideMarkers.map((marker) => ({
                    id: marker.id,
                    marker_label: marker.marker_label,
                    x_percent: Number(marker.x_percent),
                    y_percent: Number(marker.y_percent),
                  }))}
                  pendingMarker={newMarker}
                  onAddMarker={
                    locked
                      ? undefined
                      : (x, y) => {
                          setNewMarker({ x, y });
                          requestAnimationFrame(() => {
                            document
                              .getElementById("marker-form")
                              ?.scrollIntoView({ behavior: "smooth", block: "center" });
                          });
                        }
                  }
                  alt={`Fahrzeugskizze ${activeSide}`}
                />
              </div>
            </>
          )}

          {newMarker && (
            <div id="marker-form" className="mt-4 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
              <Field label="Schadensart">
                <input
                  value={markerDraft.damage_type}
                  onChange={(e) => setMarkerDraft({ ...markerDraft, damage_type: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Schweregrad">
                <select
                  value={markerDraft.severity}
                  onChange={(e) => setMarkerDraft({ ...markerDraft, severity: e.target.value })}
                  className={inputClass}
                >
                  {DAMAGE_SEVERITY.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Beschreibung (Pflicht)" className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={markerDraft.description}
                  onChange={(e) => setMarkerDraft({ ...markerDraft, description: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Foto oder Video" className="sm:col-span-2">
                <input
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  onChange={(e) =>
                    setMarkerDraft({ ...markerDraft, media: e.target.files?.[0] ?? null })
                  }
                  className={inputClass}
                />
              </Field>
              <div className="flex gap-2 sm:col-span-2">
                <button onClick={() => void saveMarker()} className={primaryButton}>
                  Schaden speichern
                </button>
                <button onClick={() => setNewMarker(null)} className={secondaryButton}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Offene Schäden werden automatisch in die nächste Vermietung übernommen. Behobene
            Schäden entfernst du über „Behoben“ (bleibt in der Historie) oder „Löschen“.
          </p>
          <ul className="mt-2 divide-y divide-border text-sm">
            {sideMarkers.map((marker) => (
              <li key={marker.id} className="flex flex-wrap items-center gap-2 py-2">
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{marker.marker_label}</span> · {marker.description}{" "}
                  <span className="text-muted-foreground">
                    ({marker.status === "new" ? "neuer Schaden" : "Vorschaden"})
                  </span>
                </span>
                {mediaForMarker(marker.id).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => void openMarkerMedia(doc.file_path)}
                    className={secondaryButton}
                  >
                    {doc.mime_type?.startsWith("video") ? "Video" : "Foto"} ansehen
                  </button>
                ))}
                {!locked && (
                  <label className={`${secondaryButton} cursor-pointer`}>
                    Foto/Video hinzufügen
                    <input
                      type="file"
                      accept="image/*,video/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (file) void uploadMarkerMedia(marker.id, marker.marker_label, file);
                      }}
                    />
                  </label>
                )}
                {!locked && (
                  <span className="flex gap-2">
                    <button
                      onClick={() => void markMarkerRepaired(marker.id, marker.marker_label)}
                      className={secondaryButton}
                    >
                      Behoben
                    </button>
                    <button
                      onClick={() => void deleteMarker(marker.id, marker.marker_label, marker.status)}
                      className={secondaryButton}
                    >
                      Löschen
                    </button>
                  </span>
                )}
              </li>
            ))}
            {sideMarkers.length === 0 && (
              <li className="py-2 text-muted-foreground">
                {isInterior ? "Keine Schäden im Innenbereich." : "Keine Schäden auf dieser Seite."}
              </li>
            )}
          </ul>

          {isReturn && (
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={confirmations.no_new_damage_confirmed}
                onChange={(e) =>
                  setConfirmations({ ...confirmations, no_new_damage_confirmed: e.target.checked })
                }
              />
              Keine neuen Schäden festgestellt.
            </label>
          )}
        </Panel>

        {!isReturn && (
          <Panel>
            <h2 className="text-lg font-semibold">Übersichtsaufnahmen (Pflicht)</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {VEHICLE_SIDES.map((side) => (
                <label
                  key={side.value}
                  className="flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-dashed border-border p-4 text-sm"
                >
                  <Camera className="h-5 w-5 text-primary" />
                  {side.label}
                  <span className="text-xs text-muted-foreground">
                    {overviewPhotos[side.value] ? "Foto gespeichert" : "Foto aufnehmen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadPhoto(side.value, file);
                    }}
                  />
                </label>
              ))}
            </div>
          </Panel>
        )}

        <Panel>
          <h2 className="text-lg font-semibold">
            {isReturn ? "Inventarprüfung" : "Inventarliste (Snapshot)"}
          </h2>
          {!isReturn && (
            <button
              onClick={() =>
                setInventory((current) => current.map((line) => ({ ...line, status: "complete" })))
              }
              className={`${secondaryButton} mt-3`}
            >
              Alles vollständig bestätigen
            </button>
          )}
          <ul className="mt-3 divide-y divide-border">
            {inventory.map((line, index) => (
              <li key={line.inventory_item_id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {line.quantity}× {line.name}
                      {line.item_type === "set" && (
                        <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs">Set</span>
                      )}
                    </p>
                    {line.components.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {line.components.map((c) => `${c.quantity}× ${c.name}`).join(", ")}
                      </p>
                    )}
                  </div>
                  <select
                    value={line.status}
                    onChange={(e) =>
                      setInventory((current) =>
                        current.map((entry, i) =>
                          i === index ? { ...entry, status: e.target.value } : entry,
                        ),
                      )
                    }
                    className={`${inputClass} max-w-[190px]`}
                  >
                    {INVENTORY_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                {isReturn && line.status !== "complete" && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <Field label="Fehlt (Stück)">
                      <input
                        inputMode="numeric"
                        value={line.missing_quantity}
                        onChange={(e) =>
                          setInventory((current) =>
                            current.map((entry, i) =>
                              i === index
                                ? { ...entry, missing_quantity: Number(e.target.value || 0) }
                                : entry,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Beschädigt (Stück)">
                      <input
                        inputMode="numeric"
                        value={line.damaged_quantity}
                        onChange={(e) =>
                          setInventory((current) =>
                            current.map((entry, i) =>
                              i === index
                                ? { ...entry, damaged_quantity: Number(e.target.value || 0) }
                                : entry,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Bemerkung">
                      <input
                        value={line.notes}
                        onChange={(e) =>
                          setInventory((current) =>
                            current.map((entry, i) =>
                              i === index ? { ...entry, notes: e.target.value } : entry,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                    <p className="text-sm sm:col-span-3">
                      Abzug:{" "}
                      {formatEuro(
                        inventoryDeduction(
                          line.replacement_price_cents,
                          line.missing_quantity,
                          line.damaged_quantity,
                          line.item_type === "set" ? "set" : "single",
                        ),
                      )}
                      {line.item_type === "set" && " (Sets werden immer komplett berechnet)"}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        {isReturn && (
          <>
            <Panel>
              <h2 className="text-lg font-semibold">Kilometer &amp; Kautionsabrechnung</h2>
              <div className="mt-3 space-y-1 text-sm">
                <p>Gefahrene Kilometer: {kmSummary?.driven ?? 0} km</p>
                <p>Enthaltene Freikilometer: {kmSummary?.included ?? 0} km</p>
                <p>Mehrkilometer: {kmSummary?.extraKm ?? 0} km</p>
                <p>Mehrkilometerbetrag: {formatEuro(kmSummary?.chargeCents ?? 0)}</p>
              </div>
              <ul className="mt-3 divide-y divide-border text-sm">
                {deductions
                  .filter((entry) => entry.cents > 0)
                  .map((entry) => (
                    <li key={entry.line.inventory_item_id} className="flex justify-between py-2">
                      <span>{entry.line.name}</span>
                      <span>{formatEuro(entry.cents)}</span>
                    </li>
                  ))}
              </ul>
              <div className="mt-3 space-y-1 text-sm font-medium">
                <p>Ursprüngliche Kaution: {formatEuro(rental.deposit_cents)}</p>
                <p>Gesamtabzug: {formatEuro(deductionTotal)}</p>
                <p>Kautionsrückzahlung: {formatEuro(settlement.refundCents)}</p>
                <p className={settlement.outstandingCents > 0 ? "text-destructive" : ""}>
                  Offene Forderung: {formatEuro(settlement.outstandingCents)}
                </p>
              </div>
            </Panel>

            <Panel>
              <h2 className="text-lg font-semibold">Bankverbindung für die Rückzahlung</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Eingabe durch Mieter oder Mitarbeiter. Keine Kartenfotos, keine OCR. Eine ungültige
                IBAN blockiert den Abschluss.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Kontoinhaber">
                  <input
                    value={bank.account_holder}
                    onChange={(e) => setBank({ ...bank, account_holder: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="BIC (optional)">
                  <input
                    value={bank.bic}
                    onChange={(e) => setBank({ ...bank, bic: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="IBAN"
                  className="sm:col-span-2"
                  hint={
                    bank.iban
                      ? isValidIban(bank.iban)
                        ? `Gültig: ${formatIban(bank.iban)}`
                        : "IBAN ist formal ungültig."
                      : undefined
                  }
                >
                  <input
                    value={bank.iban}
                    onChange={(e) => setBank({ ...bank, iban: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={bank.confirmed}
                  onChange={(e) => setBank({ ...bank, confirmed: e.target.checked })}
                />
                Mieter und Mitarbeiter haben die Bankverbindung gemeinsam geprüft.
              </label>
            </Panel>
          </>
        )}

        {!isReturn && (
          <Panel>
            <h2 className="text-lg font-semibold">Einweisung</h2>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5"
                  checked={confirmations.instruction_complete}
                  onChange={(e) =>
                    setConfirmations({ ...confirmations, instruction_complete: e.target.checked })
                  }
                />
                Vollständige Fahrzeugeinweisung erhalten, Bedienung verstanden, Vorschäden gesehen und
                Inventarliste gemeinsam geprüft.
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5"
                  checked={confirmations.no_open_questions}
                  onChange={(e) =>
                    setConfirmations({ ...confirmations, no_open_questions: e.target.checked })
                  }
                />
                Keine offenen Fragen. Es ist bekannt, dass nur eingetragene Fahrer fahren dürfen.
              </label>
            </div>
          </Panel>
        )}

        <Panel>
          <h2 className="text-lg font-semibold">Unterschriften</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <SignaturePad label="Mieter" onChange={setCustomerSignature} />
            <SignaturePad label="Vermieter / Mitarbeiter" onChange={setStaffSignature} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Gespeichert werden Signatur, Rolle, Datum, Uhrzeit und Dokumentversion.
          </p>
        </Panel>

        <div className="flex flex-wrap gap-2 pb-8">
          <button onClick={() => void persist(false)} disabled={saving} className={secondaryButton}>
            <Save className="h-4 w-4" /> Zwischenstand speichern
          </button>
          <button onClick={() => void persist(true)} disabled={saving} className={primaryButton}>
            <ShieldCheck className="h-4 w-4" />
            {isReturn ? "Rücknahme abschließen" : "Übergabe abschließen"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminInspection;
