import { HandHelping, BookOpen, Video, SmilePlus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [HandHelping, BookOpen, Video, SmilePlus];

const BeginnerSection = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.beginner.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">{t.beginner.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{t.beginner.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-border/20 rounded-xl overflow-hidden max-w-4xl mx-auto">
          {t.beginner.items.map((p, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="bg-background p-8 group">
                <Icon className="h-5 w-5 text-primary mb-4 group-hover:text-loxone-light transition-colors" />
                <h3 className="font-display font-semibold text-sm mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BeginnerSection;
