import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageSEO from "@/components/PageSEO";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/chatbot-stats", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/admin/chatbot-stats", { replace: true });
  };

  return (
    <>
      <PageSEO title="Admin Login" description="Interner Admin-Bereich" noindex />
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <form
          onSubmit={submit}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <h1 className="text-xl font-semibold text-foreground">Admin-Login</h1>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
      </main>
    </>
  );
};

export default AdminLogin;
