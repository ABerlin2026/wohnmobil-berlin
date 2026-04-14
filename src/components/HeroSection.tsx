import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowDown } from "lucide-react";
import heroCamper from "@/assets/hero-camper.jpg";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroCamper}
          alt="Wohnmobil mieten Berlin Brandenburg – Camper am See bei Sonnenuntergang"
          className="w-full h-full object-cover scale-105"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-deep/80 via-slate-deep/50 to-slate-deep/90" />
      </div>

      <div className="relative z-10 container-narrow w-full section-padding pt-28">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 gradient-amber text-primary-foreground text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            Verfügbar in Berlin Buchholz
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-primary-foreground leading-[1.1]">
            Wohnmobil mieten in
            <span className="block text-gradient mt-1">Berlin Brandenburg</span>
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/75 leading-relaxed max-w-lg font-sans">
            Dein Camper für 4 Personen – direkt aus Berlin Buchholz losfahren und die Freiheit auf vier Rädern erleben. Flexibel, komfortabel, unvergesslich.
          </p>

          <div className="flex flex-wrap gap-3">
            {["4 Schlafplätze", "Vollkasko inkl.", "Ab 119 €/Tag", "Hunde willkommen"].map((item) => (
              <span
                key={item}
                className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 text-primary-foreground/90 text-xs font-medium rounded-full px-4 py-2"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="hero" size="lg" onClick={scrollToContact} className="px-8 py-6">
              Jetzt unverbindlich anfragen
            </Button>
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <ArrowDown className="h-5 w-5 text-primary-foreground/40" />
      </div>
    </section>
  );
};

export default HeroSection;
