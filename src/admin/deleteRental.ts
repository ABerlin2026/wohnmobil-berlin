import { supabase } from "@/integrations/supabase/client";

const compact = (values: (string | null | undefined)[]) =>
  values.filter((value): value is string => Boolean(value));

/**
 * Löscht einen Mietvertrag inklusive aller abhängigen Daten.
 * Die meisten Tabellen nutzen ON DELETE CASCADE; Schäden und Rechnungsketten
 * müssen wegen NO-ACTION-Fremdschlüsseln vorher aufgelöst werden.
 */
export const deleteRentalWithDependencies = async (rentalId: string) => {
  const { data: inspectionRows, error: inspectionError } = await supabase
    .from("inspections")
    .select("id, customer_signature_url, lessor_signature_url")
    .eq("rental_id", rentalId);
  if (inspectionError) throw inspectionError;

  const inspections = inspectionRows ?? [];
  const inspectionIds = inspections.map((inspection) => inspection.id);

  let markerIds: string[] = [];
  if (inspectionIds.length > 0) {
    const { data: markerRows, error: markerError } = await supabase
      .from("damage_markers")
      .select("id")
      .in("inspection_id", inspectionIds);
    if (markerError) throw markerError;
    markerIds = (markerRows ?? []).map((marker) => marker.id);
  }

  const documentQueries = [
    supabase.from("documents").select("file_path").eq("rental_id", rentalId),
    ...(markerIds.length > 0
      ? [supabase.from("documents").select("file_path").in("damage_marker_id", markerIds)]
      : []),
  ];
  const documentResults = await Promise.all(documentQueries);
  for (const result of documentResults) {
    if (result.error) throw result.error;
  }

  const storagePaths = [
    ...new Set(
      compact([
        ...documentResults.flatMap((result) => (result.data ?? []).map((doc) => doc.file_path)),
        ...inspections.flatMap((inspection) => [
          inspection.customer_signature_url,
          inspection.lessor_signature_url,
        ]),
      ]),
    ),
  ];

  if (markerIds.length > 0) {
    const { error } = await supabase.from("damage_markers").delete().in("id", markerIds);
    if (error) throw error;
  }

  // Rechnungsversionen verweisen über predecessor_id aufeinander (NO ACTION).
  const { error: invoiceError } = await supabase
    .from("invoices")
    .update({ predecessor_id: null })
    .eq("rental_id", rentalId);
  if (invoiceError) throw invoiceError;

  const { error: rentalError } = await supabase.from("rentals").delete().eq("id", rentalId);
  if (rentalError) throw rentalError;

  if (storagePaths.length > 0) {
    // Erst nach erfolgreicher Datenbanklöschung Dateien entfernen; verwaiste Restdateien
    // blockieren andernfalls keine erneute Ausführung oder spätere Bereinigung.
    await supabase.storage.from("rental-documents").remove(storagePaths);
  }
};
