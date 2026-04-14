import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const FinalCTASection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-primary">
      <div className="container-narrow text-center max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
          Dein Abenteuer beginnt in Berlin
        </h2>
        <p className="text-lg text-primary-foreground/80 leading-relaxed mb-3">
          Wohnmobil mieten, losfahren, frei sein.
        </p>
        <p className="text-sm text-primary-foreground/50 mb-10">
          Beliebte Zeiträume sind schnell vergeben – sichere dir deinen Wunschtermin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="hero-outline"
            size="lg"
            onClick={scrollToContact}
            className="py-5 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
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
