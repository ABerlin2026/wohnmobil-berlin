import { useLanguage } from "@/i18n/LanguageContext";
import sunsetImage from "@/assets/camper-sunset-hero.jpg";

const SunsetSection = () => {
  const { t } = useLanguage();

  return (
    <section aria-label={t.sunset.label} className="relative overflow-hidden">
      <div className="relative h-[60vh] min-h-[420px] max-h-[720px] w-full">
        <img
          src={sunsetImage}
          alt={t.sunset.imgAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          width={1920}
          height={1280}
        />
        {/* Gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />

        <div className="relative z-10 h-full container-narrow flex items-end md:items-center md:justify-center pb-12 md:pb-0 md:pl-[20%] lg:pl-[30%]">
          <div className="max-w-xl">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {t.sunset.label}
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
              {t.sunset.title}
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {t.sunset.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SunsetSection;
