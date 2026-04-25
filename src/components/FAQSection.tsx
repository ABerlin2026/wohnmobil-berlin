import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FAQSection = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return t.faq.items.map((item, i) => ({ ...item, originalIndex: i }));
    return t.faq.items
      .map((item, i) => ({ ...item, originalIndex: i }))
      .filter(
        (item) =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
      );
  }, [query, t.faq.items]);

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-narrow max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t.faq.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {t.faq.title}
          </h2>
          <Button
            variant="outline"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="faq-panel"
            className="gap-2"
          >
            {open ? t.faq.hideButton : t.faq.showButton}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {open && (
          <div id="faq-panel" className="animate-fade-in-up">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.faq.searchPlaceholder}
                className="pl-10 bg-surface-1"
                aria-label={t.faq.searchPlaceholder}
              />
            </div>

            {filteredItems.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                {t.faq.noResults}
              </p>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {filteredItems.map((faq) => (
                  <AccordionItem
                    key={faq.originalIndex}
                    value={`faq-${faq.originalIndex}`}
                    className="bg-surface-1 rounded-lg border border-border/20 px-6"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold py-5 hover:no-underline font-display text-foreground">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 whitespace-pre-line">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
