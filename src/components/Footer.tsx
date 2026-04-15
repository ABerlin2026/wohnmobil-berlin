import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-surface-1 border-t border-border/20 py-10 px-5" role="contentinfo">
    <div className="container-narrow flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
      <span className="font-display font-bold text-foreground tracking-tight">CAMPER BERLIN</span>
      <div className="flex items-center gap-4">
        <Link to="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
        <span>© {new Date().getFullYear()} Camper Berlin Brandenburg. Alle Rechte vorbehalten.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
