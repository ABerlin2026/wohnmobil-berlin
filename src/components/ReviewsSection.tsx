import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const ReviewsSection = () => {
  const { t } = useLanguage();
  const reviews = t.reviews.items;
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id="bewertungen" className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t.reviews.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {t.reviews.title}
          </h2>

          <div className="inline-flex items-center gap-3 bg-surface-2 rounded-full px-5 py-2 border border-border/20">
            <div className="flex" aria-label={`${avg.toFixed(1)} ${t.reviews.outOf} 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={
                    i <= Math.round(avg)
                      ? "h-4 w-4 fill-primary text-primary"
                      : "h-4 w-4 text-muted-foreground/70"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {avg.toFixed(1)} / 5
            </span>
            <span className="text-xs text-muted-foreground">
              · {reviews.length} {t.reviews.reviewsCount}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="bg-surface-2 rounded-xl p-6 border border-border/20 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex" aria-label={`${r.rating} ${t.reviews.outOf} 5`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={
                        s <= r.rating
                          ? "h-3.5 w-3.5 fill-primary text-primary"
                          : "h-3.5 w-3.5 text-muted-foreground/70"
                      }
                    />
                  ))}
                </div>
                <Quote className="h-4 w-4 text-primary/40" />
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed mb-5 flex-1">
                „{r.text}"
              </p>
              <div className="pt-4 border-t border-border/10">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.context}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          {t.reviews.disclaimer}
        </p>
      </div>
    </section>
  );
};

export default ReviewsSection;
