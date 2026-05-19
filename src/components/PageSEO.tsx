import { useEffect } from "react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface PageSEOProps {
  title: string;
  description: string;
  canonical: string;
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

const SCHEMA_ID = "page-seo-jsonld";
const ROBOTS_ID = "page-seo-robots";
const CANONICAL_ID = "page-seo-canonical";

const upsertMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertMetaProperty = (property: string, content: string): string => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  const previous = el?.getAttribute("content") ?? "";
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return previous;
};

const PageSEO = ({ title, description, canonical, breadcrumbs, noindex }: PageSEOProps) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDesc = descEl?.getAttribute("content") ?? "";
    upsertMeta("description", description);

    // Canonical
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonicalEl?.getAttribute("href") ?? "";
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      canonicalEl.id = CANONICAL_ID;
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonical);

    // Open Graph + Twitter — unique per route
    const previousOgTitle = upsertMetaProperty("og:title", title);
    const previousOgDesc = upsertMetaProperty("og:description", description);
    const previousOgUrl = upsertMetaProperty("og:url", canonical);

    const twTitleEl = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const previousTwTitle = twTitleEl?.getAttribute("content") ?? "";
    upsertMeta("twitter:title", title);

    const twDescEl = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    const previousTwDesc = twDescEl?.getAttribute("content") ?? "";
    upsertMeta("twitter:description", description);

    // Robots (for noindex pages like legal)
    if (noindex) {
      let robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (!robotsEl) {
        robotsEl = document.createElement("meta");
        robotsEl.setAttribute("name", "robots");
        robotsEl.id = ROBOTS_ID;
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute("content", "noindex, follow");
    }

    // Breadcrumb JSON-LD
    let scriptEl: HTMLScriptElement | null = null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.id = SCHEMA_ID;
      scriptEl.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      });
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = previousTitle;
      if (previousDesc) upsertMeta("description", previousDesc);
      if (previousCanonical && canonicalEl) canonicalEl.setAttribute("href", previousCanonical);
      if (previousOgTitle) upsertMetaProperty("og:title", previousOgTitle);
      if (previousOgDesc) upsertMetaProperty("og:description", previousOgDesc);
      if (previousOgUrl) upsertMetaProperty("og:url", previousOgUrl);
      if (previousTwTitle) upsertMeta("twitter:title", previousTwTitle);
      if (previousTwDesc) upsertMeta("twitter:description", previousTwDesc);
      if (noindex) {
        const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
        robotsEl?.setAttribute(
          "content",
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        );
      }
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
    };
  }, [title, description, canonical, breadcrumbs, noindex]);

  return null;
};

export default PageSEO;
