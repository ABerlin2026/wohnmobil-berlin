import { HandHelping, BookOpen, Video, SmilePlus } from "lucide-react";

const points = [
  { icon: HandHelping, title: "Persönliche Einweisung", text: "Bei der Übergabe zeigen wir dir alles in Ruhe – von der Gasanlage bis zur Toilette." },
  { icon: BookOpen, title: "Einfache Bedienung", text: "Alle Funktionen sind intuitiv. Du brauchst keine Vorkenntnisse, um den Camper sicher zu nutzen." },
  { icon: Video, title: "Erklärvideos für unterwegs", text: "Falls du unterwegs etwas nachschauen möchtest – unsere Videos erklären jeden Handgriff." },
  { icon: SmilePlus, title: "Entspannt losfahren", text: "Führerschein Klasse B reicht. Rückfahrkamera, Tempomat und Navi machen das Fahren einfach." },
];

const BeginnerSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Zum ersten Mal einen Camper mieten?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Viele unserer Mieter in Berlin und Brandenburg starten ohne jede Camper-Erfahrung – und kommen begeistert zurück. Wir bereiten dich so vor, dass du dich vom ersten Moment an sicher und wohl fühlst.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {points.map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                <p.icon className="h-6 w-6 text-petrol" />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">{p.title}</h3>
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
