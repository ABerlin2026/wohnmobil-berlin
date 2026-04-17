import { Button } from "@/components/ui/button";
import { Home, MapPin, Bath, Users, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const HolidayHomeSection = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: Home, text: t.holidayHome.feature1 },
    { icon: MapPin, text: t.holidayHome.feature2 },
    { icon: Bath, text: t.holidayHome.feature3 },
    { icon: Users, text: t.holidayHome.feature4 },
  ];

  const tiers = [
    { price: 75, label: t.holidayHome.cardSingle, popular: false },
    { price: 100, label: t.holidayHome.cardDouble, popular: false },
    { price: 125, label: t.holidayHome.cardTriple, popular: false },
    { price: 150, label: t.holidayHome.cardQuad, popular: true },
  ];

  return (
    <section id="ferienwohnung" className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t.holidayHome.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t.holidayHome.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.holidayHome.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-background rounded-2xl p-6 sm:p-10 border border-border/20">
          <p className="text-secondary-foreground mb-8 leading-relaxed">
            {t.holidayHome.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {features.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3 bg-surface-2 rounded-lg p-4 border border-border/10">
                <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-secondary-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {tiers.map(({ price, label, popular }) => (
              <div
                key={label}
                className={
                  popular
                    ? "bg-primary rounded-xl p-6 relative"
                    : "bg-surface-2 rounded-xl p-6 border border-border/30"
                }
              >
                {popular && (
                  <div className="absolute top-3 right-3 bg-primary-foreground/15 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    {t.holidayHome.cardPopular}
                  </div>
                )}
                <p
                  className={
                    popular
                      ? "text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/70 mb-3"
                      : "text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3"
                  }
                >
                  {label}
                </p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span
                    className={
                      popular
                        ? "text-4xl font-display font-bold text-primary-foreground"
                        : "text-4xl font-display font-bold text-foreground"
                    }
                  >
                    {price}€
                  </span>
                  <span
                    className={
                      popular ? "text-primary-foreground/70 text-xs" : "text-muted-foreground text-xs"
                    }
                  >
                    {t.holidayHome.perNightShort}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {t.holidayHome.cardFeatures.map((item) => (
                    <li
                      key={item}
                      className={
                        popular
                          ? "flex items-start gap-2 text-xs text-primary-foreground/85"
                          : "flex items-start gap-2 text-xs text-secondary-foreground"
                      }
                    >
                      <Check
                        className={
                          popular
                            ? "h-3.5 w-3.5 text-primary-foreground/70 shrink-0 mt-0.5"
                            : "h-3.5 w-3.5 text-primary shrink-0 mt-0.5"
                        }
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <Button variant="hero" size="lg" onClick={scrollToContact} className="w-full sm:w-auto">
              {t.holidayHome.cta}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {t.holidayHome.note}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HolidayHomeSection;
