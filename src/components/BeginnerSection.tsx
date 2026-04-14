import { HandHelping, BookOpen, Video, SmilePlus } from "lucide-react";

const points = [
  { icon: HandHelping, title: "Persönliche Einweisung", text: "Bei der Übergabe zeigen wir dir alles in Ruhe." },
  { icon: BookOpen, title: "Einfache Bedienung", text: "Alle Funktionen sind intuitiv – keine Vorkenntnisse nötig." },
  { icon: Video, title: "Erklärvideos für unterwegs", text: "Unsere Videos erklären jeden Handgriff per Smartphone." },
  { icon: SmilePlus, title: "Entspannt losfahren", text: "Führerschein B, Rückfahrkamera, Tempomat und Navi." },
];

const BeginnerSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Für Einsteiger</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
            Zum ersten Mal einen Camper mieten?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Viele unserer Mieter in Berlin starten ohne Camper-Erfahrung – und kommen begeistert zurück.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-border/20 rounded-xl overflow-hidden max-w-4xl mx-auto">
          {points.map((p) => (
            <div key={p.title} className="bg-background p-8 group">
              <p.icon className="h-5 w-5 text-primary mb-4 group-hover:text-loxone-light transition-colors" />
              <h3 className="font-display font-semibold text-sm mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeginnerSection;
