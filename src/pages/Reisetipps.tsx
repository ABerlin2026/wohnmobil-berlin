import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { useLanguage } from "@/i18n/LanguageContext";
import { travelPosts } from "@/content/travelTips";

const Reisetipps = () => {
  const { language, t } = useLanguage();
  const isDE = language === "de";
  const homeLabel = isDE ? "Startseite" : "Home";
  const ui = t.travelTips;

  return (
    <>
      <PageSEO
        title={ui.indexMetaTitle}
        description={ui.indexMetaDescription}
        canonical="https://wohnmobil-berlin.de/reisetipps"
        breadcrumbs={[
          { name: homeLabel, url: "https://wohnmobil-berlin.de/" },
          { name: ui.breadcrumb, url: "https://wohnmobil-berlin.de/reisetipps" },
        ]}
      />
      <Navigation />
      <main>
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-background px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {ui.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-5">
              {ui.indexH1}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {ui.indexIntro}
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {travelPosts.map((post) => {
              const loc = isDE ? post.de : post.en;
              return (
                <Link
                  key={post.slug}
                  to={`/reisetipps/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 hover:shadow-elegant transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={loc.imgAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={800}
                      height={500}
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2">{loc.readingTime}</p>
                    <h2 className="font-display font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                      {loc.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3" style={{ textAlign: "left" }}>
                      {loc.excerpt}
                    </p>
                    <span className="inline-block mt-4 text-sm font-semibold text-primary">
                      {ui.readMore} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Reisetipps;
