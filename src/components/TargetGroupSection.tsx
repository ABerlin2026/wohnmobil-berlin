import { Heart, Users, MapPin, Dog, Compass, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Heart, Users, MapPin, Dog, Compass, Globe];

const TargetGroupSection = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.target.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">{t.target.title}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {t.target.items.map((g, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="group p-6">
                <Icon className="h-5 w-5 text-primary mb-4 group-hover:text-loxone-light transition-colors" />
                <h3 className="font-display font-semibold text-foreground text-sm mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
