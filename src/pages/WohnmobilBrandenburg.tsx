import Navigation from "@/components/Navigation";
import PricingSection from "@/components/PricingSection";
import TrustSection from "@/components/TrustSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { scrollToContactName } from "@/lib/scrollToContact";
import heroCamper from "@/assets/hero-camper.jpg";

const WohnmobilBrandenburg = () => {
  return (
    <>
      <PageSEO
        title="Wohnmobil mieten Brandenburg – privat ab Berlin, 119 €/Tag"
        description="Wohnmobil mieten in Brandenburg – privater Camper für 4 Personen, ab Berlin. Vollkasko & 150 km/Tag inklusive."
        canonical="https://wohnmobil-berlin.de/wohnmobil-brandenburg"
        breadcrumbs={[
          { name: "Startseite", url: "https://wohnmobil-berlin.de/" },
          { name: "Wohnmobil mieten Brandenburg", url: "https://wohnmobil-berlin.de/wohnmobil-brandenburg" },
        ]}
      />
      <Navigation />
      <main>
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-background px-4 sm:px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center min-w-0">

              <div className="min-w-0">
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                  Wohnmobil mieten Brandenburg
                </p>
                <h1 className="text-2xl [@media(min-width:380px)]:text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6 break-words">
                  Wohnmobil mieten in Brandenburg – privat ab Berlin
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Du suchst ein Wohnmobil für deinen Brandenburg-Trip? Bei uns leihst du privat einen
                  Camper für 4 Personen – direkt in Berlin abholen und nach wenigen Kilometern bist du
                  mitten im Spreewald, an den Brandenburger Seen oder auf dem Weg zur Ostsee.
                </p>
                <ul className="space-y-2 text-sm text-foreground mb-8">
                  <li>✓ Reisemobil für 4 Personen, Vollkasko inklusive</li>
                  <li>✓ 150 Freikilometer pro Tag – perfekt für Brandenburg-Touren</li>
                  <li>✓ Abholung in Berlin-Pankow (13127) – schnell auf der A10/A11</li>
                  <li>✓ Hunde willkommen, Vorzelt & Markise inklusive</li>
                </ul>
                <Button variant="hero" size="lg" onClick={scrollToContactName} className="px-6 sm:px-10 py-6 max-w-full whitespace-normal h-auto text-center">
                  Camper für Brandenburg-Trip anfragen
                </Button>

              </div>
              <div className="relative">
                <img
                  src={heroCamper}
                  alt="Wohnmobil mieten Brandenburg – Camper für Spreewald, Seenplatte und Ostsee"
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
              Wohnmobilvermietung Brandenburg – die schönsten Ziele
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Brandenburg ist das wohl unterschätzteste Camping-Bundesland Deutschlands. Über 3.000 Seen,
              dichte Wälder, kleine Dörfer und die unberührte Natur des Spreewalds liegen direkt vor
              Berlins Haustür. Mit unserem Reisemobil bist du in 30 – 60 Minuten an Orten, an denen du
              wirklich abschalten kannst.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 my-10">
              <div className="p-6 border border-border rounded-xl bg-card">
                <h3 className="font-display font-semibold mb-2">Spreewald</h3>
                <p className="text-sm text-muted-foreground">
                  Kahnfahrten, Kanäle und Gurken-Touren. Camper auf einem der ruhigen Stellplätze in
                  Lübbenau oder Burg parken – ab Berlin ca. 1 Std.
                </p>
              </div>
              <div className="p-6 border border-border rounded-xl bg-card">
                <h3 className="font-display font-semibold mb-2">Mecklenburgische Seenplatte</h3>
                <p className="text-sm text-muted-foreground">
                  Über 1.000 Seen, perfekt für Familien und Hundebesitzer. Müritz, Plauer See oder Feldberg
                  – mit Wohnmobil flexibel von See zu See.
                </p>
              </div>
              <div className="p-6 border border-border rounded-xl bg-card">
                <h3 className="font-display font-semibold mb-2">Ostsee in 2 – 3 Stunden</h3>
                <p className="text-sm text-muted-foreground">
                  Usedom, Rügen oder Darß – mit 150 Freikilometern pro Tag und Vollkasko entspannt aus
                  Berlin Brandenburg starten.
                </p>
              </div>
              <div className="p-6 border border-border rounded-xl bg-card">
                <h3 className="font-display font-semibold mb-2">Brandenburger Seen</h3>
                <p className="text-sm text-muted-foreground">
                  Werbellinsee, Stechlin, Scharmützelsee – Stellplätze direkt am Wasser, baden vor der
                  Camper-Tür. Ideal für ein verlängertes Wochenende.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-bold mt-12 mb-4">
              Wohnmobil leihen Brandenburg – warum privat?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Wir sind keine große Vermietung mit Schalter und Wartenummern. Du mietest unseren eigenen,
              gepflegten Camper – persönliche Übergabe in Berlin, ehrliche Beratung, transparente Preise
              ohne versteckte Kosten. So funktioniert Wohnmobil mieten in Berlin Brandenburg, wie es sein
              sollte.
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
