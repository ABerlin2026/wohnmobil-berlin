import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import heroCamper from "@/assets/hero-camper.jpg";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src={heroCamper}
          alt="Wohnmobil mieten Berlin Brandenburg – Camper am See bei Sonnenuntergang"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-dark/85 via-petrol-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 container-narrow w-full section-padding">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground leading-tight">
            Wohnmobil mieten in Berlin&nbsp;Brandenburg
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-xl">
            Dein Camper für 4 Personen – direkt aus Berlin Buchholz losfahren und die Freiheit auf vier Rädern erleben. Flexibel, komfortabel, unvergesslich.
          </p>

          <ul className="flex flex-wrap gap-3 text-sm text-primary-foreground/80">
            {["4 Schlafplätze", "Vollkasko inklusive", "Ab 119 €/Tag", "Abholung Berlin"].map((item) => (
              <li key={item} className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5">
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="hero" size="lg" onClick={scrollToContact} className="text-base px-8 py-6">
              Jetzt unverbindlich anfragen
            </Button>
            <Button variant="whatsapp" size="lg" asChild className="text-base px-8 py-6">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Direkt per WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
