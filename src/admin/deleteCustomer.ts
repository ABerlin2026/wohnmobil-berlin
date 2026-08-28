import { supabase } from "@/integrations/supabase/client";
import { deleteRentalWithDependencies } from "@/admin/deleteRental";

/**
 * Löscht einen Kunden inkl. aller Mietverträge (RESTRICT-Fremdschlüssel),
 * Bankdaten und Dokumente. Dateien werden erst nach erfolgreicher
 * Datenbanklöschung aus dem Storage entfernt.
 */
export const deleteCustomerWithDependencies = async (customerId: string) => {
  const { data: rentalRows, error: rentalError } = await supabase
    .from("rentals")
    .select("id")
    .eq("customer_id", customerId);
  if (rentalError) throw rentalError;

  for (const rental of rentalRows ?? []) {
    await deleteRentalWithDependencies(rental.id);
  }

  const { data: documentRows, error: documentError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("customer_id", customerId);
  if (documentError) throw documentError;

  const storagePaths = [
    ...new Set(
      (documentRows ?? [])
        .map((doc) => doc.file_path)
        .filter((path): path is string => Boolean(path)),
    ),
  ];

  const { error: deleteError } = await supabase.from("customers").delete().eq("id", customerId);
  if (deleteError) throw deleteError;

  if (storagePaths.length > 0) {
    await supabase.storage.from("rental-documents").remove(storagePaths);
  }
};
