import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Variant = "card" | "compact" | "onPrimary";

interface Props {
  variant?: Variant;
  className?: string;
}

const TIPS = [
  { slug: "wohnmobil-ruegen-ostsee-von-berlin", de: "Rügen & Ostsee", en: "Rügen & Baltic Sea" },
  { slug: "tropical-island-mit-wohnmobil-ausflug", de: "Tropical Island", en: "Tropical Islands" },
  { slug: "spreewald-tour-wohnmobil-ab-berlin", de: "Spreewald-Tour", en: "Spreewald tour" },
];

const TravelTipsInline = ({ variant = "card", className = "" }: Props) => {
  const { language, t } = useLanguage();
  const isDE = language === "de";
  const ui = t.travelTips;

  if (variant === "compact") {
    return (
      <p className={`text-sm text-muted-foreground ${className}`} style={{ textAlign: "center" }}>
        {ui.inlineLead}{" "}
        {TIPS.map((tip, i) => (
          <span key={tip.slug}>
            <Link
              to={`/reisetipps/${tip.slug}`}
              className="text-primary font-medium hover:underline"
            >
              {isDE ? tip.de : tip.en}
            </Link>
            {i < TIPS.length - 1 ? ", " : ""}
          </span>
        ))}
        .
      </p>
    );
  }

  if (variant === "onPrimary") {
    return (
      <div className={className}>
        <p className="text-sm text-primary-foreground/70 mb-3">{ui.inlineLead}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TIPS.map((tip) => (
            <Link
              key={tip.slug}
              to={`/reisetipps/${tip.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20"
            >
              <MapPin className="h-3 w-3" />
              {isDE ? tip.de : tip.en}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // card variant
  return (
    <div
      className={`rounded-xl bg-surface-1 border border-border/30 p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <MapPin className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-display font-bold text-sm">{ui.inspirationTitle}</p>
          <p className="text-xs text-muted-foreground" style={{ textAlign: "left" }}>
            {ui.inspirationText}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {TIPS.map((tip) => (
          <Link
            key={tip.slug}
            to={`/reisetipps/${tip.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2.5 py-1 rounded-full bg-primary/10"
          >
            {isDE ? tip.de : tip.en}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TravelTipsInline;
