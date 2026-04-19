import type { LegalNode } from "@/i18n/legalContent";

/**
 * Renders a flat list of legal content nodes (paragraphs, lists, sections,
 * parts, callouts) defined in `legalContent.ts`. Inline HTML is allowed and
 * controlled by us — the data is static and not user-supplied.
 */
export const LegalRenderer = ({ nodes }: { nodes: LegalNode[] }) => {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.type) {
          case "callout":
            return (
              <p
                key={i}
                className="font-medium text-foreground bg-surface-1 border border-border/30 rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: node.html }}
              />
            );
          case "part":
            return (
              <section key={i} id={node.id} className="space-y-6 scroll-mt-28 pt-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-1">{node.label}</p>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{node.title}</h2>
                </div>
              </section>
            );
          case "section":
            return (
              <h3
                key={i}
                id={node.id}
                className="font-display font-semibold text-foreground text-base md:text-lg scroll-mt-28 pt-2"
              >
                {node.title}
              </h3>
            );
          case "p":
            return (
              <p
                key={i}
                className="text-secondary-foreground"
                dangerouslySetInnerHTML={{ __html: node.html }}
              />
            );
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-1 text-secondary-foreground">
                {node.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          case "footer":
            return (
              <p
                key={i}
                className="pt-6 text-muted-foreground border-t border-border/30"
                dangerouslySetInnerHTML={{ __html: node.html }}
              />
            );
        }
      })}
    </>
  );
};
