-- Revoke EXECUTE from anon and authenticated on all internal SECURITY DEFINER functions.
-- These should only be invoked by Edge Functions using the service_role key.

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.increment_chat_usage(integer, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_today_chat_tokens() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.update_referrals_updated_at() FROM PUBLIC, anon, authenticated;

-- Ensure service_role retains EXECUTE (it does by default, but be explicit).
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_chat_usage(integer, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_today_chat_tokens() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_referrals_updated_at() TO service_role;