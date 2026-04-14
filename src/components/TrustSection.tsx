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
  { icon: MapPin, title: "Abholung Berlin", text: "Start in 13127 Berlin Buchholz." },
];

const TrustSection = () => {
  return (
    <section id="vorteile" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber">Auf einen Blick</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Warum unseren Camper in Berlin mieten?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transparent, fair und ohne Überraschungen – alles für deinen Roadtrip.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {advantages.map((a) => (
            <div
              key={a.title}
              className="group relative bg-popover rounded-2xl p-6 border border-border/50 hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5 transition-all duration-300"
            >
              <div className="h-11 w-11 gradient-amber rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <a.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-base mb-1.5">{a.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
