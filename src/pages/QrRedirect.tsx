import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const QrRedirect = () => {
  const { source = "flyer" } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const key = `qr-scan-${source}`;
    const done = () => navigate("/", { replace: true });
    if (sessionStorage.getItem(key)) return done();
    sessionStorage.setItem(key, "1");
    const timer = setTimeout(done, 1500);
    supabase.functions
      .invoke("qr-scan", { body: { source } })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        done();
      });
    return () => clearTimeout(timer);
  }, [source, navigate]);

  return null;
};

export default QrRedirect;
