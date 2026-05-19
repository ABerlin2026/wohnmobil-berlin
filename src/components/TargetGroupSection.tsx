import { Heart, Users, MapPin, Dog, Compass, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import TravelTipsInline from "@/components/TravelTipsInline";

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
            const isRoadtrip = i === 2;
            return (
              <div key={i} className="group p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5 text-primary shrink-0 group-hover:text-loxone-light transition-colors" />
                  <h3 className="font-display font-semibold text-foreground text-sm">{g.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
                {isRoadtrip && (
                  <Link
                    to="/wohnmobil-brandenburg"
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    {t.target.brandenburgCta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12 max-w-2xl mx-auto">
          {t.target.brandenburgOutroBefore}
          <Link to="/wohnmobil-brandenburg" className="text-primary font-medium hover:underline">
            {t.target.brandenburgOutroLink}
          </Link>
          {t.target.brandenburgOutroAfter}
        </p>

        <div className="max-w-2xl mx-auto mt-6">
          <TravelTipsInline variant="compact" />
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
