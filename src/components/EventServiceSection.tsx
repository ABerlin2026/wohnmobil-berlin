import { Button } from "@/components/ui/button";
import { PartyPopper, MapPin, BedDouble, Calendar } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const EventServiceSection = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: PartyPopper, text: t.eventService.feature1 },
    { icon: BedDouble, text: t.eventService.feature2 },
    { icon: MapPin, text: t.eventService.feature3 },
    { icon: Calendar, text: t.eventService.feature4 },
  ];

  return (
    <section id="event-service" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t.eventService.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t.eventService.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.eventService.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-surface-1 rounded-2xl p-6 sm:p-10 border border-border/20">
          <p className="text-secondary-foreground mb-8 leading-relaxed">
            {t.eventService.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3 bg-surface-2 rounded-lg p-4 border border-border/10">
                <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-secondary-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1">
                  {t.eventService.priceLabel}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-foreground">80€</span>
                  <span className="text-muted-foreground text-sm">{t.eventService.perDay}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t.eventService.priceCondition}</p>
                <p className="text-xs text-muted-foreground">{t.eventService.minDays}</p>
              </div>
              <Button variant="hero" size="lg" onClick={scrollToContact} className="w-full sm:w-auto">
                {t.eventService.cta}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {t.eventService.note}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventServiceSection;
