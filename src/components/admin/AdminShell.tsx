import { PropsWithChildren, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  CarFront,
  ClipboardCheck,
  FileArchive,
  Gauge,
  LogOut,
  Menu,
  Package,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/admin/TenantContext";
import logo from "@/assets/logo-camper-berlin.png";

const links = [
  { to: "/admin", label: "Übersicht", icon: Gauge },
  { to: "/admin/mietvertraege", label: "Mietverträge", icon: FileArchive },
  { to: "/admin/mietvertrag/neu", label: "Neuer Mietvertrag", icon: ClipboardCheck },
  { to: "/admin/kalender", label: "Belegungskalender", icon: CalendarDays },
  { to: "/admin/kunden", label: "Kunden", icon: Users },
  { to: "/admin/fahrzeuge", label: "Fahrzeuge", icon: CarFront },
  { to: "/admin/inventar", label: "Inventarliste", icon: Package },
];

const AdminShell = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { tenant, tenants, isPlatformAdmin, switchTenant, role } = useTenant();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const nav = (
    <nav className="flex-1 space-y-1 p-3">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/admin"}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-border p-3">
      <div className="mb-3 rounded-xl bg-secondary p-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary" />
          Aktiver Mandant
        </div>
        {isPlatformAdmin && tenants.length > 1 ? (
          <select
            value={tenant?.id ?? ""}
            onChange={(event) => switchTenant(event.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
          >
            {tenants.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="mt-1 font-medium text-foreground">{tenant?.name ?? "—"}</p>
        )}
        {role && <p className="mt-1 text-xs text-muted-foreground">Rolle: {role}</p>}
      </div>
      <button
        onClick={signOut}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Abmelden
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/admin" className="flex items-center gap-2 font-semibold">
            <img src={logo} alt="" className="h-9 w-auto" /> Vermietung
          </Link>
          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-border p-2"
            aria-label="Menü"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border bg-card">
            {nav}
            {footer}
          </div>
        )}
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <Link to="/admin" className="flex h-20 items-center gap-3 border-b border-border px-6">
          <img src={logo} alt="Wohnmobil Berlin" className="h-11 w-auto rounded bg-background p-1" />
          <div>
            <p className="font-semibold leading-tight">Wohnmobil Berlin</p>
            <p className="text-xs text-muted-foreground">Vermieter-Backend</p>
          </div>
        </Link>
        {nav}
        {footer}
      </aside>

      <main className="px-4 py-8 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
};

export default AdminShell;
