import { PropsWithChildren, ReactNode } from "react";
import { RENTAL_STATUS } from "@/admin/constants";

export const PageHeader = ({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
      <h1 className="text-3xl font-display font-bold">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-left text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </header>
);

export const Panel = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => (
  <section className={`rounded-2xl border border-border bg-card p-4 sm:p-6 ${className}`}>
    {children}
  </section>
);

export const Field = ({
  label,
  hint,
  error,
  children,
  className = "",
}: PropsWithChildren<{ label: string; hint?: string; error?: string | null; className?: string }>) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-sm font-medium">{label}</span>
    {children}
    {error ? (
      <span role="alert" className="mt-1 block text-xs font-medium text-destructive">
        {error}
      </span>
    ) : (
      hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
    )}
  </label>
);


export const inputClass =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export const StatusBadge = ({ status }: { status: string }) => {
  const tone =
    status === "completed"
      ? "bg-primary/15 text-primary"
      : status === "cancelled"
        ? "bg-muted text-muted-foreground"
        : status === "overdue" || status === "damage_review"
          ? "bg-destructive/15 text-destructive"
          : "bg-secondary text-secondary-foreground";
  return (
    <span className={`w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {RENTAL_STATUS[status] ?? status}
    </span>
  );
};

export const EmptyState = ({ title, text }: { title: string; text?: string }) => (
  <div className="rounded-2xl border border-dashed border-border p-10 text-center">
    <h2 className="font-semibold">{title}</h2>
    {text && <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{text}</p>}
  </div>
);

export const primaryButton =
  "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60";
export const secondaryButton =
  "inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-secondary disabled:opacity-60";
