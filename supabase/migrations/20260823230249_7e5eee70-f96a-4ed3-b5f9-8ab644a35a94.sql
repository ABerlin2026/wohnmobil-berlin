ALTER TABLE public.damage_markers DROP CONSTRAINT IF EXISTS damage_markers_vehicle_side_check;
ALTER TABLE public.damage_markers ADD CONSTRAINT damage_markers_vehicle_side_check
  CHECK (vehicle_side = ANY (ARRAY['front'::text, 'rear'::text, 'driver'::text, 'passenger'::text, 'interior'::text]));