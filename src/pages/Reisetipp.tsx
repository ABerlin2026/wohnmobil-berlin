import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { getPostBySlug, travelPosts, type ContentBlock } from "@/content/travelTips";
import { scrollToContactName } from "@/lib/scrollToContact";

const renderBlock = (block: ContentBlock, idx: number) => {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={idx} className="text-2xl md:text-3xl font-display font-bold mt-10 mb-4">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={idx} className="text-xl md:text-2xl font-display font-semibold mt-6 mb-3">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="text-base md:text-lg leading-relaxed text-foreground/90 mb-4">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="list-disc pl-6 space-y-2 mb-6 text-foreground/90">
          {block.items.map((it, i) => (
            <li key={i} className="leading-relaxed">{it}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={idx}
          className="border-l-4 border-primary pl-5 py-2 my-8 italic text-lg text-foreground/80"
          style={{ textAlign: "left" }}
        >
          {block.text}
        </blockquote>
      );
  }
};

const Reisetipp = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isDE = language === "de";
  const ui = t.travelTips;
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) navigate("/reisetipps", { replace: true });
  }, [post, navigate]);

  if (!post) return null;

  const loc = isDE ? post.de : post.en;
  const homeLabel = isDE ? "Startseite" : "Home";
  const canonical = `https://wohnmobil-berlin.de/reisetipps/${post.slug}`;

  // Article JSON-LD
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: loc.title,
      description: loc.metaDescription,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: { "@type": "Organization", name: "Wohnmobil Berlin" },
      publisher: {
        "@type": "Organization",
        name: "Wohnmobil Berlin",
      },
      mainEntityOfPage: canonical,
      inLanguage: isDE ? "de-DE" : "en-US",
    });
    document.head.appendChild(script);
    return () => {
      script.parentNode?.removeChild(script);
    };
  }, [loc.title, loc.metaDescription, post.publishedAt, canonical, isDE]);

  const related = travelPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <PageSEO
        title={loc.metaTitle}
        description={loc.metaDescription}
        canonical={canonical}
        breadcrumbs={[
          { name: homeLabel, url: "https://wohnmobil-berlin.de/" },
          { name: ui.breadcrumb, url: "https://wohnmobil-berlin.de/reisetipps" },
          { name: loc.title, url: canonical },
        ]}
      />
      <Navigation />
      <main>
        <article className="pt-28 md:pt-36 pb-16 px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground">{homeLabel}</Link>
              {" / "}
              <Link to="/reisetipps" className="hover:text-foreground">{ui.breadcrumb}</Link>
            </nav>

            <p className="text-xs text-muted-foreground mb-3">{loc.readingTime}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-6 break-words">
              {loc.title}
            </h1>

            <div className="rounded-2xl overflow-hidden mb-8 shadow-elegant">
              <img
                src={post.image}
                alt={loc.imgAlt}
                className="w-full h-auto object-cover"
                width={1200}
                height={750}
                loading="eager"
              />
            </div>

            <div className="prose-content">
              {loc.content.map(renderBlock)}
            </div>

            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
              <h3 className="font-display font-bold text-xl mb-3">{ui.ctaTitle}</h3>
              <p className="text-muted-foreground mb-5 max-w-xl mx-auto" style={{ textAlign: "center" }}>
                {ui.ctaText}
              </p>
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    scrollToContactName();
                  } else {
                    navigate("/#kontakt");
                    setTimeout(scrollToContactName, 150);
                  }
                }}
                className="px-6 sm:px-10 py-6 max-w-full whitespace-normal h-auto"
              >
                {ui.ctaButton}
              </Button>
            </div>

            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-display font-bold mb-6">{ui.related}</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {related.map((r) => {
                    const rl = isDE ? r.de : r.en;
                    return (
                      <Link
                        key={r.slug}
                        to={`/reisetipps/${r.slug}`}
                        className="group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-muted">
                          <img
                            src={r.image}
                            alt={rl.imgAlt}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-display font-semibold leading-snug group-hover:text-primary transition-colors">
                            {rl.title}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default Reisetipp;
