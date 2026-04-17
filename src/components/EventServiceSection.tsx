import { Button } from "@/components/ui/button";
import { PartyPopper, MapPin, BedDouble, Calendar, Check } from "lucide-react";
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

          <div className="max-w-md mx-auto bg-primary rounded-xl p-8 relative mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/70 mb-1">
              {t.eventService.cardTitle}
            </p>
            <p className="text-sm text-primary-foreground/60 mb-8">{t.eventService.cardPeriod}</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-display font-bold text-primary-foreground">80€</span>
              <span className="text-primary-foreground/70 text-sm">{t.eventService.perDay}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {t.eventService.cardFeatures.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-primary-foreground/85">
                  <Check className="h-4 w-4 text-primary-foreground/70 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="hero-outline"
              className="w-full py-5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={scrollToContact}
            >
              {t.eventService.cta}
            </Button>
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
