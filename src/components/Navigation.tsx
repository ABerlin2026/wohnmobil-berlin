import { useState, useEffect } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Vorteile", href: "#vorteile" },
  { label: "Preise", href: "#preise" },
  { label: "Ausstattung", href: "#ausstattung" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container-narrow flex items-center justify-between h-16 md:h-18 px-5">
        <a href="#" className="flex items-center gap-2">
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
            scrolled ? "gradient-amber" : "bg-primary-foreground/20 backdrop-blur-sm"
          )}>
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className={cn(
            "font-display text-base font-bold transition-colors",
            scrolled ? "text-foreground" : "text-primary-foreground"
          )}>
            Camper Berlin
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className={cn(
                "text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200",
                scrolled
                  ? "text-foreground/60 hover:text-foreground hover:bg-secondary"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              {l.label}
            </button>
          ))}
          <Button
            variant={scrolled ? "default" : "hero"}
            size="sm"
            onClick={() => handleClick("#kontakt")}
            className="ml-2"
          >
            Anfragen
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <X className={cn("h-6 w-6", scrolled ? "text-foreground" : "text-primary-foreground")} />
          ) : (
            <Menu className={cn("h-6 w-6", scrolled ? "text-foreground" : "text-primary-foreground")} />
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 p-5 space-y-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className="block w-full text-left text-sm font-medium py-3 px-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
            >
              {l.label}
            </button>
          ))}
          <Button variant="default" className="w-full mt-3" onClick={() => handleClick("#kontakt")}>
            Jetzt anfragen
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
