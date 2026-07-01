CREATE TABLE public.chatbot_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('opened','message_sent')),
  session_id TEXT,
  user_agent TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.chatbot_events TO anon, authenticated;
GRANT ALL ON public.chatbot_events TO service_role;

ALTER TABLE public.chatbot_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chatbot events"
  ON public.chatbot_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_chatbot_events_created_at ON public.chatbot_events (created_at DESC);
CREATE INDEX idx_chatbot_events_type ON public.chatbot_events (event_type);