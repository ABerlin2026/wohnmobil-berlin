import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";
import { scrollToContactName } from "@/lib/scrollToContact";
import TravelTipsInline from "@/components/TravelTipsInline";

const FinalCTASection = () => {
  const { t } = useLanguage();

  const scrollToContact = () => scrollToContactName();

  return (
    <section className="section-padding bg-primary">
      <div className="container-narrow text-center max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">{t.finalCta.title}</h2>
        <p className="text-lg text-primary-foreground/80 leading-relaxed mb-3">{t.finalCta.subtitle}</p>
        <p className="text-sm text-primary-foreground/50 mb-10">{t.finalCta.urgency}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="hero-outline" size="lg" onClick={scrollToContact} className="py-5 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowRight className="mr-2 h-5 w-5" />
            {t.finalCta.cta}
          </Button>
          <Button variant="whatsapp" size="lg" asChild className="py-5 px-8">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
        </div>

        <TravelTipsInline variant="onPrimary" className="mt-10" />
      </div>
    </section>
  );
};

export default FinalCTASection;
