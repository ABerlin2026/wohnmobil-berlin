import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { de as dfnsDe, enUS as dfnsEn } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, XCircle, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeasonCalendar } from "@/components/SeasonCalendar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBookedDates } from "@/hooks/useBookedDates";

export type BookingType = "rental" | "event" | "holiday";

interface AvailabilityCheckerProps {
  /** Called when the user clicks "Anfrage senden" after a successful check.
   *  Pre-fills the inquiry form below. */
  onProceedToInquiry: (type: BookingType, start: Date, end: Date) => void;
  minDaysFor: Record<BookingType, number>;
  minLeadDays: number;
}

const SEASON_START_MONTH = 3; // April
const SEASON_END_MONTH = 9; // October
const isOutOfSeason = (d: Date) =>
  d.getMonth() < SEASON_START_MONTH || d.getMonth() > SEASON_END_MONTH;

type Result =
  | { kind: "available"; nights: number; days: number }
  | { kind: "unavailable"; reason: string };

const AvailabilityChecker = ({
  onProceedToInquiry,
  minDaysFor,
  minLeadDays,
}: AvailabilityCheckerProps) => {
  const { t, language } = useLanguage();
  const dfnsLocale = language === "de" ? dfnsDe : dfnsEn;
  const { isDateBooked, isDateUnavailable, refetch, loading } = useBookedDates();

  const [type, setType] = useState<BookingType>("rental");
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result) {
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [result]);

  const tA = t.availability;

  const minDays = minDaysFor[type];
  const earliestStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, minLeadDays);
  }, [minLeadDays]);

  const minEndDate = useMemo(
    () => (start ? addDays(start, minDays - 1) : undefined),
    [start, minDays],
  );

  const isCheckoutBlocked = (date: Date, s: Date): boolean => {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const sd = new Date(s); sd.setHours(0, 0, 0, 0);
    for (let cur = new Date(sd); cur < d; cur = addDays(cur, 1)) {
      if (isDateBooked(cur)) return true;
    }
    return false;
  };

  const check = () => {
    setResult(null);
    if (!start || !end) {
      setResult({ kind: "unavailable", reason: tA.errMissing });
      return;
    }
    if (start < earliestStart) {
      setResult({ kind: "unavailable", reason: tA.errLeadTime.replace("{n}", String(minLeadDays)) });
      return;
    }
    if (isOutOfSeason(start) || isOutOfSeason(end)) {
      setResult({ kind: "unavailable", reason: tA.errOutOfSeason });
      return;
    }
    const days = differenceInCalendarDays(end, start) + 1;
    if (days < minDays) {
      setResult({ kind: "unavailable", reason: tA.errMinDays.replace("{n}", String(minDays)) });
      return;
    }
    // Walk every night in the range — none may be booked.
    for (let cur = new Date(start); cur < end; cur = addDays(cur, 1)) {
      if (isDateBooked(cur)) {
        setResult({ kind: "unavailable", reason: tA.errBooked });
        return;
      }
    }
    setResult({ kind: "available", nights: days - 1, days });
  };

  const reset = () => {
    setStart(undefined);
    setEnd(undefined);
    setResult(null);
  };

  return (
    <div className="bg-surface-1 rounded-xl border border-primary/30 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base text-foreground">{tA.title}</h3>
          <p className="text-xs text-muted-foreground">{tA.subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Nutzungsart */}
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{tA.useCase}</label>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as BookingType);
              setResult(null);
            }}
          >
            <SelectTrigger className="bg-surface-2 border-border/20 rounded-lg h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rental">{tA.optionRental}</SelectItem>
              <SelectItem value="event">{tA.optionEvent}</SelectItem>
              <SelectItem value="holiday">{tA.optionHoliday}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {tA.minDaysHint.replace("{n}", String(minDays))}
          </p>
        </div>

        {/* Datum */}
        <div className="grid grid-cols-2 gap-3">
          <Popover open={startOpen} onOpenChange={(o) => { setStartOpen(o); if (o) refetch(true); }}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "bg-surface-2 border-border/20 rounded-lg h-11 w-full justify-start text-left font-normal text-xs sm:text-sm",
                  !start && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {start ? format(start, "EEE, dd.MM.yyyy", { locale: dfnsLocale }) : tA.from}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <SeasonCalendar
                mode="single"
                locale={dfnsLocale}
                selected={start}
                onSelect={(d) => {
                  if (!d) return;
                  if (d < earliestStart || isOutOfSeason(d) || isDateUnavailable(d, minDays, earliestStart)) return;
                  setStart(d);
                  setEnd(undefined);
                  setResult(null);
                  setStartOpen(false);
                }}
                defaultMonth={start ?? earliestStart}
                disabled={(d) =>
                  d < earliestStart ||
                  isOutOfSeason(d) ||
                  isDateUnavailable(d, minDays, earliestStart)
                }
                initialFocus
                weekStartsOn={1}
                className="p-3 pointer-events-auto"
                modifiers={{
                  booked: (d) =>
                    d < earliestStart ||
                    isOutOfSeason(d) ||
                    isDateUnavailable(d, minDays, earliestStart),
                }}
                modifiersClassNames={{
                  booked:
                    "!bg-destructive/20 !text-destructive !opacity-100 font-semibold ring-1 ring-destructive/30 cursor-not-allowed",
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover open={endOpen} onOpenChange={(o) => { setEndOpen(o); if (o) refetch(true); }}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!start}
                className={cn(
                  "bg-surface-2 border-border/20 rounded-lg h-11 w-full justify-start text-left font-normal text-xs sm:text-sm",
                  !end && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {end ? format(end, "EEE, dd.MM.yyyy", { locale: dfnsLocale }) : tA.to}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <SeasonCalendar
                mode="single"
                locale={dfnsLocale}
                selected={end}
                onSelect={(d) => {
                  if (!d || !start) return;
                  if (
                    isOutOfSeason(d) ||
                    (minEndDate && d < minEndDate) ||
                    isCheckoutBlocked(d, start)
                  ) return;
                  setEnd(d);
                  setResult(null);
                  setEndOpen(false);
                }}
                defaultMonth={start ?? earliestStart}
                disabled={(d) =>
                  !start ||
                  d < (start ?? earliestStart) ||
                  isOutOfSeason(d) ||
                  (minEndDate ? d < minEndDate : false) ||
                  (start ? isCheckoutBlocked(d, start) : false)
                }
                initialFocus
                weekStartsOn={1}
                className="p-3 pointer-events-auto"
                modifiers={{
                  booked: (d) => (start ? isCheckoutBlocked(d, start) : false) || isOutOfSeason(d),
                  tooShort: (d) => !!(minEndDate && start && d > start && d < minEndDate),
                }}
                modifiersClassNames={{
                  booked:
                    "!bg-destructive/20 !text-destructive !opacity-100 font-semibold ring-1 ring-destructive/30 cursor-not-allowed",
                  tooShort: "!text-muted-foreground/50 !opacity-60 cursor-not-allowed",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Aktion */}
        <Button
          type="button"
          onClick={check}
          disabled={loading || !start || !end}
          className="w-full h-11"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {tA.loading}
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> {tA.checkBtn}
            </>
          )}
        </Button>

        {/* Ergebnis */}
        {result?.kind === "available" && start && end && (
          <div ref={resultRef} className="rounded-lg border border-primary/40 bg-primary/10 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">{tA.resultAvailable}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(start, "dd.MM.yyyy", { locale: dfnsLocale })} – {format(end, "dd.MM.yyyy", { locale: dfnsLocale })}
                  {" · "}
                  {result.days} {tA.days} ({result.nights} {tA.nights})
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={() => onProceedToInquiry(type, start, end)}
              >
                {tA.proceedBtn}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={reset}>
                {tA.resetBtn}
              </Button>
            </div>
          </div>
        )}

        {result?.kind === "unavailable" && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-destructive">{tA.resultUnavailable}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{result.reason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityChecker;
