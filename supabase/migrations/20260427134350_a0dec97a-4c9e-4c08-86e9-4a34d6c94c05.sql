-- 1. Verschärfe INSERT-Policy: nur mit bestätigter Einwilligung
DROP POLICY IF EXISTS "Anyone can submit a referral" ON public.referrals;

CREATE POLICY "Anyone can submit a referral with consent"
ON public.referrals
FOR INSERT
TO anon, authenticated
WITH CHECK (consent_confirmed = true);

-- 2. Kontrollierter Lesepfad: nur service_role darf lesen
CREATE POLICY "Service role can read referrals"
ON public.referrals
FOR SELECT
TO public
USING (auth.role() = 'service_role');

-- 3. Löschen nur durch service_role (für PII-Bereinigung)
CREATE POLICY "Service role can delete referrals"
ON public.referrals
FOR DELETE
TO public
USING (auth.role() = 'service_role');

-- 4. Updates nur durch service_role (für Status / interne Notizen)
CREATE POLICY "Service role can update referrals"
ON public.referrals
FOR UPDATE
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');