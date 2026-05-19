import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-1 border-t border-border/20 py-10 px-5" role="contentinfo">
      <div className="container-narrow flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <span className="font-display font-bold text-foreground tracking-tight">{t.nav.brand}</span>
        <nav aria-label="Footer-Navigation" className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/wohnmobil-brandenburg" className="hover:text-foreground transition-colors">{t.target.brandenburgCta}</Link>
          <Link to="/reisetipps" className="hover:text-foreground transition-colors">{t.travelTips.footerLink}</Link>
          <Link to="/empfehlen" className="hover:text-foreground transition-colors font-medium text-primary">{t.footer.referral}</Link>
          <Link to="/impressum" className="hover:text-foreground transition-colors">{t.footer.imprint}</Link>
          <Link to="/datenschutz" className="hover:text-foreground transition-colors">{t.footer.privacy}</Link>
          <Link to="/agb" className="hover:text-foreground transition-colors">{t.footer.terms}</Link>
          <span>© {new Date().getFullYear()} Wohnmobil Berlin Brandenburg. {t.footer.rights}</span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
