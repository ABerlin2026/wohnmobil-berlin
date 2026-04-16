import { useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Zap, Clock, CalendarIcon, AlertTriangle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { useGoogleCalendarEvents } from "@/hooks/useGoogleCalendarEvents";

const PHONE_NUMBER = "491234567890";
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F`;
const TELEGRAM_URL = `https://t.me/+${PHONE_NUMBER}`;
const PHONE_URL = `tel:+${PHONE_NUMBER}`;

const ALLOWED_COUNTRIES = [
  "Deutschland", "Dänemark", "Schweden", "Norwegen", "Finnland",
  "Polen", "Tschechien", "Österreich", "Schweiz", "Ungarn",
  "Slowenien", "Kroatien", "Slowakei",
];

const BLOCKED_COUNTRIES = [
  "Niederlande", "Belgien", "Luxemburg", "Frankreich", "Italien",
  "Litauen", "Lettland", "Estland", "Vereinigtes Königreich", "Irland",
  "Serbien", "Bosnien und Herzegowina", "Montenegro", "Nordmazedonien",
  "Albanien", "Rumänien", "Bulgarien", "Belarus", "Ukraine", "Moldau",
];

const OTHER_COUNTRIES = [...ALLOWED_COUNTRIES.filter(c => c !== "Deutschland"), ...BLOCKED_COUNTRIES].sort((a, b) => a.localeCompare(b, "de"));
const ALL_COUNTRIES = ["Deutschland", ...OTHER_COUNTRIES];

const MIN_RENTAL_DAYS = 5;

const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isDateBooked, firstBookedDate, loading: calendarLoading } = useGoogleCalendarEvents();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedCountry, setSelectedCountry] = useState("Deutschland");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", persons: "", pet: "nein", message: "", destination: "", kilometers: "",
  });
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const isCountryBlocked = selectedCountry && BLOCKED_COUNTRIES.includes(selectedCountry);
  const rentalDays = startDate && endDate ? differenceInCalendarDays(endDate, startDate) : null;
  const isTooShort = rentalDays !== null && rentalDays < MIN_RENTAL_DAYS;
  const calendarDefaultMonth = firstBookedDate && firstBookedDate >= new Date() ? firstBookedDate : new Date();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast({ title: t.contact.toastMissing, description: t.contact.toastMissingDesc, variant: "destructive" });
      return;
    }
    if (isTooShort) {
      toast({ title: t.contact.toastMinDays, description: t.contact.toastMinDaysDesc, variant: "destructive" });
      return;
    }
    if (isCountryBlocked) {
      toast({ title: t.contact.toastCountry, description: t.contact.toastCountryDesc, variant: "destructive" });
      return;
    }
    toast({ title: t.contact.toastSuccess, description: t.contact.toastSuccessDesc });
    setForm({ name: "", email: "", phone: "", persons: "", pet: "nein", message: "", destination: "", kilometers: "" });
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCountry("");
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
          <div className="bg-surface-1 rounded-xl p-5 sm:p-8 border border-border/20 min-w-0">
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
              <Input placeholder={t.contact.name} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <Input type="email" placeholder={t.contact.email} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <Input type="tel" inputMode="tel" placeholder={t.contact.phone} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <Popover open={startOpen} onOpenChange={setStartOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("bg-surface-2 border-border/20 rounded-lg h-11 justify-start text-left font-normal text-xs sm:text-sm", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{startDate ? format(startDate, "dd.MM.yyyy", { locale: de }) : t.contact.startDate}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" locale={de} selected={startDate} onSelect={(date) => { if (date && isDateBooked(date)) return; setStartDate(date); setStartOpen(false); }} defaultMonth={calendarDefaultMonth} disabled={(date) => date < new Date()} initialFocus className="p-3 pointer-events-auto" weekStartsOn={1} modifiers={{ booked: (date) => isDateBooked(date) }} modifiersClassNames={{ booked: "rdp-day_booked !bg-destructive/20 !text-destructive !opacity-100 font-semibold ring-1 ring-destructive/30 line-through cursor-not-allowed" }} />
                    </PopoverContent>
                  </Popover>
                  <Popover open={endOpen} onOpenChange={setEndOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("bg-surface-2 border-border/20 rounded-lg h-11 justify-start text-left font-normal text-xs sm:text-sm", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{endDate ? format(endDate, "dd.MM.yyyy", { locale: de }) : t.contact.endDate}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" locale={de} selected={endDate} onSelect={(date) => { if (date && isDateBooked(date)) return; setEndDate(date); setEndOpen(false); }} defaultMonth={calendarDefaultMonth} disabled={(date) => date < (startDate || new Date())} initialFocus className="p-3 pointer-events-auto" weekStartsOn={1} modifiers={{ booked: (date) => isDateBooked(date) }} modifiersClassNames={{ booked: "rdp-day_booked !bg-destructive/20 !text-destructive !opacity-100 font-semibold ring-1 ring-destructive/30 line-through cursor-not-allowed" }} />
                    </PopoverContent>
                  </Popover>
                </div>
                {calendarLoading && (
                  <p className="text-xs text-muted-foreground mt-1">{t.contact.calendarLoading}</p>
                )}
                {!calendarLoading && (
                  <p className="text-xs text-muted-foreground mt-1">{t.contact.dateBooked}</p>
                )}
                {isTooShort && (
                  <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{t.contact.minDaysError}</p>
                  </div>
                )}
              </div>

              <Input placeholder={t.contact.destination} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <div>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="bg-surface-2 border-border/20 rounded-lg h-11">
                    <SelectValue placeholder={t.contact.selectCountry} />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
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

              <div className="grid grid-cols-2 gap-3">
                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder={t.contact.persons} value={form.persons} onChange={(e) => setForm({ ...form, persons: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
                <select
                  className="flex h-11 w-full rounded-lg border border-border/20 bg-surface-2 px-3 py-2 text-xs sm:text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.pet}
                  onChange={(e) => setForm({ ...form, pet: e.target.value })}
                >
                  <option value="nein">{t.contact.petNo}</option>
                  <option value="ja">{t.contact.petYes}</option>
                </select>
              </div>
              <Textarea placeholder={t.contact.message} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg" />
              <Button variant="hero" size="lg" type="submit" className="w-full py-5" disabled={!!isCountryBlocked || isTooShort}>
                {t.contact.submit}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
