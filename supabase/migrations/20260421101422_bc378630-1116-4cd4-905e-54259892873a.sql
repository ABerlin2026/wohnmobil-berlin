-- Revoke public EXECUTE on SECURITY DEFINER chat usage functions.
-- The edge function uses the service role which bypasses these grants.
REVOKE EXECUTE ON FUNCTION public.increment_chat_usage(integer, integer, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_chat_usage(integer, integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_chat_usage(integer, integer, integer) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.get_today_chat_tokens() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_today_chat_tokens() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_today_chat_tokens() FROM authenticated;

-- Ensure RLS is enabled (it already is per scan) and add an explicit deny-all
-- policy so the linter is satisfied. Service role bypasses RLS entirely.
ALTER TABLE public.chat_usage_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No client access to chat usage" ON public.chat_usage_daily;
CREATE POLICY "No client access to chat usage"
ON public.chat_usage_daily
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);