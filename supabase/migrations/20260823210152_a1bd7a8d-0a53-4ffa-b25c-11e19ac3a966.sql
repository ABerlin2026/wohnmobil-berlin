INSERT INTO public.tenants (name, slug, status, default_deposit_cents, free_km_per_day)
VALUES ('Wohnmobil Berlin', 'wohnmobil-berlin', 'active', 150000, 150)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.vehicles (tenant_id, name, make, model, active)
SELECT t.id, 'Wohnmobil Berlin', 'Fiat', 'Ducato Teilintegriert', true
FROM public.tenants t
WHERE t.slug = 'wohnmobil-berlin'
  AND NOT EXISTS (SELECT 1 FROM public.vehicles v WHERE v.tenant_id = t.id);

INSERT INTO public.inventory_items (tenant_id, vehicle_id, name, item_type, quantity, replacement_price_cents, sort_order)
SELECT v.tenant_id, v.id, d.name, d.item_type, d.quantity, d.price, d.sort_order
FROM public.vehicles v
JOIN public.tenants t ON t.id = v.tenant_id AND t.slug = 'wohnmobil-berlin'
CROSS JOIN (VALUES
  ('Gasflasche 11 kg', 'single', 2, 6000, 10),
  ('Wasserschlauch mit Adapter', 'single', 1, 2500, 20),
  ('Stromkabel 25 m (CEE)', 'single', 1, 4500, 30),
  ('Abwasserschlauch', 'single', 1, 2000, 40),
  ('Geschirr-Set (4 Personen)', 'set', 1, 8000, 50),
  ('Besteck-Set (4 Personen)', 'set', 1, 5000, 60),
  ('Topf- und Pfannenset', 'set', 1, 9000, 70),
  ('Campingtisch', 'single', 1, 7000, 80),
  ('Campingstuhl', 'single', 4, 4000, 90),
  ('Vorzelt (Zubuchbar)', 'single', 1, 45000, 100),
  ('Keilkissen / Ausgleichskeile', 'single', 2, 3000, 110),
  ('Toilettenchemie (Flasche)', 'single', 2, 1500, 120),
  ('Feuerlöscher', 'single', 1, 4000, 130),
  ('Warndreieck', 'single', 1, 1500, 140),
  ('Warnweste', 'single', 4, 800, 150),
  ('Verbandkasten', 'single', 1, 1500, 160),
  ('Bettwäsche-Set', 'set', 4, 4000, 170),
  ('Handtuch-Set', 'set', 4, 2500, 180),
  ('Reinigungsset', 'set', 1, 3000, 190),
  ('Türvorleger', 'single', 1, 2000, 200)
) AS d(name, item_type, quantity, price, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.inventory_items i WHERE i.vehicle_id = v.id AND i.name = d.name
);

CREATE OR REPLACE FUNCTION public.claim_tenant_bootstrap(_slug text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Anmeldung erforderlich';
  END IF;

  SELECT id INTO v_tenant FROM public.tenants WHERE slug = _slug;
  IF v_tenant IS NULL THEN
    RAISE EXCEPTION 'Mandant nicht gefunden';
  END IF;

  IF EXISTS (SELECT 1 FROM public.tenant_members WHERE tenant_id = v_tenant AND user_id = auth.uid()) THEN
    RETURN v_tenant;
  END IF;

  IF EXISTS (SELECT 1 FROM public.tenant_members WHERE tenant_id = v_tenant) THEN
    RAISE EXCEPTION 'Der Mandant ist bereits eingerichtet';
  END IF;

  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (v_tenant, auth.uid(), 'tenant_admin');

  INSERT INTO public.audit_logs (tenant_id, actor_id, action, entity_type, entity_id)
  VALUES (v_tenant, auth.uid(), 'tenant.bootstrap_claimed', 'tenant', v_tenant::text);

  RETURN v_tenant;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_tenant_bootstrap(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_tenant_bootstrap(text) TO authenticated, service_role;