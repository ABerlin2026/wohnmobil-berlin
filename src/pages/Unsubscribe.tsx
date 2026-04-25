import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "submitting" | "success" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setErrorMsg("Es wurde kein gültiger Abmelde-Link erkannt.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.valid === true) {
          setStatus("valid");
        } else if (data.reason === "already_unsubscribed") {
          setStatus("already");
        } else {
          setStatus("invalid");
          setErrorMsg(data.error || "Der Abmelde-Link ist ungültig oder abgelaufen.");
        }
      } catch {
        setStatus("invalid");
        setErrorMsg("Verbindungsfehler. Bitte später erneut versuchen.");
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setStatus("submitting");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("success");
      } else if (data.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Abmeldung fehlgeschlagen.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Verbindungsfehler. Bitte später erneut versuchen.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-1 rounded-xl border border-border/20 p-6 sm:p-8 text-center">
        <h1 className="text-2xl font-display font-bold mb-2">E-Mail-Abmeldung</h1>
        <p className="text-sm text-muted-foreground mb-6">Camper Berlin – Wohnmobil-Vermietung</p>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Link wird geprüft…</p>
          </div>
        )}

        {status === "valid" && (
          <>
            <p className="text-sm text-foreground mb-6">
              Möchtest du dich von künftigen E-Mails abmelden? Bitte bestätige unten.
            </p>
            <Button variant="hero" size="lg" className="w-full" onClick={handleConfirm}>
              Abmeldung bestätigen
            </Button>
          </>
        )}

        {status === "submitting" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Wird verarbeitet…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-sm text-foreground">
              Du wurdest erfolgreich abgemeldet. Wir senden dir keine weiteren E-Mails.
            </p>
          </div>
        )}

        {status === "already" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-sm text-foreground">Diese Adresse ist bereits abgemeldet.</p>
          </div>
        )}

        {(status === "invalid" || status === "error") && (
          <div className="flex flex-col items-center gap-3 py-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm text-destructive">{errorMsg}</p>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="text-xs text-primary hover:underline">
            ← Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Unsubscribe;
