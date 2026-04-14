import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";

const PricingSection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="preise" className="section-padding bg-card">
      <div className="container-narrow">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Was kostet es, ein Wohnmobil in Berlin Brandenburg zu mieten?
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Transparente Preise ohne versteckte Kosten – damit du genau weißt, was dich erwartet.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Nebensaison */}
          <div className="bg-background rounded-xl p-8 border border-border">
            <p className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">Nebensaison</p>
            <p className="text-sm text-muted-foreground mb-4">Oktober – April</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-serif text-foreground">119&nbsp;€</span>
              <span className="text-muted-foreground pb-1">/ Tag</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["150 km pro Tag inklusive", "Vollkasko inklusive", "Mindestmietdauer 5 Tage", "Weitere km: 0,35 €/km"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-petrol mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero" className="w-full py-5" onClick={scrollToContact}>
              Jetzt anfragen
            </Button>
          </div>

          {/* Hauptsaison */}
          <div className="bg-primary rounded-xl p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary-foreground/20 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
              Beliebt
            </div>
            <p className="text-sm font-sans font-medium uppercase tracking-wider opacity-80 mb-2">Hauptsaison</p>
            <p className="text-sm opacity-70 mb-4">1. Mai – 30. September</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-serif">129&nbsp;€</span>
              <span className="opacity-80 pb-1">/ Tag</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["150 km pro Tag inklusive", "Vollkasko inklusive", "Mindestmietdauer 5 Tage", "Weitere km: 0,35 €/km"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 opacity-80 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero-outline" className="w-full py-5" onClick={scrollToContact}>
              Jetzt anfragen
            </Button>
          </div>
        </div>

        {/* Zusatzinfos */}
        <div className="max-w-4xl mx-auto mt-10 bg-secondary/50 rounded-xl p-6 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-petrol mt-0.5 shrink-0" />
            <div className="text-sm space-y-2">
              <p><strong>Kaution:</strong> 1.500 € – zahlbar per Überweisung oder bar nach Absprache.</p>
              <p><strong>Reinigung:</strong> Das Fahrzeug muss innen und außen gereinigt zurückgegeben werden. Nur bei nicht gereinigter Rückgabe fällt eine Reinigungsgebühr von 200 € an – bei sauberer Rückgabe entstehen keine zusätzlichen Kosten.</p>
              <p><strong>Extras:</strong> Gasgrill (einmalig 40 €) · E-Scooter (einmalig 75 €)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
