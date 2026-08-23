import { PropsWithChildren, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileArchive,
  Gauge,
  LogOut,
  Menu,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/admin/TenantContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-camper-berlin.png";

const links = [
  { to: "/admin", label: "Übersicht", icon: Gauge },
  { to: "/admin/mietvertraege", label: "Mietverträge", icon: FileArchive },
  { to: "/admin/mietvertrag/neu", label: "Neuer Mietvertrag", icon: ClipboardCheck },
  { to: "/admin/kalender", label: "Belegungskalender", icon: CalendarDays },
  { to: "/admin/kunden", label: "Kunden", icon: Users },
  { to: "/admin/fahrzeuge", label: "Fahrzeuge", icon: CarFront },
  { to: "/admin/inventar", label: "Inventarliste", icon: Package },
  { to: "/admin/mandant", label: "Mandantendaten", icon: Settings },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

const AdminShell = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { tenant, tenants, isPlatformAdmin, switchTenant, role } = useTenant();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const nav = (mini = false) => (
    <nav className="flex-1 space-y-1 p-3">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/admin"}
          onClick={() => setOpen(false)}
          title={mini ? label : undefined}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              mini && "justify-center px-0",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!mini && <span className="truncate">{label}</span>}
        </NavLink>
      ))}
    </nav>
  );

  const footer = (mini = false) => (
    <div className="border-t border-border p-3">
      {mini ? (
        <div className="flex justify-center py-2 text-primary" title={tenant?.name ?? "—"}>
          <Building2 className="h-4 w-4" />
        </div>
      ) : (
        <div className="mb-3 rounded-xl bg-secondary p-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">Aktiver Mandant</span>
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
      )}
      <button
        onClick={signOut}
        title={mini ? "Abmelden" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground",
          mini && "justify-center px-0",
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!mini && "Abmelden"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          <Link to="/admin" className="flex min-w-0 items-center gap-2 font-semibold">
            <img src={logo} alt="" className="h-9 w-auto shrink-0" />
            <span className="truncate">Vermietung</span>
          </Link>
          <button
            onClick={() => setOpen((value) => !value)}
            className="shrink-0 rounded-lg border border-border p-2"
            aria-label="Menü"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border bg-card">
            {nav()}
            {footer()}
          </div>
        )}
      </header>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-card transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-20 items-center border-b border-border",
            collapsed ? "justify-center px-2" : "gap-3 px-4",
          )}
        >
          <Link to="/admin" className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="Wohnmobil Berlin"
              className="h-10 w-auto shrink-0 rounded bg-background p-1"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight">Wohnmobil Berlin</p>
                <p className="truncate text-xs text-muted-foreground">Vermieter-Backend</p>
              </div>
            )}
          </Link>
        </div>

        <button
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Menü ausklappen" : "Menü einklappen"}
          className={cn(
            "mx-3 mt-3 flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              Menü einklappen
            </>
          )}
        </button>

        {nav(collapsed)}
        {footer(collapsed)}
      </aside>

      <main
        className={cn(
          "px-4 py-8 transition-all duration-300 lg:px-10",
          collapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
};

export default AdminShell;
