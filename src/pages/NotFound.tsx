import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageSEO from "@/components/PageSEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <PageSEO
        title="Seite nicht gefunden – Wohnmobil Berlin"
        description="Die angeforderte Seite existiert nicht. Zurück zur Startseite von Wohnmobil Berlin."
        canonical="https://wohnmobil-berlin.de/"
        noindex
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404 – Seite nicht gefunden</h1>
        <p className="mb-4 text-xl text-muted-foreground">Diese Seite existiert leider nicht.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Zurück zur Startseite
        </a>
      </div>
    </div>
  );
};

export default NotFound;
