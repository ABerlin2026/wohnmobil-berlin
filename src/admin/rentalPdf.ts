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

export interface InspectionDraft {
  inspection?: Record<string, unknown>;
  inventory?: Record<string, unknown>[];
  markers?: Record<string, unknown>[];
  customerSignature?: string | null;
  lessorSignature?: string | null;
}

interface PreviewOptions {
  rentalId: string;
  kind: Exclude<RentalPdfKind, "contract">;
  vehicle?: Record<string, unknown> | null;
  draft: InspectionDraft;
}

let lastPreviewUrl: string | null = null;

/**
 * Erzeugt eine Vorschau-PDF aus den aktuellen Formulareingaben.
 * Nichts wird archiviert – das PDF kommt als Blob zurück und wird lokal verlinkt.
 */
export const previewRentalPdf = async ({
  rentalId,
  kind,
  vehicle,
  draft,
}: PreviewOptions): Promise<{ url: string; fileName: string }> => {
  const diagrams = await collectDiagramImages(vehicle);
  const { data, error } = await supabase.functions.invoke("generate-rental-pdf", {
    body: { rentalId, kind, preview: true, draft, diagrams },
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
  if (!(data instanceof Blob)) {
    const payload = data as { error?: string } | null;
    throw new Error(payload?.error ?? "Vorschau konnte nicht erstellt werden.");
  }

  if (lastPreviewUrl) URL.revokeObjectURL(lastPreviewUrl);
  lastPreviewUrl = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
  const slug = kind === "handover" ? "uebergabeprotokoll" : "rueckgabeprotokoll";
  return { url: lastPreviewUrl, fileName: `vorschau-${slug}.pdf` };
};


/**
 * Öffnet bzw. speichert eine Datei ohne Popup-Fenster.
 * Auf Tablets/iPadOS blockiert Safari `window.open` nach await – daher
 * wird die Datei geladen und über einen Anker-Klick ausgeliefert.
 */
export const deliverFile = async (
  url: string,
  fileName?: string,
  mimeType = "application/pdf",
): Promise<void> => {
  let objectUrl: string | null = null;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Datei konnte nicht geladen werden.");
    const blob = await response.blob();
    objectUrl = URL.createObjectURL(new Blob([blob], { type: blob.type || mimeType }));
  } catch {
    objectUrl = null;
  }

  const target = objectUrl ?? url;
  const anchor = document.createElement("a");
  anchor.href = target;
  anchor.rel = "noopener";
  if (fileName) anchor.download = fileName;
  else anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl!), 60000);
};

/** Öffnet den Druckdialog für ein PDF (via unsichtbarem Iframe, funktioniert auch mobil). */
export const printPdfFromUrl = async (url: string): Promise<void> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("PDF konnte nicht geladen werden.");
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.onload = () => {
    setTimeout(() => {
      try {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
      } catch {
        window.open(objectUrl, "_blank", "noopener");
      }
    }, 400);
  };
  document.body.appendChild(frame);
  frame.src = objectUrl;
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
    frame.remove();
  }, 120000);
};

/** Erzeugt das PDF, archiviert es und öffnet direkt den Druckdialog. */
export const printRentalPdf = async (options: GenerateOptions): Promise<RentalPdfResult> => {
  const result = await generateRentalPdf({ ...options, send: false });
  if (!result.signedUrl) throw new Error("Download-Link fehlt – Druck nicht möglich.");
  await printPdfFromUrl(result.signedUrl);
  return result;
};
