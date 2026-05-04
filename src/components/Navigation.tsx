import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/i18n/LanguageContext";
import { scrollToContactName } from "@/lib/scrollToContact";

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: t.nav.advantages, href: "#vorteile" },
    { label: t.nav.pricing, href: "#preise" },
    { label: t.nav.equipment, href: "#ausstattung" },
    { label: t.nav.faq, href: "#faq" },
    { label: t.nav.contact, href: "#kontakt" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    const isContact = href === "#kontakt";
    const scroll = () => {
      if (isContact) {
        scrollToContactName();
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    if (location.pathname !== "/") {
      navigate("/" + href);
      setTimeout(scroll, 100);
      return;
    }
    scroll();
  };

  const toggleLang = () => {
    setLanguage(language === "de" ? "en" : "de");
  };

  return (
    <nav
      aria-label="Hauptnavigation"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50"
          : "bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-[2px]"
      )}
    >
      <div className="container-narrow flex items-center justify-between h-16 px-5">
        <a href="/" className="flex flex-col leading-none" aria-label="Wohnmobil Berlin – Startseite">
          <span className={cn(
            "font-display font-extrabold tracking-tight text-base sm:text-lg md:text-xl",
            !scrolled && "[text-shadow:_0_2px_8px_rgba(0,0,0,0.85)]"
          )}>
            <span className="text-brand-blue" style={!scrolled ? { color: "hsl(205 67% 55%)" } : undefined}>WOHNMOBIL</span>{" "}
            <span className={scrolled ? "text-brand-green" : "text-brand-green-light"} style={!scrolled ? { color: "hsl(105 60% 65%)" } : undefined}>BERLIN</span>
          </span>
          <span className={cn(
            "hidden sm:block text-[10px] md:text-xs font-medium mt-0.5 tracking-wide",
            scrolled ? "text-brand-subtitle" : "text-white/90 [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]"
          )}>
            {t.nav.tagline}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => { e.preventDefault(); handleClick(l.href); }}
              className={cn(
                "text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200",
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/95 hover:text-white [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]"
              )}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className={cn(
              "ml-2 px-2.5 py-1.5 rounded-md text-xs font-bold uppercase transition-colors border",
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-surface-1 border-border/30"
                : "text-white hover:bg-white/10 border-white/40 [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]"
            )}
          >
            {language === "de" ? "EN" : "DE"}
          </button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleClick("#kontakt")}
            className="ml-2"
          >
            {t.nav.inquire}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLang}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-xs font-bold uppercase border",
              scrolled
                ? "text-muted-foreground hover:text-foreground border-border/30"
                : "text-white border-white/40 [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]"
            )}
          >
            {language === "de" ? "EN" : "DE"}
          </button>
          <button
            className={scrolled ? "text-foreground" : "text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.8))]"}
            onClick={() => setOpen(!open)}
            aria-label={t.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 p-5 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => { e.preventDefault(); handleClick(l.href); }}
              className="block w-full text-left text-sm font-medium py-3 px-3 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Button variant="default" className="w-full mt-3" onClick={() => handleClick("#kontakt")}>
            {t.nav.inquireNow}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
