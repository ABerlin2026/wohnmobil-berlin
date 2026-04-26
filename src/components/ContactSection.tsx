import { useState, useMemo, useRef, useEffect } from "react";
import { addDays, endOfMonth, format, differenceInCalendarDays } from "date-fns";
import { de as dfnsDe, enUS as dfnsEn } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SeasonCalendar } from "@/components/SeasonCalendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Send, Zap, Clock, CalendarIcon, AlertTriangle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBookedDates } from "@/hooks/useBookedDates";
import { supabase } from "@/integrations/supabase/client";
import type { BookingType } from "@/components/AvailabilityChecker";
import { AVAILABILITY_PREFILL_KEY } from "@/components/AvailabilitySection";

import { PHONE_URL, TELEGRAM_URL, WHATSAPP_URL, MIN_DRIVER_AGE } from "@/lib/contact";

// Country codes used in the rental dropdown. Allowed = covered by insurance.
const ALLOWED_COUNTRY_CODES = [
  "DE", "DK", "SE", "NO", "FI", "PL", "CZ", "AT", "CH", "HU", "SI", "HR", "SK", "NL",
] as const;
const BLOCKED_COUNTRY_CODES = [
  "BE", "LU", "FR", "IT", "LT", "LV", "EE", "GB", "IE",
  "RS", "BA", "ME", "MK", "AL", "RO", "BG", "BY", "UA", "MD",
] as const;
type CountryCode = typeof ALLOWED_COUNTRY_CODES[number] | typeof BLOCKED_COUNTRY_CODES[number];
const ALL_COUNTRY_CODES: CountryCode[] = [...ALLOWED_COUNTRY_CODES, ...BLOCKED_COUNTRY_CODES];

const MIN_RENTAL_DAYS = 5;
const MIN_EVENT_DAYS = 3;
const MIN_HOLIDAY_DAYS = 3;
/** Minimum lead time in days between today and the earliest possible arrival date. */
const MIN_LEAD_DAYS = 3;
const PRICE_MAIN_SEASON = 129; // May–September
const PRICE_OFF_SEASON = 119; // April & October
const PRICE_EVENT = 80; // Event overnight stay (<50 km)
// Holiday home tiered pricing per night by total persons (1–4)
const HOLIDAY_PRICE_BY_PERSONS: Record<number, number> = { 1: 75, 2: 100, 3: 125, 4: 150 };
const EVENT_KM_LIMIT = 50;
const SEASON_START_MONTH = 3; // April (0-indexed)
const SEASON_END_MONTH = 9; // October (0-indexed)
const MAIN_SEASON_START_MONTH = 4; // May (0-indexed)
const MAIN_SEASON_END_MONTH = 8; // September (0-indexed)

/** Returns the nightly price for a given date based on season. */
const priceForDate = (date: Date): number => {
  const m = date.getMonth();
  return m >= MAIN_SEASON_START_MONTH && m <= MAIN_SEASON_END_MONTH
    ? PRICE_MAIN_SEASON
    : PRICE_OFF_SEASON;
};

/** True if date lies outside the rental season (Apr 1 – Oct 31). */
const isOutOfSeason = (date: Date): boolean => {
  const m = date.getMonth();
  return m < SEASON_START_MONTH || m > SEASON_END_MONTH;
};

/** Next April 1st on or after the given date. */
const nextSeasonStart = (from: Date): Date => {
  const year = from.getMonth() > SEASON_END_MONTH ? from.getFullYear() + 1 : from.getFullYear();
  return new Date(year, SEASON_START_MONTH, 1);
};

const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isDateBooked, isDateUnavailable, firstBookedDate, loading: calendarLoading, refetch } = useBookedDates();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("DE");
  const dfnsLocale = useLanguage().language === "de" ? dfnsDe : dfnsEn;
  // Sort country codes by their localized label for the current language
  const sortedCountryCodes = useMemo(() => {
    const collator = new Intl.Collator(useLanguage().language);
    return [...ALL_COUNTRY_CODES].sort((a, b) =>
      collator.compare(t.contact.countries[a], t.contact.countries[b])
    );
  }, [t.contact.countries]);
  const [bookingType, setBookingType] = useState<"rental" | "event" | "holiday">("rental");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", birthdate: "", adults: "", children: "", pet: "nein", message: "", destination: "", kilometers: "",
  });
  const [extras, setExtras] = useState({
    beddingQty: 0, towels: false, grill: false, scooterQty: 0, cleaning: false, awning: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const EXTRA_PRICES = { bedding: 10, towels: 20, grill: 40, scooter: 75, cleaning: 200, awning: 100 };
  const extrasTotal =
    extras.beddingQty * EXTRA_PRICES.bedding +
    (extras.towels ? EXTRA_PRICES.towels : 0) +
    (extras.grill ? EXTRA_PRICES.grill : 0) +
    extras.scooterQty * EXTRA_PRICES.scooter +
    (extras.cleaning ? EXTRA_PRICES.cleaning : 0) +
    (extras.awning ? EXTRA_PRICES.awning : 0);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const isCountryBlocked = bookingType === "rental" && selectedCountry && (BLOCKED_COUNTRY_CODES as readonly string[]).includes(selectedCountry);
  const minDays =
    bookingType === "event" ? MIN_EVENT_DAYS :
    bookingType === "holiday" ? MIN_HOLIDAY_DAYS :
    MIN_RENTAL_DAYS;
  // Rental duration counted in calendar days (inclusive of arrival and departure day).
  // Example: 19.4. -> 23.4. = 5 days.
  const rentalDays = startDate && endDate ? differenceInCalendarDays(endDate, startDate) + 1 : null;
  const isTooShort = rentalDays !== null && rentalDays < minDays;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  /** Earliest selectable arrival date: today + MIN_LEAD_DAYS days. */
  const earliestStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, MIN_LEAD_DAYS);
  }, []);
  const seasonAnchor = isOutOfSeason(earliestStart) ? nextSeasonStart(earliestStart) : earliestStart;
  const calendarDefaultMonth =
    firstBookedDate && firstBookedDate >= earliestStart && !isOutOfSeason(firstBookedDate)
      ? firstBookedDate
      : seasonAnchor;

  const renderCalendarDay = (date: Date) => {
    const blocked = isDateUnavailable(date, minDays, earliestStart) || isOutOfSeason(date) || date < earliestStart;

    return (
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          blocked && "bg-destructive/15 text-destructive line-through font-semibold",
        )}
      >
        {format(date, "d", { locale: dfnsLocale })}
      </span>
    );
  };

  // Minimum end date: arrival counts as day 1, so minDays days
  // means minDays - 1 nights from the start date.
  const minEndDate = useMemo(
    () => (startDate ? addDays(startDate, minDays - 1) : undefined),
    [startDate, minDays],
  );

  /**
   * Checkout day rules: a day is blocked as checkout if any night between
   * startDate (inclusive) and date (exclusive) is booked. The checkout day
   * itself may equal the next booking's arrival day (guest leaves in the
   * morning, next guest arrives later).
   */
  const isCheckoutBlocked = (date: Date, start: Date): boolean => {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const s = new Date(start); s.setHours(0, 0, 0, 0);
    for (let cur = new Date(s); cur < d; cur = addDays(cur, 1)) {
      if (isDateBooked(cur)) return true;
    }
    return false;
  };

  const endCalendarDefaultMonth = useMemo(() => {
    if (!startDate) return calendarDefaultMonth;
    // If fewer than minDays remain in the start month, jump to next month
    const daysToMonthEnd = differenceInCalendarDays(endOfMonth(startDate), startDate);
    if (daysToMonthEnd < minDays - 1) {
      return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    }
    return startDate;
  }, [startDate, calendarDefaultMonth]);

  const adultsNum = parseInt(form.adults, 10) || 0;
  const childrenNum = parseInt(form.children, 10) || 0;
  const totalPersons = adultsNum + childrenNum;
  const isTooManyPersons = totalPersons > 4;

  /** Parse birthdate from "TT.MM.JJJJ" string. Returns null if invalid/incomplete. */
  const parseBirthdate = (value: string): Date | null => {
    const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(year, month - 1, day);
    if (
      d.getFullYear() !== year ||
      d.getMonth() !== month - 1 ||
      d.getDate() !== day
    ) return null;
    if (d > new Date()) return null;
    return d;
  };

  /** Auto-format input as user types: 12082001 -> 12.08.2001 */
  const formatBirthdateInput = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  };

  /** Computed driver age from birthdate string ("TT.MM.JJJJ"). */
  const driverAge = useMemo(() => {
    const dob = parseBirthdate(form.birthdate);
    if (!dob) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }, [form.birthdate]);
  const isDriverTooYoung = bookingType === "rental" && driverAge !== null && driverAge < MIN_DRIVER_AGE;
  const isBirthdateInvalid =
    bookingType === "rental" &&
    form.birthdate.length > 0 &&
    parseBirthdate(form.birthdate) === null;

  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Pick up dates/type from the AvailabilitySection (above PricingSection on the page).
  // Reads on mount AND on the custom event fired right after the user clicks "Anfrage senden".
  useEffect(() => {
    const apply = () => {
      try {
        const raw = sessionStorage.getItem(AVAILABILITY_PREFILL_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as {
          type: BookingType;
          start: string;
          end: string;
        };
        if (parsed?.type) setBookingType(parsed.type);
        if (parsed?.start) setStartDate(new Date(parsed.start));
        if (parsed?.end) setEndDate(new Date(parsed.end));
        sessionStorage.removeItem(AVAILABILITY_PREFILL_KEY);
      } catch {
        // ignore malformed prefill
      }
    };
    apply();
    window.addEventListener("availability:prefill", apply);
    return () => window.removeEventListener("availability:prefill", apply);
  }, []);

  const buildExtrasSummary = () => {
    const parts: string[] = [];
    if (extras.towels) parts.push("Handtücher (20 €)");
    if (extras.grill) parts.push("Grill (40 €)");
    if (extras.beddingQty > 0) parts.push(`Bettwäsche × ${extras.beddingQty} (${extras.beddingQty * 10} €)`);
    if (extras.scooterQty > 0) parts.push(`E-Scooter × ${extras.scooterQty} (${extras.scooterQty * 75} €)`);
    if (extras.cleaning) parts.push("Endreinigung (200 €)");
    if (extras.awning) parts.push("Vorzelt (100 €)");
    return parts.length ? parts.join(", ") : "Keine";
  };

  const computeTotalGross = (): string | undefined => {
    if (!startDate || !endDate || rentalDays === null) return undefined;
    const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    const plannedKm = parseInt(form.kilometers, 10) || 0;
    if (bookingType === "event") {
      return fmt(rentalDays * PRICE_EVENT + extrasTotal);
    }
    if (bookingType === "holiday") {
      const persons = Math.min(4, Math.max(1, totalPersons));
      const pricePerNight = HOLIDAY_PRICE_BY_PERSONS[persons];
      const nights = Math.max(1, rentalDays - 1);
      return fmt(nights * pricePerNight + extrasTotal);
    }
    let mainNights = 0, offNights = 0;
    for (let i = 0; i < rentalDays; i++) {
      const d = addDays(startDate, i);
      if (priceForDate(d) === PRICE_MAIN_SEASON) mainNights++;
      else offNights++;
    }
    const rentalSum = mainNights * PRICE_MAIN_SEASON + offNights * PRICE_OFF_SEASON;
    const freeKm = rentalDays * 150;
    const extraKmCost = Math.max(0, plannedKm - freeKm) * 0.35;
    return fmt(rentalSum + extrasTotal + extraKmCost);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast({ title: t.contact.toastMissing, description: t.contact.toastMissingDesc, variant: "destructive" });
      return;
    }
    if (startDate < earliestStart) {
      toast({ title: t.contact.toastLeadTime, description: t.contact.toastLeadTimeDesc, variant: "destructive" });
      return;
    }
    if (isTooShort) {
      toast({
        title: t.contact.toastMinDays,
        description: bookingType === "event"
          ? `${t.contact.toastMinDays}: ${MIN_EVENT_DAYS} ${t.contact.summaryDays}.`
          : t.contact.toastMinDaysDesc,
        variant: "destructive",
      });
      return;
    }
    if (isCountryBlocked) {
      toast({ title: t.contact.toastCountry, description: t.contact.toastCountryDesc, variant: "destructive" });
      return;
    }
    if (isTooManyPersons) {
      toast({ title: t.contact.toastMaxPersons, description: t.contact.toastMaxPersonsDesc, variant: "destructive" });
      return;
    }
    if (isDriverTooYoung) {
      toast({ title: t.contact.toastMinAge, description: t.contact.toastMinAgeDesc, variant: "destructive" });
      return;
    }
    if (!termsAccepted) {
      toast({ title: t.contact.toastTerms, description: t.contact.toastTermsDesc, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const bookingTypeLabel =
        bookingType === "rental" ? "Wohnmobil-Miete"
          : bookingType === "event" ? "Event/Übernachtung"
          : "Ferienwohnung";
      const idempotencyKey = `inquiry-${crypto.randomUUID()}`;
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "inquiry-notification",
          recipientEmail: "anfrage@wohnmobil-berlin.de",
          idempotencyKey,
          templateData: {
            bookingType: bookingTypeLabel,
            name: form.name,
            email: form.email,
            phone: form.phone,
            birthdate: form.birthdate || undefined,
            startDate: format(startDate, "EEE, dd.MM.yyyy", { locale: dfnsLocale }),
            endDate: format(endDate, "EEE, dd.MM.yyyy", { locale: dfnsLocale }),
            rentalDays,
            destination: bookingType === "holiday" ? t.contact.holidayLocationValue : (form.destination || undefined),
            country: bookingType === "rental" ? t.contact.countries[selectedCountry] : undefined,
            kilometers: bookingType === "rental" ? (form.kilometers || undefined) : undefined,
            adults: form.adults || undefined,
            children: form.children || undefined,
            pet: form.pet === "ja" ? "Ja" : "Nein",
            message: form.message || undefined,
            extras: buildExtrasSummary(),
            totalGross: computeTotalGross(),
            submittedAt: new Date().toLocaleString("de-DE"),
          },
        },
      });
      if (error) throw error;

      toast({ title: t.contact.toastSuccess, description: t.contact.toastSuccessDesc });
      setForm({ name: "", email: "", phone: "", birthdate: "", adults: "", children: "", pet: "nein", message: "", destination: "", kilometers: "" });
      setExtras({ beddingQty: 0, towels: false, grill: false, scooterQty: 0, cleaning: false, awning: false });
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedCountry("DE");
      setTermsAccepted(false);
    } catch (err) {
      console.error("Anfrage konnte nicht gesendet werden:", err);
      toast({
        title: "Senden fehlgeschlagen",
        description: "Bitte versuche es erneut oder schreib uns direkt per WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="section-padding bg-background overflow-x-hidden">
      <div className="container-narrow w-full box-border">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.contact.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t.contact.title}</h2>
          <p className="text-muted-foreground">{t.contact.subtitle}</p>
        </div>



        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
          {/* Kontaktmöglichkeiten */}
          <div className="bg-surface-1 rounded-xl p-5 sm:p-8 border border-border/20 flex flex-col min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm">{t.contact.directContact}</h3>
                <p className="text-xs text-muted-foreground">{t.contact.directContactSub}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary shrink-0" /> {t.contact.directSimple}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary shrink-0" /> {t.contact.fastResponse}
              </div>
            </div>

            <div className="bg-surface-2 rounded-lg p-4 text-sm text-muted-foreground italic mb-6 border border-border/10">
              {t.contact.sampleMessage}
            </div>

            <div className="bg-surface-2 rounded-lg p-4 text-sm text-muted-foreground mb-6 border border-border/10">
              <p className="font-medium text-foreground mb-1">{t.contact.rentalTimes}</p>
              <p>{t.contact.rentalTimesText}</p>
              <p className="mt-1">{t.contact.minRental}</p>
            </div>

            <div className="mt-auto space-y-3">
              <Button variant="whatsapp" size="lg" className="w-full py-5 text-sm" asChild>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-sm">
                  <MessageCircle className="mr-2 h-5 w-5 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>
              </Button>
              <Button variant="telegram" size="lg" className="w-full py-5 text-sm" asChild>
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm">
                  <Send className="mr-2 h-5 w-5 shrink-0" />
                  <span className="truncate">Telegram</span>
                </a>
              </Button>
              <Button variant="phone" size="lg" className="w-full py-5 text-sm" asChild>
                <a href={PHONE_URL} className="text-sm">
                  <Phone className="mr-2 h-5 w-5 shrink-0" />
                  <span className="truncate">{t.contact.callBtn}</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Formular */}
          <div ref={formRef} className="bg-surface-1 rounded-xl p-5 sm:p-8 border border-border/20 min-w-0 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm">{t.contact.formTitle}</h3>
                <p className="text-xs text-muted-foreground">{t.contact.formSubtitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Buchungstyp */}
              <div className="bg-surface-2 rounded-lg p-3 border border-border/10 space-y-2">
                <label className="text-xs font-medium text-foreground">{t.contact.bookingType}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([
                    { id: "rental", label: t.contact.bookingTypeRental },
                    { id: "event", label: t.contact.bookingTypeEvent },
                    { id: "holiday", label: t.contact.bookingTypeHoliday },
                  ] as const).map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setBookingType(id)}
                      className={cn(
                        "px-3 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors",
                        bookingType === id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-primary/10 text-foreground border-primary/30 hover:bg-primary/20 hover:border-primary/50",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {bookingType === "event" && (
                  <div className="bg-primary/5 rounded-md p-2 border border-primary/20">
                    <p className="text-xs font-medium text-primary">{t.contact.eventInfoTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.contact.eventInfoText}</p>
                  </div>
                )}
                {bookingType === "holiday" && (
                  <div className="bg-primary/5 rounded-md p-2 border border-primary/20">
                    <p className="text-xs font-medium text-primary">{t.contact.holidayInfoTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.contact.holidayInfoText}</p>
                  </div>
                )}
              </div>

              <Input placeholder={t.contact.name} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11 w-full max-w-full min-w-0 box-border" />
              <Input type="email" placeholder={t.contact.email} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11 w-full max-w-full min-w-0 box-border" />
              <Input type="tel" inputMode="tel" placeholder={t.contact.phone} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11 w-full max-w-full min-w-0 box-border" />

              {bookingType === "rental" && (
                <div className="w-full max-w-full min-w-0 overflow-hidden">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {t.contact.birthdate}
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    required
                    value={form.birthdate}
                    placeholder="TT.MM.JJJJ"
                    maxLength={10}
                    pattern="\d{2}\.\d{2}\.\d{4}"
                    autoComplete="bday"
                    onChange={(e) => setForm({ ...form, birthdate: formatBirthdateInput(e.target.value) })}
                    className="bg-surface-2 border-border/20 rounded-lg h-9 w-full max-w-full min-w-0 box-border block overflow-hidden pr-3 text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t.contact.birthdateHint}</p>
                  {isBirthdateInvalid && (
                    <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">{t.contact.birthdateInvalid}</p>
                    </div>
                  )}
                  {isDriverTooYoung && (
                    <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">{t.contact.minAgeError}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <Popover open={startOpen} onOpenChange={(open) => { setStartOpen(open); if (open) refetch(true); }}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("bg-surface-2 border-border/20 rounded-lg h-11 w-full max-w-full min-w-0 justify-start text-left font-normal text-xs sm:text-sm", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{startDate ? format(startDate, "EEE, dd.MM.yyyy", { locale: dfnsLocale }) : t.contact.startDate}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <SeasonCalendar mode="single" locale={dfnsLocale} selected={startDate} onSelect={(date) => { if (date && (date < earliestStart || isDateUnavailable(date, minDays, earliestStart) || isOutOfSeason(date))) return; setStartDate(date); setStartOpen(false); }} defaultMonth={calendarDefaultMonth} disabled={(date) => date < earliestStart || isOutOfSeason(date) || isDateUnavailable(date, minDays, earliestStart)} initialFocus className="p-3 pointer-events-auto" weekStartsOn={1} modifiers={{ booked: (date) => date < earliestStart || isDateUnavailable(date, minDays, earliestStart) || isOutOfSeason(date) }} modifiersClassNames={{ booked: "rdp-day_booked !bg-destructive/20 !text-destructive !opacity-100 font-semibold ring-1 ring-destructive/30 cursor-not-allowed" }} components={{ DayContent: ({ date }) => renderCalendarDay(date) }} />
                    </PopoverContent>
                  </Popover>
                  <Popover open={endOpen} onOpenChange={(open) => { setEndOpen(open); if (open) refetch(true); }}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("bg-surface-2 border-border/20 rounded-lg h-11 w-full max-w-full min-w-0 justify-start text-left font-normal text-xs sm:text-sm", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{endDate ? format(endDate, "EEE, dd.MM.yyyy", { locale: dfnsLocale }) : t.contact.endDate}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <SeasonCalendar mode="single" locale={dfnsLocale} selected={endDate} onSelect={(date) => { if (date && (isOutOfSeason(date) || (minEndDate && date < minEndDate) || (startDate && isCheckoutBlocked(date, startDate)))) return; setEndDate(date); setEndOpen(false); }} defaultMonth={endCalendarDefaultMonth} disabled={(date) => date < (startDate || new Date()) || isOutOfSeason(date) || (minEndDate ? date < minEndDate : false) || (startDate ? isCheckoutBlocked(date, startDate) : isDateBooked(date))} initialFocus className="p-3 pointer-events-auto" weekStartsOn={1} modifiers={{ booked: (date) => (startDate ? isCheckoutBlocked(date, startDate) : isDateBooked(date)) || isOutOfSeason(date), tooShort: (date) => !!(minEndDate && startDate && date > startDate && date < minEndDate) }} modifiersClassNames={{ booked: "rdp-day_booked !bg-destructive/20 !text-destructive !opacity-100 font-semibold ring-1 ring-destructive/30 cursor-not-allowed", tooShort: "!text-muted-foreground/50 !opacity-60 cursor-not-allowed" }} components={{ DayContent: ({ date }) => (minEndDate && startDate && date > startDate && date < minEndDate) ? (<span className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50">{format(date, "d", { locale: dfnsLocale })}</span>) : renderCalendarDay(date) }} />
                    </PopoverContent>
                  </Popover>
                </div>
                {calendarLoading && (
                  <p className="text-xs text-muted-foreground mt-1">{t.contact.calendarLoading}</p>
                )}
                {!calendarLoading && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {startDate ? t.contact.minDaysError : t.contact.dateBooked}
                  </p>
                )}
                {isTooShort && (
                  <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{t.contact.minDaysError}</p>
                  </div>
                )}
              </div>

              {bookingType === "holiday" ? (
                <div className="bg-surface-2 rounded-lg p-3 border border-border/10">
                  <p className="text-xs text-muted-foreground mb-1">{t.contact.holidayLocationLabel}</p>
                  <p className="text-sm font-medium text-foreground">{t.contact.holidayLocationValue}</p>
                </div>
              ) : (
                <Input
                  placeholder={bookingType === "event" ? t.contact.eventDestination : t.contact.destination}
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="bg-surface-2 border-border/20 rounded-lg h-11 w-full max-w-full min-w-0 box-border"
                />
              )}

              {bookingType === "rental" && (
                <>
                  <div>
                    <Select value={selectedCountry} onValueChange={(v) => setSelectedCountry(v as CountryCode)}>
                      <SelectTrigger className="bg-surface-2 border-border/20 rounded-lg h-11">
                        <SelectValue placeholder={t.contact.selectCountry} />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedCountryCodes.map((code) => (
                          <SelectItem key={code} value={code}>{t.contact.countries[code]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isCountryBlocked && (
                      <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-xs text-destructive">{t.contact.countryBlocked}</p>
                      </div>
                    )}
                  </div>

                  <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder={t.contact.kilometers} required value={form.kilometers} onChange={(e) => setForm({ ...form, kilometers: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" min="0" />
                </>
              )}

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <Select value={form.adults} onValueChange={(v) => setForm({ ...form, adults: v })}>
                    <SelectTrigger className="bg-surface-2 border-border/20 rounded-lg h-11">
                      <SelectValue placeholder={t.contact.adults} />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((n) => {
                        const disabled = n + childrenNum > 4;
                        return (
                          <SelectItem key={n} value={String(n)} disabled={disabled}>
                            {n}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Select value={form.children} onValueChange={(v) => setForm({ ...form, children: v })}>
                    <SelectTrigger className="bg-surface-2 border-border/20 rounded-lg h-11">
                      <SelectValue placeholder={t.contact.children} />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map((n) => {
                        const disabled = adultsNum > 0 && n + adultsNum > 4;
                        return (
                          <SelectItem key={n} value={String(n)} disabled={disabled}>
                            {n}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                {isTooManyPersons && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{t.contact.maxPersonsError}</p>
                  </div>
                )}
              </div>
              <select
                className="flex h-11 w-full rounded-lg border border-border/20 bg-surface-2 px-3 py-2 text-xs sm:text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.pet}
                onChange={(e) => setForm({ ...form, pet: e.target.value })}
              >
                <option value="nein">{t.contact.petNo}</option>
                <option value="ja">{t.contact.petYes}</option>
              </select>
              <Textarea placeholder={t.contact.message} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg" />

              {/* Extras */}
              <div className="bg-surface-2 rounded-lg p-4 border border-border/10 space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.contact.extrasTitle}</p>
                  <p className="text-xs text-muted-foreground">{t.contact.extrasSubtitle}</p>
                </div>
                {/* 1. Towels */}
                <label className="flex items-center justify-between gap-3 cursor-pointer text-sm">
                  <span className="flex items-center gap-3">
                    <Checkbox checked={extras.towels} onCheckedChange={(c) => setExtras({ ...extras, towels: c === true })} />
                    <span>{t.contact.extraTowels}</span>
                  </span>
                  <span className="text-muted-foreground">20 €</span>
                </label>
                {/* 2. Grill */}
                <label className="flex items-center justify-between gap-3 cursor-pointer text-sm">
                  <span className="flex items-center gap-3">
                    <Checkbox checked={extras.grill} onCheckedChange={(c) => setExtras({ ...extras, grill: c === true })} />
                    <span>{t.contact.extraGrill}</span>
                  </span>
                  <span className="text-muted-foreground">40 €</span>
                </label>
                {/* 3. Bedding */}
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex flex-col">
                    <span>{t.contact.extraBedding}</span>
                    <span className="text-xs text-muted-foreground">{t.contact.extraBeddingQty} · 10 € / Person</span>
                  </div>
                  <Select value={String(extras.beddingQty)} onValueChange={(v) => setExtras({ ...extras, beddingQty: parseInt(v, 10) })}>
                    <SelectTrigger className="bg-surface-1 border-border/20 rounded-lg h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 4. E-Scooter */}
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex flex-col">
                    <span>{t.contact.extraScooter}</span>
                    <span className="text-xs text-muted-foreground">{t.contact.extraScooterQty} · 75 € / Stk.</span>
                  </div>
                  <Select value={String(extras.scooterQty)} onValueChange={(v) => setExtras({ ...extras, scooterQty: parseInt(v, 10) })}>
                    <SelectTrigger className="bg-surface-1 border-border/20 rounded-lg h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 5. Cleaning flat fee */}
                <label className="flex items-start justify-between gap-3 cursor-pointer text-sm">
                  <span className="flex items-start gap-3">
                    <Checkbox className="mt-0.5" checked={extras.cleaning} onCheckedChange={(c) => setExtras({ ...extras, cleaning: c === true })} />
                    <span className="flex flex-col">
                      <span>{t.contact.extraCleaning}</span>
                      <span className="text-xs text-muted-foreground">{t.contact.extraCleaningHint}</span>
                    </span>
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">200 €</span>
                </label>
                {/* 6. Awning tent */}
                <label className="flex items-start justify-between gap-3 cursor-pointer text-sm">
                  <span className="flex items-start gap-3">
                    <Checkbox className="mt-0.5" checked={extras.awning} onCheckedChange={(c) => setExtras({ ...extras, awning: c === true })} />
                    <span className="flex flex-col">
                      <span>{t.contact.extraAwning}</span>
                      <span className="text-xs text-muted-foreground">{t.contact.extraAwningHint}</span>
                    </span>
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">100 €</span>
                </label>
                {extrasTotal > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t border-border/10 text-sm">
                    <span className="font-medium">{t.contact.extrasTotal}</span>
                    <span className="font-bold text-primary">{extrasTotal} €</span>
                  </div>
                )}
              </div>

              {/* Gesamtbetrag */}
              {rentalDays !== null && rentalDays >= minDays && startDate && (() => {
                const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const plannedKm = parseInt(form.kilometers, 10) || 0;

                if (bookingType === "event") {
                  // Event mode: flat 80€/day, valid only if distance < 50km
                  const eventSum = rentalDays * PRICE_EVENT;
                  const eventKmExceeded = plannedKm > EVENT_KM_LIMIT;
                  const gross = eventSum + extrasTotal;
                  return (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 space-y-2">
                      <p className="text-sm font-medium text-foreground mb-1">{t.contact.summaryTitle}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t.contact.summaryEventNights} ({rentalDays} {t.contact.summaryDays} × {PRICE_EVENT} €)</span>
                        <span>{fmt(eventSum)} €</span>
                      </div>
                      {extrasTotal > 0 && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{t.contact.summaryExtras}</span>
                          <span>{fmt(extrasTotal)} €</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-border/10">
                        <span className="font-semibold">{t.contact.summaryGross}</span>
                        <span className="font-bold text-primary text-lg">{fmt(gross)} €</span>
                      </div>
                      {eventKmExceeded && (
                        <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <p className="text-xs text-destructive">{t.contact.eventKmWarning}</p>
                        </div>
                      )}
                    </div>
                  );
                }

                if (bookingType === "holiday") {
                  // Holiday home: tiered nightly price by number of persons.
                  // rentalDays is inclusive of arrival + departure day, so nights = rentalDays - 1.
                  const persons = Math.min(4, Math.max(1, totalPersons));
                  const pricePerNight = HOLIDAY_PRICE_BY_PERSONS[persons];
                  const nights = Math.max(1, rentalDays - 1);
                  const holidaySum = nights * pricePerNight;
                  const gross = holidaySum + extrasTotal;
                  return (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 space-y-2">
                      <p className="text-sm font-medium text-foreground mb-1">{t.contact.summaryTitle}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t.contact.summaryHolidayNights} ({nights} × {pricePerNight} € · {persons} P.)</span>
                        <span>{fmt(holidaySum)} €</span>
                      </div>
                      {extrasTotal > 0 && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{t.contact.summaryExtras}</span>
                          <span>{fmt(extrasTotal)} €</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-border/10">
                        <span className="font-semibold">{t.contact.summaryGross}</span>
                        <span className="font-bold text-primary text-lg">{fmt(gross)} €</span>
                      </div>
                    </div>
                  );
                }

                // Sum nightly price per booked night (start inclusive, end exclusive)
                let mainNights = 0;
                let offNights = 0;
                for (let i = 0; i < rentalDays; i++) {
                  const d = addDays(startDate, i);
                  if (priceForDate(d) === PRICE_MAIN_SEASON) mainNights++;
                  else offNights++;
                }
                const rentalSum = mainNights * PRICE_MAIN_SEASON + offNights * PRICE_OFF_SEASON;
                const FREE_KM_PER_DAY = 150;
                const EXTRA_KM_PRICE = 0.35;
                const freeKm = rentalDays * FREE_KM_PER_DAY;
                const extraKm = Math.max(0, plannedKm - freeKm);
                const extraKmCost = extraKm * EXTRA_KM_PRICE;
                const gross = rentalSum + extrasTotal + extraKmCost;
                return (
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 space-y-2">
                    <p className="text-sm font-medium text-foreground mb-1">{t.contact.summaryTitle}</p>
                    {mainNights > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t.contact.summaryMainSeason} ({mainNights} {t.contact.summaryDays} × {PRICE_MAIN_SEASON} €)</span>
                        <span>{fmt(mainNights * PRICE_MAIN_SEASON)} €</span>
                      </div>
                    )}
                    {offNights > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t.contact.summaryOffSeason} ({offNights} {t.contact.summaryDays} × {PRICE_OFF_SEASON} €)</span>
                        <span>{fmt(offNights * PRICE_OFF_SEASON)} €</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{t.contact.summaryFreeKm} ({rentalDays} {t.contact.summaryDays} × {FREE_KM_PER_DAY} km)</span>
                      <span>{freeKm} km</span>
                    </div>
                    {extraKm > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t.contact.summaryExtraKm} ({extraKm} {t.contact.summaryExtraKmUnit})</span>
                        <span>{fmt(extraKmCost)} €</span>
                      </div>
                    )}
                    {extrasTotal > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t.contact.summaryExtras}</span>
                        <span>{fmt(extrasTotal)} €</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border/10">
                      <span className="font-semibold">{t.contact.summaryGross}</span>
                      <span className="font-bold text-primary text-lg">{fmt(gross)} €</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-start gap-3 bg-surface-2 rounded-lg p-3 border border-border/10">
                <Checkbox
                  id="terms-accept"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-0.5 shrink-0"
                  aria-required="true"
                />
                <label htmlFor="terms-accept" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                  {t.contact.termsAcceptPre}{" "}
                  <a
                    href="/agb"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary font-medium hover:underline"
                    aria-label={t.contact.termsLinkAria}
                  >
                    {t.contact.termsLink}
                  </a>
                  {" "}{t.contact.termsAcceptPost}
                </label>
              </div>

              <Button variant="hero" size="lg" type="submit" className="w-full py-5" disabled={submitting || !!isCountryBlocked || isTooShort || isTooManyPersons || isDriverTooYoung || !termsAccepted}>
                {submitting ? "Wird gesendet…" : t.contact.submit}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
