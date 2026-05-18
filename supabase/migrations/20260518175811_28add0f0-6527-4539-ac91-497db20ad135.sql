
-- Rate limit trigger: max 3 ticket inserts per email per 10 minutes
CREATE OR REPLACE FUNCTION public.enforce_inquiry_ticket_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INT;
  total_recent INT;
BEGIN
  -- Opportunistic cleanup of old tickets (>30 min) to bound table growth
  DELETE FROM public.inquiry_confirmation_tickets
  WHERE created_at < now() - INTERVAL '30 minutes';

  -- Per-email limit: max 3 tickets per 10 minutes
  SELECT COUNT(*) INTO recent_count
  FROM public.inquiry_confirmation_tickets
  WHERE lower(email) = lower(NEW.email)
    AND created_at > now() - INTERVAL '10 minutes';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded for this email address. Please try again later.'
      USING ERRCODE = 'check_violation';
  END IF;

  -- Global safety net: max 500 tickets created in last 10 minutes across all emails
  SELECT COUNT(*) INTO total_recent
  FROM public.inquiry_confirmation_tickets
  WHERE created_at > now() - INTERVAL '10 minutes';

  IF total_recent >= 500 THEN
    RAISE EXCEPTION 'System is temporarily busy. Please try again later.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_inquiry_ticket_rate_limit_trg ON public.inquiry_confirmation_tickets;
CREATE TRIGGER enforce_inquiry_ticket_rate_limit_trg
  BEFORE INSERT ON public.inquiry_confirmation_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_inquiry_ticket_rate_limit();

CREATE INDEX IF NOT EXISTS idx_inquiry_tickets_email_created
  ON public.inquiry_confirmation_tickets (lower(email), created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inquiry_tickets_created
  ON public.inquiry_confirmation_tickets (created_at DESC);
