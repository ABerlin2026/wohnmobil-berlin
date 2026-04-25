import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type State =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "already" }
  | { status: "invalid" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message?: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid" });
      return;
    }
    const validate = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } }
        );
        const data = await res.json();
        if (!res.ok) {
          setState({ status: "invalid" });
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setState({ status: "already" });
        } else if (data.valid === true) {
          setState({ status: "ready" });
        } else {
          setState({ status: "invalid" });
        }
      } catch {
        setState({ status: "error" });
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState({ status: "submitting" });
    const { data, error } = await supabase.functions.invoke(
      "handle-email-unsubscribe",
      { body: { token } }
    );
    if (error) {
      setState({ status: "error", message: error.message });
      return;
    }
    if (data?.success) {
      setState({ status: "success" });
    } else if (data?.reason === "already_unsubscribed") {
      setState({ status: "already" });
    } else {
      setState({ status: "error" });
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface-1 border border-border/20 rounded-xl p-8 text-center">
        <h1 className="text-2xl font-display font-bold mb-3">
          E-Mail-Abmeldung
        </h1>

        {state.status === "loading" && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p>Token wird geprüft…</p>
          </div>
        )}

        {state.status === "ready" && (
          <>
            <p className="text-muted-foreground mb-6">
              Bist du sicher, dass du keine E-Mails mehr von{" "}
              <strong className="text-foreground">Wohnmobil Berlin</strong>{" "}
              erhalten möchtest?
            </p>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="w-full"
            >
              Abmeldung bestätigen
            </Button>
          </>
        )}

        {state.status === "submitting" && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p>Wird verarbeitet…</p>
          </div>
        )}

        {state.status === "success" && (
          <p className="text-muted-foreground">
            Du wurdest erfolgreich abgemeldet. Du wirst keine weiteren
            E-Mails von uns erhalten.
          </p>
        )}

        {state.status === "already" && (
          <p className="text-muted-foreground">
            Diese E-Mail-Adresse ist bereits abgemeldet.
          </p>
        )}

        {state.status === "invalid" && (
          <p className="text-muted-foreground">
            Dieser Abmelde-Link ist ungültig oder abgelaufen.
          </p>
        )}

        {state.status === "error" && (
          <p className="text-destructive">
            {state.message ||
              "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut."}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-border/20">
          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Unsubscribe;
