DELETE FROM public.suppressed_emails WHERE email = 'wohnmobil.berlin@gmx.de';
DELETE FROM public.email_unsubscribe_tokens WHERE lower(email) = 'wohnmobil.berlin@gmx.de';