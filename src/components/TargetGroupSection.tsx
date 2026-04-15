import { Heart, Users, MapPin, Dog, Compass, Globe } from "lucide-react";

const groups = [
  { icon: Heart, title: "Für Paare", text: "Zu zweit die schönsten Ecken entdecken – romantische Abende unter der Markise inklusive." },
  { icon: Users, title: "Für kleine Familien", text: "4 Schlafplätze, Kindersitz-Verankerungen und genug Stauraum." },
  { icon: MapPin, title: "Für Roadtrips ab Berlin", text: "Direkt aus Berlin – Ostsee, Sächsische Schweiz oder Brandenburg." },
  { icon: Dog, title: "Für Reisen mit Hund", text: "Dein Vierbeiner ist willkommen – maximale Flexibilität bei Stellplätzen." },
  { icon: Compass, title: "Für Einsteiger", text: "Persönliche Einweisung und Erklärvideos – ohne Vorkenntnisse starten." },
  { icon: Globe, title: "Für Reisen ins Ausland", text: "Auslandsfahrten erlaubt – Europa in deinem Tempo." },
];

const TargetGroupSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Perfekt für dich</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Für wen ist der Camper ideal?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {groups.map((g) => (
            <div key={g.title} className="group p-6">
              <g.icon className="h-5 w-5 text-primary mb-4 group-hover:text-loxone-light transition-colors" />
              <h3 className="font-display font-semibold text-foreground text-sm mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
