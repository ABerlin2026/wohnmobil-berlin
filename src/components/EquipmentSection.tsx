import { BedDouble, CookingPot, Bath, Monitor, Car, Tent, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  {
    icon: BedDouble,
    title: "Wohnen & Schlafen",
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
    items: [
      "Gasherd mit mehreren Flammen",
      "Kühlschrank mit Eisfach",
      "Separater Gefrierschrank",
      "Kaffeemaschine – Morgens direkt frischen Kaffee genießen",
    ],
  },
  {
    icon: Bath,
    title: "Bad",
    items: [
      "Dusche an Bord",
      "Toilette (Kassettentoilette)",
    ],
  },
  {
    icon: Monitor,
    title: "Technik & Multimedia",
    items: [
      "TV mit SAT-Anlage",
      "Audio-System mit Bluetooth, CD, DVD, MP3 und USB",
      "Navigationsgerät",
    ],
  },
  {
    icon: Car,
    title: "Fahrkomfort",
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
    title: "Außenbereich & Camping",
    items: [
      "Vorzelt – zusätzlicher Wohnraum bei jedem Wetter",
      "Markise mit LED-Beleuchtung für gemütliche Abende",
      "Klappbares Sonnendach",
      "Auffahrkeile & Kabeltrommel",
      "Starkstromanschluss für Landstrom",
      "Wasserkanister",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Versorgung & Sicherheit",
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
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Ausstattung – alles an Bord für deinen Trip
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Unser Wohnmobil ist komplett ausgestattet. Hier siehst du, was dich erwartet – von der Küche bis zur Sicherheitsausstattung.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                active === i
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Active Category */}
        <div className="bg-background rounded-xl p-8 border border-border max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const Icon = categories[active].icon;
              return <Icon className="h-7 w-7 text-petrol" />;
            })()}
            <h3 className="font-serif text-2xl">{categories[active].title}</h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {categories[active].items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-petrol mt-2 shrink-0" />
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
