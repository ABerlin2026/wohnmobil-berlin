import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const PricingSection = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="preise" className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.pricing.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">{t.pricing.title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-surface-2 rounded-xl p-5 sm:p-8 border border-border/30">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">{t.pricing.offSeason}</p>
            <p className="text-sm text-muted-foreground mb-8">{t.pricing.offSeasonPeriod}</p>
            <div className="flex items-baseline flex-wrap gap-1 mb-8">
              <span className="text-4xl sm:text-5xl font-display font-bold text-foreground break-all">119€</span>
              <span className="text-muted-foreground text-sm">{t.pricing.perDay}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {t.pricing.features.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-secondary-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full py-5" onClick={scrollToContact}>
              {t.pricing.cta}
            </Button>
          </div>

          <div className="bg-primary rounded-xl p-5 sm:p-8 relative">
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary-foreground/15 text-primary-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full tracking-wider uppercase">
              {t.pricing.popular}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/60 mb-1 pr-20 sm:pr-0">{t.pricing.mainSeason}</p>
            <p className="text-sm text-primary-foreground/50 mb-8">{t.pricing.mainSeasonPeriod}</p>
            <div className="flex items-baseline flex-wrap gap-1 mb-8">
              <span className="text-4xl sm:text-5xl font-display font-bold text-primary-foreground break-all">129€</span>
              <span className="text-primary-foreground/60 text-sm">{t.pricing.perDay}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {t.pricing.features.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Check className="h-4 w-4 text-primary-foreground/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="hero-outline" className="w-full py-5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={scrollToContact}>
              {t.pricing.cta}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 bg-surface-2 rounded-xl p-6 border border-border/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm space-y-1.5 text-muted-foreground">
              <p><span className="text-foreground font-medium">{t.pricing.deposit}</span> {t.pricing.depositText}</p>
              <p><span className="text-foreground font-medium">{t.pricing.cleaning}</span> {t.pricing.cleaningText}</p>
              <p><span className="text-foreground font-medium">{t.pricing.extras}</span> {t.pricing.extrasText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
