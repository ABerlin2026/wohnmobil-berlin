CREATE OR REPLACE FUNCTION public.prevent_internal_email_suppression()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'wohnmobil.berlin@gmx.de' THEN
    RAISE NOTICE 'Suppression für interne Adresse % blockiert', NEW.email;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS block_internal_suppression ON public.suppressed_emails;
CREATE TRIGGER block_internal_suppression
BEFORE INSERT ON public.suppressed_emails
FOR EACH ROW
EXECUTE FUNCTION public.prevent_internal_email_suppression();