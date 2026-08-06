-- 1) Ticket-Erstellung nur noch serverseitig (kein offener Insert mehr)
DROP POLICY IF EXISTS "Anyone can create inquiry confirmation tickets" ON public.inquiry_confirmation_tickets;
REVOKE INSERT, SELECT, UPDATE, DELETE ON public.inquiry_confirmation_tickets FROM anon, authenticated;
GRANT ALL ON public.inquiry_confirmation_tickets TO service_role;

CREATE POLICY "Service role manages inquiry confirmation tickets"
ON public.inquiry_confirmation_tickets
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2) has_role() nicht mehr für angemeldete Nutzer ausführbar;
--    Policies prüfen die Rolle direkt über user_roles (RLS dort erlaubt nur eigene Zeilen)
DROP POLICY IF EXISTS "Admins can view chat usage" ON public.chat_usage_daily;
CREATE POLICY "Admins can view chat usage"
ON public.chat_usage_daily
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
));

DROP POLICY IF EXISTS "Admins can view chatbot events" ON public.chatbot_events;
CREATE POLICY "Admins can view chatbot events"
ON public.chatbot_events
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;