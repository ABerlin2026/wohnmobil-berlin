import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown } from "lucide-react";
import heroCamper from "@/assets/hero-camper.jpg";
import camperVideo from "@/assets/camper-hero-video-optimized.mp4";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const HeroSection = () => {
  const [showPhoto, setShowPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVideoEnded = useCallback(() => {
    setShowPhoto(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {/* Photo layer – always mounted, fades in after video ends */}
        <img
          src={heroCamper}
          alt="Wohnmobil mieten Berlin Brandenburg"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: showPhoto ? 1 : 0 }}
        />

        {/* Video layer – fades out when done */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={heroCamper}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: showPhoto ? 0 : 1 }}
          src={camperVideo}
          onEnded={handleVideoEnded}
        />

        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 container-narrow w-full section-padding pt-28 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.05]">
            Wohnmobil mieten in Berlin &amp; Brandenburg
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Dein Camper für 4 Personen – direkt aus Berlin losfahren und die Freiheit auf vier Rädern erleben. Vollkasko, 150&nbsp;Freikilometer pro Tag und Haustiere willkommen.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {["4 Schlafplätze", "Vollkasko inkl.", "Ab 119 €/Tag", "Hunde willkommen"].map((item) => (
              <span key={item} className="border border-border/60 rounded-full px-4 py-1.5 text-foreground/70">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button variant="hero" size="lg" onClick={scrollToContact} className="px-10 py-6">
              Jetzt unverbindlich anfragen
            </Button>
            <Button variant="whatsapp" size="lg" asChild className="px-10 py-6">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("vorteile")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-float text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </section>
  );
};

export default HeroSection;
