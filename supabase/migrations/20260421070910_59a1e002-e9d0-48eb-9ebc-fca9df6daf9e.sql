-- Daily aggregate of chatbot token usage for cost circuit-breaker
CREATE TABLE public.chat_usage_daily (
  usage_date DATE NOT NULL PRIMARY KEY DEFAULT CURRENT_DATE,
  request_count INTEGER NOT NULL DEFAULT 0,
  prompt_tokens BIGINT NOT NULL DEFAULT 0,
  completion_tokens BIGINT NOT NULL DEFAULT 0,
  total_tokens BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_usage_daily ENABLE ROW LEVEL SECURITY;

-- No public access — only the edge function (service role) reads/writes this.
-- Service role bypasses RLS, so we intentionally create no permissive policies.

-- Atomic increment helper: upserts today's row and returns the new total.
CREATE OR REPLACE FUNCTION public.increment_chat_usage(
  p_prompt_tokens INTEGER,
  p_completion_tokens INTEGER,
  p_total_tokens INTEGER
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total BIGINT;
BEGIN
  INSERT INTO public.chat_usage_daily (
    usage_date, request_count, prompt_tokens, completion_tokens, total_tokens, updated_at
  )
  VALUES (
    CURRENT_DATE, 1, p_prompt_tokens, p_completion_tokens, p_total_tokens, now()
  )
  ON CONFLICT (usage_date) DO UPDATE SET
    request_count = public.chat_usage_daily.request_count + 1,
    prompt_tokens = public.chat_usage_daily.prompt_tokens + EXCLUDED.prompt_tokens,
    completion_tokens = public.chat_usage_daily.completion_tokens + EXCLUDED.completion_tokens,
    total_tokens = public.chat_usage_daily.total_tokens + EXCLUDED.total_tokens,
    updated_at = now()
  RETURNING total_tokens INTO v_total;

  RETURN v_total;
END;
$$;

-- Read-only helper to check today's total quickly without incrementing
CREATE OR REPLACE FUNCTION public.get_today_chat_tokens()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(total_tokens, 0)
  FROM public.chat_usage_daily
  WHERE usage_date = CURRENT_DATE;
$$;