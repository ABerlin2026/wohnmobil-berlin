const Footer = () => (
  <footer className="bg-petrol-dark text-primary-foreground/70 py-10 px-4">
    <div className="container-narrow flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
      <p className="font-serif text-primary-foreground">Camper Berlin Brandenburg</p>
      <p>Abholung: 13127 Berlin Buchholz</p>
      <p>© {new Date().getFullYear()} Alle Rechte vorbehalten.</p>
    </div>
  </footer>
);

export default Footer;
