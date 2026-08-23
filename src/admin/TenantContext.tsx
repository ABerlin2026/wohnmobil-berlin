import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_TENANT_SLUG = "wohnmobil-berlin";

export type TenantRole = "tenant_admin" | "employee" | "admin" | "platform_admin" | "customer";

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  default_deposit_cents: number;
  free_km_per_day: number;
  extra_km_price_cents: number;
  payment_methods: string[];
  price_list: { label: string; amount_cents: number }[];
}

interface TenantState {
  loading: boolean;
  session: Session | null;
  tenant: TenantInfo | null;
  role: TenantRole | null;
  isStaff: boolean;
  isPlatformAdmin: boolean;
  tenants: TenantInfo[];
  error: string | null;
  /** First-run helper: claim the default tenant when it has no members yet. */
  claimBootstrap: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
  reload: () => Promise<void>;
}

const TenantContext = createContext<TenantState | null>(null);

const ACTIVE_TENANT_KEY = "admin:activeTenant";

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_TENANT_KEY);
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<TenantRole | null>(null);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (currentSession: Session | null) => {
    if (!currentSession) {
      setTenants([]);
      setRole(null);
      setIsPlatformAdmin(false);
      setLoading(false);
      return;
    }
    setError(null);
    const [{ data: roleRows }, { data: memberRows, error: memberError }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", currentSession.user.id),
      supabase.from("tenant_members").select("tenant_id, role"),
    ]);

    const platform = (roleRows ?? []).some(
      (row) => row.role === "platform_admin" || row.role === "admin",
    );
    setIsPlatformAdmin(platform);

    // RLS already limits tenants to the ones the user may see.
    const { data: tenantRows, error: tenantError } = await supabase
      .from("tenants")
      .select("id, name, slug, default_deposit_cents, free_km_per_day, extra_km_price_cents, payment_methods, price_list")
      .order("name");

    if (memberError || tenantError) {
      setError(memberError?.message ?? tenantError?.message ?? null);
    }

    const list = (tenantRows ?? []) as TenantInfo[];
    setTenants(list);

    setActiveId((current) => {
      if (current && list.some((entry) => entry.id === current)) return current;
      const preferred = list.find((entry) => entry.slug === DEFAULT_TENANT_SLUG) ?? list[0];
      return preferred?.id ?? null;
    });

    const membership = (memberRows ?? []) as { tenant_id: string; role: TenantRole }[];
    setRole(() => {
      const target = activeId ?? list.find((e) => e.slug === DEFAULT_TENANT_SLUG)?.id ?? list[0]?.id;
      const found = membership.find((m) => m.tenant_id === target);
      if (found) return found.role;
      return platform ? "platform_admin" : null;
    });
    setLoading(false);
  }, [activeId]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      void load(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      void load(next);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) return;
    try {
      localStorage.setItem(ACTIVE_TENANT_KEY, activeId);
    } catch {
      // storage may be unavailable
    }
  }, [activeId]);

  const claimBootstrap = useCallback(async () => {
    const { error: rpcError } = await supabase.rpc("claim_tenant_bootstrap", {
      _slug: DEFAULT_TENANT_SLUG,
    });
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    const { data } = await supabase.auth.getSession();
    await load(data.session);
  }, [load]);

  const value = useMemo<TenantState>(() => {
    const tenant = tenants.find((entry) => entry.id === activeId) ?? null;
    return {
      loading,
      session,
      tenant,
      role,
      isStaff: isPlatformAdmin || role === "tenant_admin" || role === "employee" || role === "admin",
      isPlatformAdmin,
      tenants,
      error,
      claimBootstrap,
      switchTenant: setActiveId,
      reload: async () => {
        const { data } = await supabase.auth.getSession();
        await load(data.session);
      },
    };
  }, [loading, session, tenants, activeId, role, isPlatformAdmin, error, claimBootstrap, load]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used inside TenantProvider");
  return ctx;
};
