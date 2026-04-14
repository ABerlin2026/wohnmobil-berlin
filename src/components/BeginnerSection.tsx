import { HandHelping, BookOpen, Video, SmilePlus } from "lucide-react";

const points = [
  { icon: HandHelping, title: "Persönliche Einweisung", text: "Bei der Übergabe zeigen wir dir alles in Ruhe.", emoji: "🤝" },
  { icon: BookOpen, title: "Einfache Bedienung", text: "Alle Funktionen sind intuitiv – keine Vorkenntnisse nötig.", emoji: "📖" },
  { icon: Video, title: "Erklärvideos für unterwegs", text: "Unsere Videos erklären jeden Handgriff per Smartphone.", emoji: "🎬" },
  { icon: SmilePlus, title: "Entspannt losfahren", text: "Führerschein B, Rückfahrkamera, Tempomat und Navi.", emoji: "😊" },
];

const BeginnerSection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 gradient-amber rounded-full blur-3xl opacity-[0.04]" />

      <div className="container-narrow relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber">Für Einsteiger</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Zum ersten Mal einen Camper mieten?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Viele unserer Mieter in Berlin und Brandenburg starten ohne jede Camper-Erfahrung – und kommen begeistert zurück.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((p) => (
            <div key={p.title} className="flex gap-4 bg-popover rounded-2xl p-6 border border-border/50 hover:shadow-md transition-all duration-300">
              <div className="text-3xl shrink-0">{p.emoji}</div>
              <div>
                <h3 className="font-display font-semibold text-base mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeginnerSection;
