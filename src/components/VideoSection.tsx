import { Play } from "lucide-react";

const videoTopics = [
  { title: "Kühlschrank", emoji: "❄️" },
  { title: "Markise", emoji: "☂️" },
  { title: "Stellplatz aufbauen", emoji: "🏕️" },
  { title: "Herd", emoji: "🔥" },
  { title: "Heizung", emoji: "🌡️" },
  { title: "Strom & Wasser", emoji: "⚡" },
  { title: "Grauwasser & Toilette", emoji: "🚿" },
  { title: "Vorzelt", emoji: "⛺" },
];

const VideoSection = () => {
  return (
    <section className="section-padding gradient-dark text-primary-foreground">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-light">Video-Guides</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Erklärvideos für deine erste Reise
          </h2>
          <p className="opacity-60 leading-relaxed">
            Damit du dich unterwegs sicher fühlst – einfach per Smartphone abrufbar.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {videoTopics.map((topic) => (
            <div
              key={topic.title}
              className="group bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-5 border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-amber/30 transition-all duration-300 cursor-pointer"
            >
              <div className="text-2xl mb-3">{topic.emoji}</div>
              <p className="text-sm font-medium opacity-90 mb-3">{topic.title}</p>
              <div className="h-8 w-8 rounded-full bg-amber/20 flex items-center justify-center group-hover:bg-amber/40 transition-colors">
                <Play className="h-3.5 w-3.5 text-amber-light ml-0.5" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm opacity-40 mt-10 max-w-xl mx-auto">
          Die Videos erhältst du vor deiner Reise – für optimale Vorbereitung.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
