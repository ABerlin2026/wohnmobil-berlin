export const RENTAL_STATUS: Record<string, string> = {
  draft: "Entwurf",
  booked: "Gebucht",
  documents_pending: "Unterlagen offen",
  handover_ready: "Übergabe bereit",
  active: "Unterwegs",
  return_due: "Rückgabe fällig",
  damage_review: "Schadenprüfung",
  billing_open: "Abrechnung offen",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
  overdue: "Überfällig",
};

export const VEHICLE_SIDES = [
  { value: "front", label: "Front" },
  { value: "rear", label: "Heck" },
  { value: "driver", label: "Fahrerseite" },
  { value: "passenger", label: "Beifahrerseite" },
] as const;

export const DAMAGE_SEVERITY = [
  { value: "note", label: "Notiz" },
  { value: "light", label: "Leicht" },
  { value: "medium", label: "Mittel" },
  { value: "severe", label: "Schwer" },
] as const;

export const INVENTORY_STATUS = [
  { value: "complete", label: "Vollständig" },
  { value: "partial", label: "Teilweise" },
  { value: "missing", label: "Fehlt" },
  { value: "damaged", label: "Beschädigt" },
] as const;

export const PAYMENT_TYPES = [
  { value: "rent", label: "Miete" },
  { value: "deposit", label: "Kaution" },
  { value: "refund", label: "Kautionsrückzahlung" },
  { value: "deduction", label: "Einbehalt" },
  { value: "additional_charge", label: "Nachforderung" },
] as const;

export const PAYMENT_METHODS = ["Überweisung", "Bar", "EC-Karte", "PayPal"] as const;

export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("de-DE") : "-";
