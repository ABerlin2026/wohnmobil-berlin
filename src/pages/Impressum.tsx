import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { LegalRenderer } from "@/components/LegalRenderer";
import { useLanguage } from "@/i18n/LanguageContext";
import { legalContent } from "@/i18n/legalContent";

const Impressum = () => {
  const { language } = useLanguage();
  const doc = legalContent[language].impressum;
  const breadcrumbHome = language === "de" ? "Startseite" : "Home";
  const breadcrumbName = language === "de" ? "Impressum" : "Legal Notice";

  return (
    <>
      <PageSEO
        title={doc.metaTitle}
        description={doc.metaDescription}
        canonical="https://camper-berlin-brandenburg.de/impressum"
        noindex
        breadcrumbs={[
          { name: breadcrumbHome, url: "https://camper-berlin-brandenburg.de/" },
          { name: breadcrumbName, url: "https://camper-berlin-brandenburg.de/impressum" },
        ]}
      />
      <Navigation />
      <main className="section-padding bg-background min-h-screen pt-32">
        <div className="container-narrow max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-10">{doc.pageTitle}</h1>
          <div className="space-y-4 text-sm leading-relaxed">
            <LegalRenderer nodes={doc.nodes} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Impressum;
