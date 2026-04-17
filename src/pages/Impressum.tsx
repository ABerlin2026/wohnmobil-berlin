import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";

const Impressum = () => {
  return (
    <>
      <PageSEO
        title="Impressum | Camper Berlin Brandenburg"
        description="Impressum und Anbieterkennzeichnung gemäß § 5 TMG für Camper Berlin Brandenburg – Wohnmobilvermietung in Berlin."
        canonical="https://camper-berlin-brandenburg.de/impressum"
        noindex
        breadcrumbs={[
          { name: "Startseite", url: "https://camper-berlin-brandenburg.de/" },
          { name: "Impressum", url: "https://camper-berlin-brandenburg.de/impressum" },
        ]}
      />
      <Navigation />
      <main className="section-padding bg-background min-h-screen pt-32">
        <div className="container-narrow max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-10">Impressum</h1>

          <div className="space-y-6 text-sm leading-relaxed text-secondary-foreground">
            <div>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">Angaben gemäß § 5 TMG</h2>
              <p>[Firmenname]</p>
              <p>[Vor- und Nachname]</p>
              <p>[Straße und Hausnummer]</p>
              <p>[PLZ] [Ort]</p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">Kontakt</h2>
              <p>Telefon: [Telefonnummer]</p>
              <p>E-Mail: [E-Mail-Adresse]</p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">Steuernummer</h2>
              <p>[Steuernummer]</p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>[Vor- und Nachname]</p>
              <p>[Straße und Hausnummer]</p>
              <p>[PLZ] [Ort]</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Impressum;
