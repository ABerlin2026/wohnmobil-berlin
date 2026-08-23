-- Multi-tenant rental management for Wohnmobil Berlin.
-- Existing public website tables remain untouched.

CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  logo_url text,
  primary_color text,
  default_deposit_cents integer NOT NULL DEFAULT 150000,
  free_km_per_day integer NOT NULL DEFAULT 150,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tenant_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'employee',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  make text,
  model text,
  registration_number text,
  vin text,
  active boolean NOT NULL DEFAULT true,
  diagram_front_url text,
  diagram_rear_url text,
  diagram_driver_url text,
  diagram_passenger_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  portal_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date,
  birth_place text,
  nationality text,
  street text,
  postal_code text,
  city text,
  country text NOT NULL DEFAULT 'Deutschland',
  email text,
  phone text,
  identity_number text,
  identity_issued_at date,
  identity_expires_at date,
  identity_authority text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE RESTRICT,
  customer_id uuid REFERENCES public.customers(id) ON DELETE RESTRICT,
  rental_number text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'booked', 'documents_pending', 'handover_ready', 'active',
    'return_due', 'damage_review', 'billing_open', 'completed', 'cancelled', 'overdue'
  )),
  start_date date NOT NULL,
  end_date date NOT NULL,
  destination text,
  expected_km integer,
  free_km_per_day integer NOT NULL DEFAULT 150,
  extra_km_price_cents integer NOT NULL DEFAULT 0,
  deposit_cents integer NOT NULL DEFAULT 150000,
  deposit_paid_cents integer NOT NULL DEFAULT 0,
  rental_price_cents integer NOT NULL DEFAULT 0,
  handover_location text,
  return_location text,
  tank_handover text CHECK (tank_handover IN ('empty', 'quarter', 'half', 'three_quarters', 'full')),
  terms_version text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, rental_number),
  CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rental_id uuid NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  identity_number text,
  identity_expires_at date,
  license_number text,
  license_classes text[],
  license_issued_at date,
  license_expires_at date,
  document_warning_overridden boolean NOT NULL DEFAULT false,
  document_warning_overridden_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE,
  name text NOT NULL,
  item_type text NOT NULL DEFAULT 'single' CHECK (item_type IN ('single', 'set')),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  replacement_price_cents integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rental_id uuid NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  inspection_type text NOT NULL CHECK (inspection_type IN ('handover', 'return')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'completed')),
  odometer integer,
  tank_level text CHECK (tank_level IN ('empty', 'quarter', 'half', 'three_quarters', 'full')),
  fresh_water text,
  waste_water text,
  motor_oil text,
  gas_status text,
  notes text,
  no_new_damage_confirmed boolean NOT NULL DEFAULT false,
  instruction_complete boolean NOT NULL DEFAULT false,
  no_open_questions boolean NOT NULL DEFAULT false,
  customer_signature_url text,
  lessor_signature_url text,
  signed_at timestamptz,
  completed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rental_id, inspection_type)
);

CREATE TABLE IF NOT EXISTS public.inspection_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  inventory_item_id uuid REFERENCES public.inventory_items(id) ON DELETE SET NULL,
  item_snapshot jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('complete', 'partial', 'missing', 'damaged')),
  missing_quantity integer NOT NULL DEFAULT 0,
  damaged_quantity integer NOT NULL DEFAULT 0,
  deduction_cents integer NOT NULL DEFAULT 0,
  notes text
);

CREATE TABLE IF NOT EXISTS public.damage_markers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  inspection_id uuid REFERENCES public.inspections(id) ON DELETE SET NULL,
  marker_label text NOT NULL,
  vehicle_side text NOT NULL CHECK (vehicle_side IN ('front', 'rear', 'driver', 'passenger')),
  x_percent numeric(5,2) NOT NULL CHECK (x_percent BETWEEN 0 AND 100),
  y_percent numeric(5,2) NOT NULL CHECK (y_percent BETWEEN 0 AND 100),
  damage_type text,
  severity text CHECK (severity IN ('note', 'light', 'medium', 'severe')),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'existing' CHECK (status IN ('existing', 'new', 'disputed', 'repaired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rental_id uuid REFERENCES public.rentals(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE CASCADE,
  damage_marker_id uuid REFERENCES public.damage_markers(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  file_hash text,
  version integer NOT NULL DEFAULT 1,
  is_final boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rental_id uuid NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  payment_type text NOT NULL CHECK (payment_type IN ('rent', 'deposit', 'refund', 'deduction', 'additional_charge')),
  amount_cents integer NOT NULL,
  payment_method text NOT NULL,
  payment_date date NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rental_id uuid NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  invoice_type text NOT NULL DEFAULT 'invoice' CHECK (invoice_type IN ('invoice', 'final_invoice')),
  version integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
  gross_total_cents integer NOT NULL DEFAULT 0,
  predecessor_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  change_reason text,
  issued_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, invoice_number, version)
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  gross_unit_price_cents integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  account_holder text NOT NULL,
  iban text NOT NULL,
  bic text,
  confirmed_by_customer boolean NOT NULL DEFAULT false,
  confirmed_by_employee boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Data API privileges (RLS below restricts the rows).
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rentals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_components TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_inventory TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.damage_markers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

GRANT ALL ON public.tenants TO service_role;
GRANT ALL ON public.tenant_members TO service_role;
GRANT ALL ON public.vehicles TO service_role;
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.rentals TO service_role;
GRANT ALL ON public.drivers TO service_role;
GRANT ALL ON public.inventory_items TO service_role;
GRANT ALL ON public.inventory_components TO service_role;
GRANT ALL ON public.inspections TO service_role;
GRANT ALL ON public.inspection_inventory TO service_role;
GRANT ALL ON public.damage_markers TO service_role;
GRANT ALL ON public.documents TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.invoices TO service_role;
GRANT ALL ON public.invoice_items TO service_role;
GRANT ALL ON public.bank_accounts TO service_role;
GRANT ALL ON public.audit_logs TO service_role;

CREATE OR REPLACE FUNCTION public.is_tenant_member(_tenant_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = _tenant_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('platform_admin', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_tenant_staff(_tenant_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = _tenant_id AND user_id = auth.uid()
      AND role IN ('tenant_admin', 'employee', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('platform_admin', 'admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_tenant_member(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_tenant_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_tenant_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_tenant_staff(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER rentals_updated_at BEFORE UPDATE ON public.rentals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER inspections_updated_at BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER damage_markers_updated_at BEFORE UPDATE ON public.damage_markers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view tenants" ON public.tenants FOR SELECT TO authenticated USING (public.is_tenant_member(id));
CREATE POLICY "Platform admins manage tenants" ON public.tenants FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('platform_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('platform_admin', 'admin')));
CREATE POLICY "Members view memberships" ON public.tenant_members FOR SELECT TO authenticated USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Tenant admins manage memberships" ON public.tenant_members FOR ALL TO authenticated USING (public.is_tenant_staff(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));

CREATE POLICY "Tenant vehicle access" ON public.vehicles FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant customer access" ON public.customers FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant rental access" ON public.rentals FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant driver access" ON public.drivers FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant inventory access" ON public.inventory_items FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant component access" ON public.inventory_components FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant inspection access" ON public.inspections FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant inspection inventory access" ON public.inspection_inventory FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant damage access" ON public.damage_markers FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant document access" ON public.documents FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant payment access" ON public.payments FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant invoice access" ON public.invoices FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant invoice item access" ON public.invoice_items FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant bank access" ON public.bank_accounts FOR ALL TO authenticated USING (public.is_tenant_member(tenant_id)) WITH CHECK (public.is_tenant_staff(tenant_id));
CREATE POLICY "Tenant audit view" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Tenant audit insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_tenant_staff(tenant_id));

CREATE INDEX IF NOT EXISTS rentals_tenant_status_idx ON public.rentals (tenant_id, status, start_date);
CREATE INDEX IF NOT EXISTS customers_tenant_name_idx ON public.customers (tenant_id, last_name, first_name);
CREATE INDEX IF NOT EXISTS damages_vehicle_side_idx ON public.damage_markers (vehicle_id, vehicle_side, status);
CREATE INDEX IF NOT EXISTS inventory_vehicle_sort_idx ON public.inventory_items (tenant_id, vehicle_id, sort_order);
CREATE INDEX IF NOT EXISTS tenant_members_user_idx ON public.tenant_members (user_id);
CREATE INDEX IF NOT EXISTS documents_rental_idx ON public.documents (tenant_id, rental_id);
CREATE INDEX IF NOT EXISTS inspections_rental_idx ON public.inspections (rental_id);