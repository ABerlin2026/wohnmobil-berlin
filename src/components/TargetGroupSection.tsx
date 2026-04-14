import { Heart, Users, MapPin, Dog, Compass, Globe } from "lucide-react";

const groups = [
  { icon: Heart, title: "Für Paare", text: "Zu zweit die schönsten Ecken entdecken – romantische Abende unter der Markise inklusive.", color: "bg-rose-50 text-rose-500" },
  { icon: Users, title: "Für kleine Familien", text: "4 Schlafplätze, Kindersitz-Verankerungen, Stauraum für alles.", color: "bg-blue-50 text-blue-500" },
  { icon: MapPin, title: "Für Roadtrips ab Berlin", text: "Direkt aus Berlin Buchholz – Ostsee, Sächsische Schweiz oder Brandenburg.", color: "bg-amber-50 text-amber" },
  { icon: Dog, title: "Für Reisen mit Hund", text: "Dein Vierbeiner ist willkommen – maximale Flexibilität bei Stellplätzen.", color: "bg-emerald-50 text-emerald-500" },
  { icon: Compass, title: "Für Einsteiger", text: "Persönliche Einweisung und Erklärvideos – ohne Vorkenntnisse starten.", color: "bg-violet-50 text-violet-500" },
  { icon: Globe, title: "Für Reisen ins Ausland", text: "Auslandsfahrten erlaubt – Europa in deinem Tempo.", color: "bg-cyan-50 text-cyan-500" },
];

const TargetGroupSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber">Perfekt für dich</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Für wen ist der Camper ideal?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ob Pärchen, Familie oder Solo-Abenteurer – unser Wohnmobil in Berlin passt sich deinem Reisestil an.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g) => (
            <div
              key={g.title}
              className="group bg-popover rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${g.color} group-hover:scale-110 transition-transform duration-300`}>
                <g.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-base mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
