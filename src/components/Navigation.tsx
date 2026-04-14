import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container-narrow flex items-center justify-between h-16 px-5">
        <a href="#" className="font-display text-base font-bold text-foreground tracking-tight">
          CAMPER BERLIN
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className="text-sm font-medium px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {l.label}
            </button>
          ))}
          <Button
            variant="default"
            size="sm"
            onClick={() => handleClick("#kontakt")}
            className="ml-3"
          >
            Anfragen
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 p-5 space-y-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className="block w-full text-left text-sm font-medium py-3 px-3 rounded-md text-muted-foreground hover:text-foreground transition-colors"
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
