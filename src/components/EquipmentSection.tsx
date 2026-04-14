import { BedDouble, CookingPot, Bath, Monitor, Car, Tent, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  {
    icon: BedDouble,
    title: "Wohnen & Schlafen",
    emoji: "🛏️",
    items: [
      "4 komfortable Schlafplätze",
      "USB-Lademöglichkeiten an jedem Schlafplatz",
      "Verdunklungsrollos für erholsamen Schlaf",
      "Dachfenster für Licht und Frischluft",
      "Geräumige Schränke für Gepäck",
      "Adapter für externe Stromversorgung",
      "Zentralverriegelung",
    ],
  },
  {
    icon: CookingPot,
    title: "Küche",
    emoji: "🍳",
    items: [
      "Gasherd mit mehreren Flammen",
      "Kühlschrank mit Eisfach",
      "Separater Gefrierschrank",
      "Kaffeemaschine – morgens frischen Kaffee genießen",
    ],
  },
  {
    icon: Bath,
    title: "Bad",
    emoji: "🚿",
    items: ["Dusche an Bord", "Toilette (Kassettentoilette)"],
  },
  {
    icon: Monitor,
    title: "Technik",
    emoji: "📺",
    items: [
      "TV mit SAT-Anlage",
      "Audio-System mit Bluetooth, CD, DVD, MP3 & USB",
      "Navigationsgerät",
    ],
  },
  {
    icon: Car,
    title: "Fahrkomfort",
    emoji: "🚗",
    items: [
      "Rückfahrkamera für sicheres Rangieren",
      "Tempomat für entspannte Langstrecken",
      "Klimaanlage",
      "Servolenkung",
      "Elektrische Fensterheber",
    ],
  },
  {
    icon: Tent,
    title: "Außenbereich",
    emoji: "⛺",
    items: [
      "Vorzelt – zusätzlicher Wohnraum bei jedem Wetter",
      "Markise mit LED-Beleuchtung",
      "Klappbares Sonnendach",
      "Auffahrkeile & Kabeltrommel",
      "Starkstromanschluss für Landstrom",
      "Wasserkanister",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit",
    emoji: "🛡️",
    items: [
      "Solarzellen für autarke Energieversorgung",
      "Versorgerbatterie",
      "Beheizbarer Wasser- und Abwassertank",
      "Verankerungspunkte für Kindersitze",
      "Feuerlöscher & Feuerlöschdecke",
      "Rauchmelder & Kohlenmonoxid-Detektor",
    ],
  },
];

const EquipmentSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="ausstattung" className="section-padding bg-card">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber">Komplett ausgestattet</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Alles an Bord für deinen Trip
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Von der Küche bis zur Sicherheitsausstattung – hier fehlt nichts.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                active === i
                  ? "gradient-amber text-primary-foreground shadow-md shadow-amber/20 scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              <span>{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Active content */}
        <div className="bg-popover rounded-2xl p-8 border border-border/50 max-w-3xl mx-auto shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{categories[active].emoji}</span>
            <h3 className="font-display text-xl font-bold">{categories[active].title}</h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {categories[active].items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full gradient-amber mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
