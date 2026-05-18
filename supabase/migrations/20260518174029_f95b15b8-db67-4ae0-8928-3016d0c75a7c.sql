
create table public.inquiry_confirmation_tickets (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  confirmation_sent_at timestamptz,
  ip_hash text
);

create index inquiry_confirmation_tickets_email_created_idx
  on public.inquiry_confirmation_tickets (email, created_at desc);

alter table public.inquiry_confirmation_tickets enable row level security;

-- Anonymous (and authenticated) callers may create a ticket. They cannot read,
-- update, or delete tickets — only the service role can (used by the email
-- edge function to consume the ticket). No SELECT/UPDATE/DELETE policies are
-- defined for non-service roles, which means those operations are denied by
-- default under RLS.
create policy "Anyone can create inquiry confirmation tickets"
  on public.inquiry_confirmation_tickets
  for insert
  to anon, authenticated
  with check (
    email is not null
    and length(email) between 3 and 254
    and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  );
