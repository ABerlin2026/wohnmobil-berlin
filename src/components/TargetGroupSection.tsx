import { Heart, Users, MapPin, Dog, Compass, Globe } from "lucide-react";

const groups = [
  {
    icon: Heart,
    title: "Für Paare",
    text: "Zu zweit die schönsten Ecken Deutschlands und Europas entdecken – mit eurem eigenen rollenden Zuhause. Romantische Abende unter der Markise inklusive.",
  },
  {
    icon: Users,
    title: "Für kleine Familien",
    text: "4 Schlafplätze, Verankerungspunkte für Kindersitze und genug Stauraum für alles, was die Kleinen brauchen. Familienurlaub, der flexibel bleibt.",
  },
  {
    icon: MapPin,
    title: "Für Roadtrips ab Berlin",
    text: "Direkt aus Berlin Buchholz losfahren – ob an die Ostsee, in die Sächsische Schweiz oder durch Brandenburg. Dein Roadtrip startet vor der Haustür.",
  },
  {
    icon: Dog,
    title: "Für Reisen mit Hund",
    text: "Dein Vierbeiner ist willkommen. Der Camper bietet genug Platz, und du bist maximal flexibel bei der Wahl deiner Stellplätze.",
  },
  {
    icon: Compass,
    title: "Für Einsteiger",
    text: "Noch nie ein Wohnmobil gefahren? Kein Problem. Du bekommst eine persönliche Einweisung und Erklärvideos für alle wichtigen Funktionen.",
  },
  {
    icon: Globe,
    title: "Für Reisen ins Ausland",
    text: "Auslandsfahrten sind erlaubt. Entdecke Europa – von der Toskana bis nach Skandinavien, ganz in deinem Tempo.",
  },
];

const TargetGroupSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Für wen ist der Camper ideal?
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Ob Pärchen, Familie oder Solo-Abenteurer – unser Wohnmobil in Berlin passt sich deinem Reisestil an.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.title} className="flex gap-4 p-5 rounded-lg hover:bg-card transition-colors duration-200">
              <g.icon className="h-7 w-7 text-petrol shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-lg mb-1">{g.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
