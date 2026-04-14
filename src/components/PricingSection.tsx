import { Button } from "@/components/ui/button";
import { Check, Info, Sparkles } from "lucide-react";

const PricingSection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = ["150 km pro Tag inklusive", "Vollkasko inklusive", "Mindestmietdauer 5 Tage", "Weitere km: 0,35 €/km"];

  return (
    <section id="preise" className="section-padding bg-card">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber">Transparente Preise</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Was kostet ein Wohnmobil in Berlin Brandenburg?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Keine versteckten Kosten – du weißt genau, was dich erwartet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Nebensaison */}
          <div className="bg-popover rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-shadow duration-300">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Nebensaison</p>
            <p className="text-sm text-muted-foreground mb-6">Oktober – April</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-display font-bold">119€</span>
              <span className="text-muted-foreground text-sm">/ Tag</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-amber" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="default" className="w-full py-5" onClick={scrollToContact}>
              Jetzt anfragen
            </Button>
          </div>

          {/* Hauptsaison */}
          <div className="relative gradient-dark rounded-2xl p-8 text-primary-foreground overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-amber rounded-full blur-3xl opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-amber-light" />
                <p className="text-xs font-bold uppercase tracking-widest text-amber-light">Hauptsaison</p>
              </div>
              <p className="text-sm opacity-60 mb-6">1. Mai – 30. September</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-display font-bold">129€</span>
                <span className="opacity-60 text-sm">/ Tag</span>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-primary-foreground/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-amber-light" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="w-full py-5" onClick={scrollToContact}>
                Jetzt anfragen
              </Button>
            </div>
          </div>
        </div>

        {/* Zusatzinfos */}
        <div className="max-w-4xl mx-auto mt-8 bg-ocean-soft rounded-2xl p-6 border border-ocean/10">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="h-4 w-4 text-ocean" />
            </div>
            <div className="text-sm space-y-2 text-accent-foreground">
              <p><strong>Kaution:</strong> 1.500 € – per Überweisung oder bar nach Absprache.</p>
              <p><strong>Reinigung:</strong> Bei sauberer Rückgabe keine Kosten. Sonst 200 € Reinigungsgebühr.</p>
              <p><strong>Extras:</strong> Gasgrill (40 €) · E-Scooter (75 €)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
