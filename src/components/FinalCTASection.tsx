import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const FinalCTASection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding gradient-amber text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow text-center max-w-3xl relative">
        <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Dein Abenteuer beginnt in Berlin
        </h2>
        <p className="text-lg opacity-90 leading-relaxed mb-3">
          Wohnmobil mieten, losfahren, frei sein – so einfach kann Urlaub sein.
        </p>
        <p className="text-sm opacity-70 mb-10">
          Beliebte Zeiträume in der Hauptsaison sind schnell vergeben. Sichere dir deinen Wunschtermin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="hero-outline"
            size="lg"
            onClick={scrollToContact}
            className="py-5 px-8 border-primary-foreground/40 hover:border-primary-foreground"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            Jetzt anfragen
          </Button>
          <Button variant="whatsapp" size="lg" asChild className="py-5 px-8">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
