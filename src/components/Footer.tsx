const Footer = () => (
  <footer className="bg-surface-1 border-t border-border/20 py-10 px-5">
    <div className="container-narrow flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
      <span className="font-display font-bold text-foreground tracking-tight">CAMPER BERLIN</span>
      <span><span>© {new Date().getFullYear()} Alle Rechte vorbehalten.</span></span>
      <span>© {new Date().getFullYear()} Alle Rechte vorbehalten.</span>
    </div>
  </footer>
);

export default Footer;
