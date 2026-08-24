-- Alte, abweichende Werte auf die Skala normalisieren
UPDATE public.inspections SET fresh_water = NULL
  WHERE fresh_water IS NOT NULL AND fresh_water NOT IN ('empty','quarter','half','three_quarters','full');
UPDATE public.inspections SET waste_water = NULL
  WHERE waste_water IS NOT NULL AND waste_water NOT IN ('empty','quarter','half','three_quarters','full');
UPDATE public.inspections SET keys_count = NULL WHERE keys_count IS NOT NULL AND (keys_count < 0 OR keys_count > 5);
UPDATE public.inspections SET gas_bottles = NULL WHERE gas_bottles IS NOT NULL AND (gas_bottles < 0 OR gas_bottles > 4);
UPDATE public.inspections SET safety_vests = NULL WHERE safety_vests IS NOT NULL AND (safety_vests < 0 OR safety_vests > 10);

ALTER TABLE public.inspections DROP CONSTRAINT IF EXISTS inspections_fresh_water_check;
ALTER TABLE public.inspections ADD CONSTRAINT inspections_fresh_water_check
  CHECK (fresh_water IS NULL OR fresh_water IN ('empty','quarter','half','three_quarters','full'));

ALTER TABLE public.inspections DROP CONSTRAINT IF EXISTS inspections_waste_water_check;
ALTER TABLE public.inspections ADD CONSTRAINT inspections_waste_water_check
  CHECK (waste_water IS NULL OR waste_water IN ('empty','quarter','half','three_quarters','full'));

ALTER TABLE public.inspections DROP CONSTRAINT IF EXISTS inspections_keys_count_check;
ALTER TABLE public.inspections ADD CONSTRAINT inspections_keys_count_check
  CHECK (keys_count IS NULL OR (keys_count >= 0 AND keys_count <= 5));

ALTER TABLE public.inspections DROP CONSTRAINT IF EXISTS inspections_gas_bottles_check;
ALTER TABLE public.inspections ADD CONSTRAINT inspections_gas_bottles_check
  CHECK (gas_bottles IS NULL OR (gas_bottles >= 0 AND gas_bottles <= 4));

ALTER TABLE public.inspections DROP CONSTRAINT IF EXISTS inspections_safety_vests_check;
ALTER TABLE public.inspections ADD CONSTRAINT inspections_safety_vests_check
  CHECK (safety_vests IS NULL OR (safety_vests >= 0 AND safety_vests <= 10));