import AvailabilityChecker, { type BookingType } from "@/components/AvailabilityChecker";
import { useLanguage } from "@/i18n/LanguageContext";

const MIN_RENTAL_DAYS = 5;
const MIN_EVENT_DAYS = 3;
const MIN_HOLIDAY_DAYS = 3;
const MIN_LEAD_DAYS = 3;

/** Storage key used to hand prefilled values to ContactSection. */
export const AVAILABILITY_PREFILL_KEY = "availability:prefill";

const AvailabilitySection = () => {
  const { t } = useLanguage();

  const handleProceed = (type: BookingType, start: Date, end: Date) => {
    try {
      sessionStorage.setItem(
        AVAILABILITY_PREFILL_KEY,
        JSON.stringify({
          type,
          start: start.toISOString(),
          end: end.toISOString(),
          ts: Date.now(),
        }),
      );
    } catch {
      // sessionStorage may be unavailable (private mode); fall through to scroll only.
    }
    // Notify ContactSection to read the prefill immediately.
    window.dispatchEvent(new CustomEvent("availability:prefill"));
    // Scroll to and focus the first name field in the contact form.
    requestAnimationFrame(() => {
      const firstNameField = document.getElementById("contact-firstname") as HTMLInputElement | null;
      const target = firstNameField ?? document.getElementById("kontakt");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus after scroll settles, without re-scrolling.
      setTimeout(() => firstNameField?.focus({ preventScroll: true }), 600);
    });
  };

  return (
    <section id="availability" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t.availability.title}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t.availability.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.availability.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <AvailabilityChecker
            onProceedToInquiry={handleProceed}
            minDaysFor={{
              rental: MIN_RENTAL_DAYS,
              event: MIN_EVENT_DAYS,
              holiday: MIN_HOLIDAY_DAYS,
            }}
            minLeadDays={MIN_LEAD_DAYS}
          />
        </div>
      </div>
    </section>
  );
};

export default AvailabilitySection;
