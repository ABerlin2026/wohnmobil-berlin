CREATE POLICY "Tenant document read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'rental-documents' AND public.is_tenant_member(NULLIF((storage.foldername(name))[1], '')::uuid));

CREATE POLICY "Tenant document upload" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'rental-documents' AND public.is_tenant_staff(NULLIF((storage.foldername(name))[1], '')::uuid));

CREATE POLICY "Tenant document update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'rental-documents' AND public.is_tenant_staff(NULLIF((storage.foldername(name))[1], '')::uuid))
WITH CHECK (bucket_id = 'rental-documents' AND public.is_tenant_staff(NULLIF((storage.foldername(name))[1], '')::uuid));

CREATE POLICY "Tenant document delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'rental-documents' AND public.is_tenant_staff(NULLIF((storage.foldername(name))[1], '')::uuid));