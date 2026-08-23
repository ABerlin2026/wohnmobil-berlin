import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useTenant } from "@/admin/TenantContext";
import PageSEO from "@/components/PageSEO";

/** Blocks every /admin route for visitors without a tenant membership. */
const AdminGuard = ({ children }: PropsWithChildren) => {
  const { loading, session, tenant, isStaff, role, claimBootstrap, error } = useTenant();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!tenant || (!isStaff && role !== "customer")) {
    return (
      <>
        <PageSEO
          title="Zugang wird eingerichtet"
          description="Interner Bereich"
          canonical="https://wohnmobil-berlin.de/admin"
          noindex
        />
        <main className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
            <h1 className="text-xl font-semibold">Kein Zugriff auf einen Mandanten</h1>
            <p className="text-sm text-muted-foreground">
              Dein Konto ist angemeldet, aber noch keinem Mandanten zugeordnet. Ist die Verwaltung
              noch nicht eingerichtet, kannst du dich hier einmalig als Mandanten-Administrator
              eintragen.
            </p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              onClick={() => void claimBootstrap()}
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Verwaltung jetzt einrichten
            </button>
          </div>
        </main>
      </>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
