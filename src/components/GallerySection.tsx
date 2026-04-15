import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import exterior1 from "@/assets/gallery/camper-exterior-1.jpg";
import exterior2 from "@/assets/gallery/camper-exterior-2.jpg";
import bedroom from "@/assets/gallery/camper-bedroom.jpg";
import kitchen from "@/assets/gallery/camper-kitchen.jpg";
import kitchen2 from "@/assets/gallery/camper-kitchen-2.jpg";
import dining from "@/assets/gallery/camper-dining.jpg";
import bathroom1 from "@/assets/gallery/camper-bathroom-1.jpg";

import bathroom3 from "@/assets/gallery/camper-bathroom-3.jpg";
import storage from "@/assets/gallery/camper-storage.jpg";

const images = [
  { src: exterior1, alt: "Wohnmobil Außenansicht – Seitenansicht auf grüner Wiese", label: "Außenansicht" },
  { src: exterior2, alt: "Wohnmobil mit Markise, Campingstühlen und Tisch", label: "Mit Markise" },
  { src: bedroom, alt: "Gemütliches Schlafzimmer im Wohnmobil mit Doppelbett", label: "Schlafbereich" },
  { src: kitchen, alt: "Wohnmobil Innenraum mit Küche und Hubbett", label: "Küche & Hubbett" },
  { src: kitchen2, alt: "Küchenbereich mit Spüle und Leiter zum Hubbett", label: "Küchenzeile" },
  { src: dining, alt: "Gemütliche Sitzecke mit Tisch im Wohnmobil", label: "Sitzecke" },
  { src: bathroom1, alt: "Badezimmer mit Toilette und Waschbecken", label: "Bad" },
  
  { src: bathroom3, alt: "Toilette und Waschbecken im kompakten Bad", label: "WC-Bereich" },
  { src: storage, alt: "Großer Stauraum im Heck des Wohnmobils", label: "Stauraum" },
];

const GallerySection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);
  const prevImage = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  const nextImage = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));

  return (
    <section id="galerie" className="py-20 md:py-28 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">Galerie</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Dein Camper in Bildern
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Überzeuge dich selbst – so sieht dein Zuhause auf vier Rädern aus.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => openImage(index)}
              className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                index < 2 ? "col-span-1 md:col-span-1 lg:col-span-2 aspect-[16/10]" : "aspect-square"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                width={600}
                height={400}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                <span className="text-white text-sm font-medium px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={closeImage}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black/95 border-border/20 [&>button]:hidden">
          {selectedIndex !== null && (
            <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh]">
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                className="max-w-full max-h-[85vh] object-contain"
              />
              <button onClick={closeImage} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all">
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
