import { Button } from "@/components/ui/button";
import { Home, MapPin, Bath, Users, Check, Trees, Sparkles, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import holidayHomeImage from "@/assets/holiday-home-nature.jpg";
import { scrollToContactName } from "@/lib/scrollToContact";

const HolidayHomeSection = () => {
  const { t } = useLanguage();

  const scrollToContact = () => scrollToContactName();

  const features = [
    { icon: Home, text: t.holidayHome.feature1 },
    { icon: MapPin, text: t.holidayHome.feature2 },
    { icon: Bath, text: t.holidayHome.feature3 },
    { icon: Users, text: t.holidayHome.feature4 },
  ];

  const highlightIcons = [Trees, Sparkles, MapPin, Home];

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

        {/* Hero image with overlay quote */}
        <div className="max-w-5xl mx-auto mb-10 relative rounded-2xl overflow-hidden border border-border/20">
          <img
            src={holidayHomeImage}
            alt={t.holidayHome.imgAlt}
            loading="lazy"
            width={1920}
            height={1080}
            className="w-full h-[260px] sm:h-[380px] md:h-[440px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="flex items-start gap-3 max-w-2xl">
              <Quote className="h-6 w-6 text-primary shrink-0 mt-1" />
              <p className="text-base sm:text-xl font-display italic text-foreground leading-snug">
                {t.holidayHome.quote}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-background rounded-2xl p-6 sm:p-10 border border-border/20">
          <p className="text-secondary-foreground mb-10 leading-relaxed">
            {t.holidayHome.description}
          </p>

          {/* Highlights */}
          <div className="mb-10">
            <h3 className="text-lg sm:text-xl font-display font-bold mb-5 text-center">
              {t.holidayHome.highlightsTitle}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {t.holidayHome.highlights.map((h, i) => {
                const Icon = highlightIcons[i] ?? Sparkles;
                return (
                  <div
                    key={h.title}
                    className="bg-surface-2 rounded-xl p-5 border border-border/20 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-1">{h.title}</p>
                        <p className="text-xs text-secondary-foreground leading-relaxed">{h.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Practical features */}
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

          {/* Pricing tiers */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {tiers.map(({ price, label, popular }) => (
              <div
                key={label}
                className={
                  popular
                    ? "bg-primary rounded-xl p-4 sm:p-6 relative"
                    : "bg-surface-2 rounded-xl p-4 sm:p-6 border border-border/30"
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
                      ? "text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/70 mb-3 pr-16"
                      : "text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3"
                  }
                >
                  {label}
                </p>
                <div className="flex items-baseline flex-wrap gap-1 mb-5">
                  <span
                    className={
                      popular
                        ? "text-3xl sm:text-4xl font-display font-bold text-primary-foreground break-all"
                        : "text-3xl sm:text-4xl font-display font-bold text-foreground break-all"
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
