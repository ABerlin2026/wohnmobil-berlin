-- Referrals table for the referral program (50€ commission per successful booking)
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Referrer (person making the recommendation)
  referrer_name TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  -- Referred person (potential customer)
  referred_name TEXT NOT NULL,
  referred_email TEXT NOT NULL,
  referred_phone TEXT NOT NULL,
  -- GDPR consent confirmation
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  -- Status tracking: new -> contacted -> booked -> paid
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'paid', 'rejected')),
  -- Internal notes for the team
  internal_notes TEXT,
  -- Optional metadata (language, source, etc.)
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous visitors) can submit a referral via the form
CREATE POLICY "Anyone can submit a referral"
ON public.referrals
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No public read/update/delete: only service role (backend / admin) can access
-- (No SELECT/UPDATE/DELETE policies = no access for anon/authenticated)

-- Reuse the existing timestamp update function (already exists in project)
CREATE OR REPLACE FUNCTION public.update_referrals_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_referrals_updated_at();

-- Indexes for admin queries
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referrals_created_at ON public.referrals(created_at DESC);
CREATE INDEX idx_referrals_referrer_email ON public.referrals(referrer_email);