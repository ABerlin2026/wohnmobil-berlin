import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/i18n/LanguageContext";

const FAQSection = () => {
  const { t } = useLanguage();

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-narrow max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.faq.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">{t.faq.title}</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {t.faq.items.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-surface-1 rounded-lg border border-border/20 px-6"
            >
              <AccordionTrigger className="text-left text-sm font-semibold py-5 hover:no-underline font-display text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
