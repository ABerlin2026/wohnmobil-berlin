import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageSEO from "@/components/PageSEO";

interface ChatbotEvent {
  id: string;
  event_type: "opened" | "message_sent";
  session_id: string | null;
  page_path: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ChatUsageRow {
  usage_date: string;
  request_count: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

const AdminChatbotStats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [events, setEvents] = useState<ChatbotEvent[]>([]);
  const [usage, setUsage] = useState<ChatUsageRow[]>([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionData.session.user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      setAuthorized(true);

      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceIso = since.toISOString();

      const [evRes, usRes] = await Promise.all([
        supabase
          .from("chatbot_events")
          .select("id,event_type,session_id,page_path,user_agent,created_at")
          .gte("created_at", sinceIso)
          .order("created_at", { ascending: false })
          .limit(1000),
        supabase
          .from("chat_usage_daily")
          .select("usage_date,request_count,prompt_tokens,completion_tokens,total_tokens")
          .gte("usage_date", sinceIso.slice(0, 10))
          .order("usage_date", { ascending: false }),
      ]);

      setEvents((evRes.data ?? []) as ChatbotEvent[]);
      setUsage((usRes.data ?? []) as ChatUsageRow[]);
      setLoading(false);
    })();
  }, [navigate, days]);

  const stats = useMemo(() => {
    const opens = events.filter((e) => e.event_type === "opened");
    const sends = events.filter((e) => e.event_type === "message_sent");
    const uniqueSessions = new Set(opens.map((e) => e.session_id).filter(Boolean)).size;
    const conversionRate = opens.length ? (sends.length / opens.length) * 100 : 0;

    const byPath = new Map<string, number>();
    for (const e of opens) {
      const p = e.page_path ?? "?";
      byPath.set(p, (byPath.get(p) ?? 0) + 1);
    }
    const topPages = [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    const totalTokens = usage.reduce((s, u) => s + (u.total_tokens ?? 0), 0);
    const totalRequests = usage.reduce((s, u) => s + (u.request_count ?? 0), 0);
    // Rough cost estimate for gemini-2.5-flash-lite via Lovable AI: ~0.075 USD / 1M input, 0.30 USD / 1M output.
    // We don't split prompt/completion here; use a blended ~0.15 USD / 1M as a rough guide.
    const estimatedUsd = (totalTokens / 1_000_000) * 0.15;

    return { opens: opens.length, sends: sends.length, uniqueSessions, conversionRate, topPages, totalTokens, totalRequests, estimatedUsd };
  }, [events, usage]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (loading) return <main className="p-8 text-muted-foreground">Lädt…</main>;

  if (!authorized) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-foreground">Kein Admin-Zugriff für dieses Konto.</p>
        <button onClick={signOut} className="text-sm underline text-muted-foreground">Abmelden</button>
      </main>
    );
  }

  return (
    <>
      <PageSEO title="Chatbot-Statistiken" description="Interne Auswertung der Chatbot-Nutzung" canonical="https://wohnmobil-berlin.de/admin/chatbot-stats" noindex />
      <main className="min-h-screen bg-background p-4 sm:p-8 space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chatbot-Statistiken</h1>
            <p className="text-sm text-muted-foreground">Letzte {days} Tage</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value={7}>7 Tage</option>
              <option value={30}>30 Tage</option>
              <option value={90}>90 Tage</option>
            </select>
            <button onClick={signOut} className="text-sm text-muted-foreground underline">Abmelden</button>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi label="Öffnungen" value={stats.opens} />
          <Kpi label="Gesendete Nachrichten" value={stats.sends} />
          <Kpi label="Unique Sessions" value={stats.uniqueSessions} />
          <Kpi label="Conversion (Open→Send)" value={`${stats.conversionRate.toFixed(1)} %`} />
          <Kpi label="AI-Anfragen (Backend)" value={stats.totalRequests} />
          <Kpi label="Tokens gesamt" value={stats.totalTokens.toLocaleString("de-DE")} />
          <Kpi label="Geschätzte Kosten" value={`≈ $${stats.estimatedUsd.toFixed(4)}`} />
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Öffnungen pro Seite</h2>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Daten.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {stats.topPages.map(([path, count]) => (
                <li key={path} className="flex justify-between py-2">
                  <span className="truncate text-foreground">{path}</span>
                  <span className="text-muted-foreground">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 overflow-x-auto">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Token-Verbrauch pro Tag</h2>
          {usage.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch kein Verbrauch erfasst.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr><th className="py-2">Datum</th><th>Anfragen</th><th>Prompt</th><th>Completion</th><th>Gesamt</th></tr>
              </thead>
              <tbody>
                {usage.map((u) => (
                  <tr key={u.usage_date} className="border-t border-border">
                    <td className="py-2 text-foreground">{u.usage_date}</td>
                    <td>{u.request_count}</td>
                    <td>{u.prompt_tokens.toLocaleString("de-DE")}</td>
                    <td>{u.completion_tokens.toLocaleString("de-DE")}</td>
                    <td className="font-medium">{u.total_tokens.toLocaleString("de-DE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 overflow-x-auto">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Letzte Events</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Zeit</th><th>Event</th><th>Seite</th><th>Session</th></tr>
            </thead>
            <tbody>
              {events.slice(0, 50).map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="py-2">{new Date(e.created_at).toLocaleString("de-DE")}</td>
                  <td>{e.event_type}</td>
                  <td className="truncate max-w-[200px]">{e.page_path}</td>
                  <td className="truncate max-w-[140px] text-muted-foreground">{e.session_id?.slice(0, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

const Kpi = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

export default AdminChatbotStats;
