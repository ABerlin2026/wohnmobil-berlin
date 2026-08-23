import { supabase } from "@/integrations/supabase/client";
import front from "@/assets/skizze-front.png.asset.json";
import rear from "@/assets/skizze-heck.png.asset.json";
import driver from "@/assets/skizze-fahrerseite.png.asset.json";
import passenger from "@/assets/skizze-beifahrerseite.png.asset.json";

export type VehicleSideValue = "front" | "rear" | "driver" | "passenger";

/** Standard-Skizzen des Wohnmobil-Berlin-Fahrzeugs (pro Fahrzeug überschreibbar). */
export const DEFAULT_DIAGRAMS: Record<VehicleSideValue, string> = {
  front: front.url,
  rear: rear.url,
  driver: driver.url,
  passenger: passenger.url,
};

export const DIAGRAM_COLUMN: Record<VehicleSideValue, string> = {
  front: "diagram_front_url",
  rear: "diagram_rear_url",
  driver: "diagram_driver_url",
  passenger: "diagram_passenger_url",
};

/**
 * Löst eine hinterlegte Skizze auf: Storage-Pfade werden über eine kurzlebige
 * signierte URL geladen, sonst greift die Standard-Skizze.
 */
export const resolveDiagramUrl = async (
  stored: string | null | undefined,
  side: VehicleSideValue,
): Promise<string> => {
  if (!stored) return DEFAULT_DIAGRAMS[side];
  if (/^https?:\/\//.test(stored)) return stored;
  const { data } = await supabase.storage
    .from("rental-documents")
    .createSignedUrl(stored, 60 * 10);
  return data?.signedUrl ?? DEFAULT_DIAGRAMS[side];
};
