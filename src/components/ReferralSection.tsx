import ReferralForm from "./ReferralForm";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, Phone, Euro } from "lucide-react";

const stepIcons = [Users, Phone, Euro];

const ReferralSection = () => {
  const { t } = useLanguage();

  return (
    <section
      id="empfehlen"
      aria-labelledby="referral-heading"
      className="section-padding bg-gradient-to-b from-background via-surface-1/40 to-background"
    >
      <div className="container-narrow">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t.referral.label}
          </p>
          <h2
            id="referral-heading"
            className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            {t.referral.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.referral.subtitle}
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-10">
          {t.referral.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div
                key={i}
                className="bg-surface-2 border border-border/30 rounded-xl p-5 md:p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-base md:text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <ReferralForm variant="section" />
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
