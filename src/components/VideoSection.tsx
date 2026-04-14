import { Play } from "lucide-react";

const videoTopics = [
  "Kühlschrank",
  "Markise",
  "Stellplatz aufbauen",
  "Herd",
  "Heizung",
  "Strom & Wasser",
  "Grauwasser & Toilette",
  "Vorzelt",
];

const VideoSection = () => {
  return (
    <section className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Video-Guides</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
            Erklärvideos für deine erste Reise
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Damit du dich unterwegs sicher fühlst – einfach per Smartphone abrufbar.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {videoTopics.map((topic) => (
            <div
              key={topic}
              className="group bg-surface-2 hover:bg-surface-3 rounded-lg p-5 border border-border/20 transition-all duration-300 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Play className="h-3.5 w-3.5 text-primary ml-0.5" />
              </div>
              <p className="text-sm font-medium text-foreground">{topic}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Die Videos erhältst du vor deiner Reise.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
