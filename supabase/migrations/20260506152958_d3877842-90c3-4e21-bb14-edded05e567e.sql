CREATE OR REPLACE FUNCTION public.normalise_referral_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    NEW.status := 'new';
    NEW.internal_notes := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalise_referral_before_insert ON public.referrals;
CREATE TRIGGER normalise_referral_before_insert
BEFORE INSERT ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.normalise_referral_insert();