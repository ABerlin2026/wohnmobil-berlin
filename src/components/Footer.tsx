import { MapPin } from "lucide-react";

const Footer = () => (
  <footer className="gradient-dark text-primary-foreground/50 py-12 px-5">
    <div className="container-narrow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 gradient-amber rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-primary-foreground">Camper Berlin Brandenburg</span>
        </div>
        <p className="text-sm">Abholung: 13127 Berlin Buchholz</p>
        <p className="text-sm">© {new Date().getFullYear()} Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
