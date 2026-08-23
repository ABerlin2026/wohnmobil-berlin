import { differenceInCalendarDays } from "date-fns";

export const DEFAULT_FREE_KM_PER_DAY = 150;
export const DEFAULT_DEPOSIT_CENTS = 150_000;

/** Number of rental days (inclusive of both start and end day). */
export function rentalDays(start: Date, end: Date) {
  return Math.max(1, differenceInCalendarDays(end, start) + 1);
}

export function includedKilometres(start: Date, end: Date, perDay = DEFAULT_FREE_KM_PER_DAY) {
  return rentalDays(start, end) * perDay;
}

export function extraKilometreCharge(
  drivenKm: number,
  includedKm: number,
  pricePerKmCents: number,
) {
  const extra = Math.max(0, Math.round(drivenKm - includedKm));
  return { extraKm: extra, chargeCents: extra * Math.max(0, pricePerKmCents) };
}

export function inventoryDeduction(
  replacementPriceCents: number,
  missingQuantity: number,
  damagedQuantity: number,
  type: "single" | "set",
) {
  const affected = Math.max(0, missingQuantity) + Math.max(0, damagedQuantity);
  if (affected === 0) return 0;
  // A set is only replaceable as a whole.
  return type === "set" ? replacementPriceCents : affected * replacementPriceCents;
}

export function depositSettlement(depositCents: number, deductionsCents: number) {
  return {
    refundCents: Math.max(0, depositCents - deductionsCents),
    outstandingCents: Math.max(0, deductionsCents - depositCents),
  };
}

export function formatEuro(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    (cents ?? 0) / 100,
  );
}

export function euroToCents(value: string | number) {
  const numeric = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * 100);
}

export const TANK_LEVELS = [
  { value: "empty", label: "Leer" },
  { value: "quarter", label: "1/4" },
  { value: "half", label: "1/2" },
  { value: "three_quarters", label: "3/4" },
  { value: "full", label: "Voll" },
] as const;

export type TankLevel = (typeof TANK_LEVELS)[number]["value"];

const TANK_FRACTION: Record<TankLevel, number> = {
  empty: 0,
  quarter: 0.25,
  half: 0.5,
  three_quarters: 0.75,
  full: 1,
};

/** Missing fuel as a tank fraction (0 bis 1) compared to the handover level. */
export function tankShortfall(handover: TankLevel | null, ret: TankLevel | null) {
  if (!handover || !ret) return 0;
  return Math.max(0, TANK_FRACTION[handover] - TANK_FRACTION[ret]);
}

export function tankLabel(level?: string | null) {
  return TANK_LEVELS.find((entry) => entry.value === level)?.label ?? "-";
}
