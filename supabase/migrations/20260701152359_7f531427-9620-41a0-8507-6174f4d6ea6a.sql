-- Lock down SECURITY DEFINER helpers so only backend roles can call them.
-- These are all invoked via triggers, cron, or edge functions (service_role) —
-- no anon or authenticated client should call them directly.
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_inquiry_ticket_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_chat_usage(integer, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_today_chat_tokens() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_internal_email_suppression() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.normalise_referral_insert() FROM PUBLIC, anon, authenticated;

-- Tighten the chatbot_events INSERT policy: no longer WITH CHECK (true).
-- Restrict to known event types and bounded field lengths to prevent abuse.
DROP POLICY IF EXISTS "Anyone can insert chatbot events" ON public.chatbot_events;
CREATE POLICY "Anyone can insert valid chatbot events"
  ON public.chatbot_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IN ('opened', 'message_sent')
    AND (session_id IS NULL OR length(session_id) BETWEEN 1 AND 128)
    AND (page_path IS NULL OR length(page_path) <= 512)
    AND (user_agent IS NULL OR length(user_agent) <= 500)
  );