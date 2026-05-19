import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { travelPosts, type ContentBlock } from "@/content/travelTips";

const PREVIEW_BLOCKS = 3;

const renderBlock = (block: ContentBlock, idx: number) => {
  switch (block.type) {
    case "h2":
      return (
        <h3 key={idx} className="text-xl md:text-2xl font-display font-bold mt-8 mb-3">
          {block.text}
        </h3>
      );
    case "h3":
      return (
        <h4 key={idx} className="text-lg md:text-xl font-display font-semibold mt-5 mb-2">
          {block.text}
        </h4>
      );
    case "p":
      return (
        <p key={idx} className="text-base leading-relaxed text-foreground/90 mb-4">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="list-disc pl-6 space-y-2 mb-5 text-foreground/90">
          {block.items.map((it, i) => (
            <li key={i} className="leading-relaxed">{it}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={idx}
          className="border-l-4 border-primary pl-5 py-2 my-6 italic text-base text-foreground/80"
          style={{ textAlign: "left" }}
        >
          {block.text}
        </blockquote>
      );
  }
};

const Reisetipps = () => {
  const { language, t } = useLanguage();
  const isDE = language === "de";
  const homeLabel = isDE ? "Startseite" : "Home";
  const ui = t.travelTips;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (slug: string) => {
    setExpanded((p) => ({ ...p, [slug]: !p[slug] }));
  };

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
        <section className="pt-32 pb-10 md:pt-40 md:pb-12 bg-background px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {ui.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-5">
              {ui.indexH1}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {ui.indexIntro}
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto space-y-10">
            {travelPosts.map((post) => {
              const loc = isDE ? post.de : post.en;
              const isOpen = !!expanded[post.slug];
              const preview = loc.content.slice(0, PREVIEW_BLOCKS);
              const rest = loc.content.slice(PREVIEW_BLOCKS);

              return (
                <article
                  key={post.slug}
                  className="rounded-2xl overflow-hidden bg-card border border-border"
                >
                  <Link to={`/reisetipps/${post.slug}`} className="block group">
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt={loc.imgAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={1200}
                        height={675}
                      />
                    </div>
                  </Link>

                  <div className="p-5 sm:p-8">
                    <p className="text-xs text-muted-foreground mb-2">{loc.readingTime}</p>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold leading-snug mb-4">
                      <Link
                        to={`/reisetipps/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {loc.title}
                      </Link>
                    </h2>
                    <p className="text-base text-foreground/80 leading-relaxed mb-6" style={{ textAlign: "left" }}>
                      {loc.excerpt}
                    </p>

                    <div className="prose-content">
                      {preview.map(renderBlock)}
                      {isOpen && rest.map((b, i) => renderBlock(b, i + PREVIEW_BLOCKS))}
                    </div>

                    {rest.length > 0 && (
                      <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => toggle(post.slug)}
                          className="gap-2"
                        >
                          {isOpen ? ui.collapse : ui.readMore}
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" asChild className="gap-2">
                          <Link to={`/reisetipps/${post.slug}`}>
                            {ui.eyebrow} →
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
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
