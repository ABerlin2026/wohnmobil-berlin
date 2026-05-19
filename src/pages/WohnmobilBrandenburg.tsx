import Navigation from "@/components/Navigation";
import PricingSection from "@/components/PricingSection";
import TrustSection from "@/components/TrustSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { scrollToContactName } from "@/lib/scrollToContact";
import { useLanguage } from "@/i18n/LanguageContext";
import heroCamper from "@/assets/hero-camper.jpg";

const WohnmobilBrandenburg = () => {
  const { t, language } = useLanguage();
  const p = t.brandenburgPage;
  const homeLabel = language === "de" ? "Startseite" : "Home";

  return (
    <>
      <PageSEO
        title={p.metaTitle}
        description={p.metaDescription}
        canonical="https://wohnmobil-berlin.de/wohnmobil-brandenburg"
        breadcrumbs={[
          { name: homeLabel, url: "https://wohnmobil-berlin.de/" },
          { name: p.breadcrumb, url: "https://wohnmobil-berlin.de/wohnmobil-brandenburg" },
        ]}
      />
      <Navigation />
      <main>
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-background px-4 sm:px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center min-w-0">

              <div className="min-w-0">
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                  {p.eyebrow}
                </p>
                <h1 className="text-2xl [@media(min-width:380px)]:text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6 break-words">
                  {p.h1}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {p.intro}
                </p>
                <ul className="space-y-2 text-sm text-foreground mb-8">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Button variant="hero" size="lg" onClick={scrollToContactName} className="px-6 sm:px-10 py-6 max-w-full whitespace-normal h-auto text-center">
                  {p.cta}
                </Button>

              </div>
              <div className="relative">
                <img
                  src={heroCamper}
                  alt={p.imgAlt}
                  className="rounded-2xl shadow-elegant w-full h-auto"
                  width={1200}
                  height={800}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted/30">
          <div className="container-narrow max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-6">
              {p.destinationsTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {p.destinationsIntro}
            </p>

            <div className="grid sm:grid-cols-2 gap-6 my-10">
              {p.destinations.map((d) => (
                <div key={d.title} className="p-6 border border-border rounded-xl bg-card">
                  <h3 className="font-display font-semibold mb-2">{d.title}</h3>
                  <p className="text-sm text-muted-foreground">{d.text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-bold mt-12 mb-4">
              {p.whyTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {p.whyText}
            </p>
          </div>
        </section>

        <TrustSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default WohnmobilBrandenburg;
