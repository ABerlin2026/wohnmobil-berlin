import { Users, MapPin, Shield, Globe, Dog, Tent, Lightbulb, Usb, Car } from "lucide-react";

const advantages = [
  { icon: Users, title: "4 Schlaf- & Sitzplätze", text: "Platz für die ganze Familie – alle mit Gurt gesichert." },
  { icon: Car, title: "150 km/Tag inklusive", text: "Großzügiges Freikilometer-Paket für Tagestouren." },
  { icon: Shield, title: "Vollkasko inklusive", text: "Keine versteckten Versicherungskosten." },
  { icon: Globe, title: "Auslandsfahrten erlaubt", text: "Europa entdecken – kein Problem." },
  { icon: Dog, title: "Haustierfreundlich", text: "Dein Hund fährt mit auf Reisen." },
  { icon: Tent, title: "Vorzelt inklusive", text: "Extra Wohnraum bei jedem Wetter." },
  { icon: Lightbulb, title: "Markise mit LED", text: "Gemütliche Abende mit Stimmungslicht." },
  { icon: Usb, title: "USB am Schlafplatz", text: "Smartphones direkt am Bett laden." },
  { icon: MapPin, title: "Abholung Berlin", text: "Start in Berlin." },
];

const TrustSection = () => {
  return (
    <section id="vorteile" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Auf einen Blick</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Warum unseren Camper mieten?
          </h2>
          <p className="text-muted-foreground mt-4">Mindestmietdauer: 5 Tage · Preis pro Tag</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30 rounded-xl overflow-hidden">
          {advantages.map((a) => (
            <div
              key={a.title}
              className="bg-background p-8 hover:bg-surface-1 transition-colors duration-300 group"
            >
              <a.icon className="h-6 w-6 text-primary mb-5 group-hover:text-loxone-light transition-colors" />
              <h3 className="font-display font-semibold text-sm mb-2 text-foreground">{a.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
