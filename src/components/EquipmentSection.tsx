import { BedDouble, CookingPot, Bath, Monitor, Car, Tent, ShieldCheck, Wind, Thermometer } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const categoryIcons = [BedDouble, CookingPot, Bath, Monitor, Thermometer, Car, Tent, ShieldCheck];

const EquipmentSection = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const categories = t.equipment.categories;

  return (
    <section id="ausstattung" className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.equipment.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">{t.equipment.title}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-1 mb-12">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[i];
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  active === i
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.title}</span>
                <span className="sr-only sm:hidden">{cat.title}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-surface-2 rounded-xl p-8 border border-border/20 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const Icon = categoryIcons[active];
              return <Icon className="h-5 w-5 text-primary" />;
            })()}
            <h3 className="font-display text-lg font-bold">{categories[active].title}</h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {categories[active].items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-secondary-foreground">
                <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
