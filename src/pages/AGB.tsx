import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { LegalRenderer } from "@/components/LegalRenderer";
import { useLanguage } from "@/i18n/LanguageContext";
import { legalContent, formatAsOf } from "@/i18n/legalContent";

const AGB = () => {
  const { language } = useLanguage();
  const doc = legalContent[language].agb;
  const breadcrumbHome = language === "de" ? "Startseite" : "Home";
  const breadcrumbAgb = language === "de" ? "AGB" : "Terms & Conditions";

  return (
    <>
      <PageSEO
        title={doc.metaTitle}
        description={doc.metaDescription}
        canonical="https://wohnmobil-berlin.de/agb"
        breadcrumbs={[
          { name: breadcrumbHome, url: "https://wohnmobil-berlin.de/" },
          { name: breadcrumbAgb, url: "https://wohnmobil-berlin.de/agb" },
        ]}
      />
      <Navigation />
      <main className="section-padding bg-background min-h-screen pt-32">
        <div className="container-narrow max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{doc.pageTitle}</h1>
          {doc.pageSubtitle && (
            <p className="text-sm text-muted-foreground mb-2">{doc.pageSubtitle}</p>
          )}
          <p className="text-sm text-muted-foreground mb-10">{formatAsOf(language)}</p>

          {doc.toc && (
            <nav
              aria-label={doc.toc.label}
              className="mb-12 bg-surface-1 border border-border/30 rounded-xl p-5 sm:p-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
                {doc.toc.label}
              </p>
              <ol className="space-y-2 text-sm">
                {doc.toc.entries.map((e) => (
                  <li key={e.href}>
                    <a
                      href={e.href}
                      className="text-foreground hover:text-primary transition-colors"
                      dangerouslySetInnerHTML={{ __html: e.html }}
                    />
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="space-y-4 text-sm leading-relaxed">
            <LegalRenderer nodes={doc.nodes} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AGB;
