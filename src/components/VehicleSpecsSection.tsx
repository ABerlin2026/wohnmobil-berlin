import { Ruler, Fuel, Gauge, Settings2, Battery, Droplets, Weight, Sun, BabyIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const iconMap = [Ruler, Settings2, Gauge, Fuel, Weight, Droplets, Battery, Sun, BabyIcon];

const VehicleSpecsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="steckbrief" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t.vehicleSpecs.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t.vehicleSpecs.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.vehicleSpecs.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-surface-1 border border-border/30 rounded-2xl p-6 sm:p-10">
          <div className="mb-8 pb-8 border-b border-border/30">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
              {t.vehicleSpecs.modelLabel}
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {t.vehicleSpecs.modelValue}
            </p>
            <p className="text-sm text-secondary-foreground mt-1">
              {t.vehicleSpecs.modelType}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.vehicleSpecs.items.map((item, i) => {
              const Icon = iconMap[i] ?? Settings2;
              return (
                <div
                  key={item.label}
                  className="bg-surface-2 rounded-xl p-5 border border-border/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="font-display font-semibold text-foreground text-sm">
                        {item.value}
                      </p>
                      {item.hint && (
                        <p className="text-xs text-secondary-foreground mt-1 leading-relaxed">
                          {item.hint}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8">
            {t.vehicleSpecs.note}
          </p>
        </div>
      </div>
    </section>
  );
};

export default VehicleSpecsSection;
