import { Users, MapPin, Shield, Globe, Dog, Tent, Lightbulb, Usb, Car } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Users, Car, Shield, Globe, Dog, Tent, Lightbulb, Usb, MapPin];

const TrustSection = () => {
  const { t } = useLanguage();

  return (
    <section id="vorteile" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.trust.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">{t.trust.title}</h2>
          <p className="text-muted-foreground mt-4">{t.trust.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30 rounded-xl overflow-hidden">
          {t.trust.items.map((a, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="bg-background p-8 hover:bg-surface-1 transition-colors duration-300 group">
                <Icon className="h-6 w-6 text-primary mb-5 group-hover:text-loxone-light transition-colors" />
                <h3 className="font-display font-semibold text-sm mb-2 text-foreground">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
