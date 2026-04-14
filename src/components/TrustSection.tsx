import { Users, MapPin, Shield, Globe, Dog, Tent, Lightbulb, Usb, Car } from "lucide-react";

const advantages = [
  { icon: Users, title: "4 Schlaf- & Sitzplätze", text: "Genug Platz für die ganze Familie oder Freundesgruppe – alle mit Gurt gesichert." },
  { icon: Car, title: "150 km pro Tag inklusive", text: "Großzügiges Freikilometer-Paket für entspannte Tagestouren." },
  { icon: Shield, title: "Vollkasko inklusive", text: "Keine versteckten Versicherungskosten – du bist rundum abgesichert." },
  { icon: Globe, title: "Auslandsfahrten erlaubt", text: "Europa entdecken – mit unserem Camper kein Problem." },
  { icon: Dog, title: "Haustierfreundlich", text: "Dein Hund fährt mit – Camping ist schließlich für die ganze Familie." },
  { icon: Tent, title: "Vorzelt inklusive", text: "Zusätzlicher Wohnraum bei jedem Wetter – direkt vor deiner Tür." },
  { icon: Lightbulb, title: "Markise mit LED-Beleuchtung", text: "Gemütliche Abende unter der Markise mit stimmungsvollem Licht." },
  { icon: Usb, title: "USB-Laden am Schlafplatz", text: "Smartphones direkt am Bett laden – immer einsatzbereit." },
  { icon: MapPin, title: "Abholung in 13127 Berlin", text: "Bequeme Abholung in Berlin Buchholz – direkt starten." },
];

const TrustSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Warum unseren Camper in Berlin mieten?
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Alles, was du für einen entspannten Roadtrip brauchst – transparent, fair und ohne Überraschungen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a) => (
            <div
              key={a.title}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow duration-300"
            >
              <a.icon className="h-8 w-8 text-petrol mb-4" />
              <h3 className="font-serif text-lg mb-2">{a.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
