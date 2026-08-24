import { supabase } from "@/integrations/supabase/client";
import { DIAGRAM_COLUMN, resolveDiagramUrl, type VehicleSideValue } from "@/admin/vehicleDiagrams";

export type RentalPdfKind = "contract" | "handover" | "return";

export interface RentalPdfResult {
  documentId: string;
  documentType: string;
  fileName: string;
  path: string;
  version: number;
  signedUrl: string | null;
  emailQueued: boolean;
  emailError: string | null;
}

const SIDES: VehicleSideValue[] = ["front", "rear", "driver", "passenger"];

/** Lädt ein Bild und verkleinert es als JPEG-Data-URL für den PDF-Versand. */
const toDataUrl = (url: string, maxWidth = 900): Promise<string | null> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / image.naturalWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext("2d");
        if (!context) return resolve(null);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = url;
  });

/** Sammelt die vier Fahrzeugskizzen als Data-URLs (für Protokolle). */
export const collectDiagramImages = async (
  vehicle: Record<string, unknown> | null | undefined,
): Promise<Record<string, string>> => {
  const result: Record<string, string> = {};
  await Promise.all(
    SIDES.map(async (side) => {
      const stored = vehicle
        ? ((vehicle as Record<string, string | null>)[DIAGRAM_COLUMN[side]] ?? null)
        : null;
      const url = await resolveDiagramUrl(stored, side);
      const dataUrl = await toDataUrl(url);
      if (dataUrl) result[side] = dataUrl;
    }),
  );
  return result;
};

interface GenerateOptions {
  rentalId: string;
  kind: RentalPdfKind;
  inspectionId?: string;
  send?: boolean;
  vehicle?: Record<string, unknown> | null;
}

/** Erzeugt das PDF serverseitig, speichert es im Archiv und liefert eine Download-URL. */
export const generateRentalPdf = async ({
  rentalId,
  kind,
  inspectionId,
  send,
  vehicle,
}: GenerateOptions): Promise<RentalPdfResult> => {
  const diagrams = kind === "contract" ? undefined : await collectDiagramImages(vehicle);
  const { data, error } = await supabase.functions.invoke("generate-rental-pdf", {
    body: { rentalId, kind, inspectionId, send: !!send, diagrams },
  });
  if (error) {
    const context = (error as { context?: Response }).context;
    let message = error.message;
    if (context) {
      try {
        const payload = await context.clone().json();
        if (payload?.error) message = String(payload.error);
      } catch {
        /* Fehlermeldung bleibt bestehen */
      }
    }
    throw new Error(message);
  }
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as RentalPdfResult;
};
