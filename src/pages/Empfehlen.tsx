import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import ReferralForm from "@/components/ReferralForm";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, Phone, Euro } from "lucide-react";

const stepIcons = [Users, Phone, Euro];

const Empfehlen = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageSEO
        title={t.referral.seoTitle}
        description={t.referral.seoDescription}
        canonical="https://wohnmobil-berlin.de/empfehlen"
        breadcrumbs={[
          { name: "Wohnmobil Berlin", url: "https://wohnmobil-berlin.de/" },
          { name: t.referral.label, url: "https://wohnmobil-berlin.de/empfehlen" },
        ]}
      />
      <Navigation />
      <main className="pt-24 pb-12">
        <section className="section-padding">
          <div className="container-narrow">
            {/* Hero */}
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                {t.referral.label}
              </p>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl mb-5 leading-tight">
                {t.referral.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t.referral.subtitle}
              </p>
            </div>

            {/* 3 Steps */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-12">
              {t.referral.steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <div
                    key={i}
                    className="bg-surface-2 border border-border/30 rounded-xl p-6 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-lg mb-2">{step.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto">
              <ReferralForm variant="page" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Empfehlen;
