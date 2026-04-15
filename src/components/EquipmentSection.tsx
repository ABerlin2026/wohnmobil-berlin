import { BedDouble, CookingPot, Bath, Monitor, Car, Tent, ShieldCheck, Wind, Thermometer } from "lucide-react";
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
      "Fahrer- und Beifahrersitz drehbar – besserer Zugang zum Esstisch",
    ],
  },
  {
    icon: CookingPot,
    title: "Küche",
    items: [
      "Gasherd mit mehreren Flammen",
      "Kühlschrank mit integriertem Eisfach",
      "Kaffeemaschine – morgens frischen Kaffee genießen",
    ],
  },
  {
    icon: Bath,
    title: "Bad",
    items: ["Dusche an Bord", "Toilette (Kassettentoilette)"],
  },
  {
    icon: Monitor,
    title: "Technik",
    items: [
      "TV mit SAT-Anlage",
      "Audio-System mit Bluetooth, CD, DVD, MP3 & USB",
      "Navigationsgerät",
    ],
  },
  {
    icon: Thermometer,
    title: "Klima & Belüftung",
    items: [
      "Klimaanlage im Fahrerbereich (serienmäßig)",
      "Zusätzliche Klimaanlage im Wohn- und Schlafbereich",
      "Klimaanlage im Wohnbereich auch als Heizung nutzbar",
      "Gasheizung für kalte Tage",
      "Ventilator (MaxxFan) – bläst Luft hinein und hinaus",
      "Sorgt für Luftzirkulation, Temperaturregulierung und Frischluftzufuhr auch ohne Klimaanlage",
      "Autarkes Campen ohne Strom möglich",
    ],
  },
  {
    icon: Car,
    title: "Fahrkomfort",
    items: [
      "Rückfahrkamera für sicheres Rangieren",
      "Tempomat für entspannte Langstrecken",
      "Servolenkung",
      "Elektrische Fensterheber",
    ],
  },
  {
    icon: Tent,
    title: "Außenbereich",
    items: [
      "Vorzelt – zusätzlicher Wohnraum bei jedem Wetter",
      "Markise mit LED-Beleuchtung",
      "Auffahrkeile & Kabeltrommel",
      "Stromanschluss für Landanschluss",
      "Wasserkanister",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit",
    items: [
      "Solarzellen für autarke Energieversorgung",
      "Versorgerbatterie",
      "Warmwassertank",
      "Keine ISOFIX-Halterung vorhanden",
      "Feuerlöscher & Feuerlöschdecke",
      "Rauchmelder & Kohlenmonoxid-Detektor",
    ],
  },
];

const EquipmentSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="ausstattung" className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Komplett ausgestattet</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Alles an Bord
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-1 mb-12">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              )}
            >
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.title}</span>
            </button>
          ))}
        </div>

        <div className="bg-surface-2 rounded-xl p-8 border border-border/20 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const Icon = categories[active].icon;
              return <Icon className="h-5 w-5 text-primary" />;
            })()}
            <h3 className="font-display text-lg font-bold">{categories[active].title}</h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {categories[active].items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-secondary-foreground">
                <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
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
