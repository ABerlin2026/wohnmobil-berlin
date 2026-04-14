import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";

const PricingSection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = ["150 km pro Tag inklusive", "Vollkasko inklusive", "Mindestmietdauer 5 Tage", "Weitere km: 0,35 €/km"];

  return (
    <section id="preise" className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Transparente Preise</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Was kostet ein Wohnmobil in Berlin?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Nebensaison */}
          <div className="bg-surface-2 rounded-xl p-8 border border-border/30">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Nebensaison</p>
            <p className="text-sm text-muted-foreground mb-8">Oktober – April</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-display font-bold text-foreground">119€</span>
              <span className="text-muted-foreground text-sm">/ Tag</span>
            </div>
            <ul className="space-y-4 mb-8">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-secondary-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full py-5" onClick={scrollToContact}>
              Jetzt anfragen
            </Button>
          </div>

          {/* Hauptsaison */}
          <div className="bg-primary rounded-xl p-8 relative">
            <div className="absolute top-4 right-4 bg-primary-foreground/15 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              Beliebt
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/60 mb-1">Hauptsaison</p>
            <p className="text-sm text-primary-foreground/50 mb-8">1. Mai – 30. September</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-display font-bold text-primary-foreground">129€</span>
              <span className="text-primary-foreground/60 text-sm">/ Tag</span>
            </div>
            <ul className="space-y-4 mb-8">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Check className="h-4 w-4 text-primary-foreground/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="hero-outline" className="w-full py-5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={scrollToContact}>
              Jetzt anfragen
            </Button>
          </div>
        </div>

        {/* Zusatzinfos */}
        <div className="max-w-4xl mx-auto mt-8 bg-surface-2 rounded-xl p-6 border border-border/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm space-y-1.5 text-muted-foreground">
              <p><span className="text-foreground font-medium">Kaution:</span> 1.500 € – per Überweisung oder bar nach Absprache.</p>
              <p><span className="text-foreground font-medium">Reinigung:</span> Bei sauberer Rückgabe keine Kosten. Sonst 200 €.</p>
              <p><span className="text-foreground font-medium">Extras:</span> Gasgrill (40 €) · E-Scooter (75 €)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
