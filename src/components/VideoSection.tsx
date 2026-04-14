import { Play } from "lucide-react";

const videoTopics = [
  "Wie funktioniert der Kühlschrank?",
  "Wie funktioniert die Markise?",
  "Wie baue ich das Fahrzeug am Stellplatz richtig auf?",
  "Wie nutze ich den Herd?",
  "Wie aktiviere ich die Heizung?",
  "Wie funktionieren Strom und Wasser?",
  "Wie entleere ich Grauwasser und Toilette?",
  "Wie nutze ich das Vorzelt?",
];

const VideoSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Erklärvideos für deine erste Camper-Reise
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Viele Mieter fahren zum ersten Mal mit einem Wohnmobil. Damit du dich unterwegs sicher fühlst, stellen wir dir Erklärvideos zu allen wichtigen Funktionen bereit – einfach per Smartphone abrufbar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {videoTopics.map((topic) => (
            <div
              key={topic}
              className="bg-background rounded-lg p-5 border border-border flex items-start gap-3 hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-9 w-9 bg-secondary rounded-full flex items-center justify-center shrink-0">
                <Play className="h-4 w-4 text-petrol ml-0.5" />
              </div>
              <p className="text-sm font-medium leading-snug">{topic}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
          Die Videos erhältst du vor deiner Reise – so kannst du dich optimal vorbereiten und jede Funktion stressfrei nutzen.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
