ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS handover_time time,
  ADD COLUMN IF NOT EXISTS return_time time,
  ADD COLUMN IF NOT EXISTS planned_route text;

ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS keys_count integer,
  ADD COLUMN IF NOT EXISTS vehicle_papers boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboard_tools boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS warning_triangle boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_aid_kit boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS safety_vests integer,
  ADD COLUMN IF NOT EXISTS car_jack boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gas_bottles integer,
  ADD COLUMN IF NOT EXISTS tire_tread text,
  ADD COLUMN IF NOT EXISTS cleaning_status text,
  ADD COLUMN IF NOT EXISTS delay_minutes integer,
  ADD COLUMN IF NOT EXISTS actual_return_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_override_reason text,
  ADD COLUMN IF NOT EXISTS payment_override_by uuid REFERENCES auth.users(id);

ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS extra_km_price_cents integer NOT NULL DEFAULT 35,
  ADD COLUMN IF NOT EXISTS price_list jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS payment_methods jsonb NOT NULL DEFAULT '["Überweisung","Bar","EC-Karte","PayPal"]'::jsonb;

CREATE INDEX IF NOT EXISTS inspections_rental_idx ON public.inspections (rental_id);
CREATE INDEX IF NOT EXISTS damage_markers_vehicle_side_idx ON public.damage_markers (vehicle_id, vehicle_side);
CREATE INDEX IF NOT EXISTS documents_rental_idx ON public.documents (rental_id);
CREATE INDEX IF NOT EXISTS payments_rental_idx ON public.payments (rental_id);