-- ==========================================
-- SECURITY FIX: Enable RLS and Create Policies
-- Run this in Supabase SQL Editor
-- ==========================================

-- Re-enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to start fresh)
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Admins can view customers" ON customers;
DROP POLICY IF EXISTS "Admins can create customers" ON customers;
DROP POLICY IF EXISTS "Admins can update customers" ON customers;
DROP POLICY IF EXISTS "Admins can delete customers" ON customers;
DROP POLICY IF EXISTS "Admins can view estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can create estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can update estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can delete estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can view invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can create invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can update invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can delete invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can view estimate_items" ON estimate_items;
DROP POLICY IF EXISTS "Admins can create estimate_items" ON estimate_items;
DROP POLICY IF EXISTS "Admins can update estimate_items" ON estimate_items;
DROP POLICY IF EXISTS "Admins can delete estimate_items" ON estimate_items;
DROP POLICY IF EXISTS "Admins can view invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Admins can create invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Admins can update invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Admins can delete invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Admins can view jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can create jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can view photos" ON customer_photos;
DROP POLICY IF EXISTS "Admins can create photos" ON customer_photos;
DROP POLICY IF EXISTS "Admins can update photos" ON customer_photos;
DROP POLICY IF EXISTS "Admins can delete photos" ON customer_photos;
DROP POLICY IF EXISTS "Public can submit contact requests" ON contact_request;
DROP POLICY IF EXISTS "Admins can view contact requests" ON contact_request;
DROP POLICY IF EXISTS "Admins can update contact requests" ON contact_request;
DROP POLICY IF EXISTS "Admins can view admin list" ON admins;
DROP POLICY IF EXISTS "Admins can view email logs" ON email_logs;
DROP POLICY IF EXISTS "Admins can create email logs" ON email_logs;

-- ==========================================
-- SERVICES TABLE POLICIES
-- ==========================================
-- Public can view active services (for the public website)
CREATE POLICY "Public can view active services" ON services
  FOR SELECT
  USING (is_active = true);

-- Authenticated admins can do everything with services
CREATE POLICY "Admins can manage services" ON services
  FOR ALL
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- CUSTOMERS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view customers" ON customers
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create customers" ON customers
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update customers" ON customers
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete customers" ON customers
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- ESTIMATES TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view estimates" ON estimates
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create estimates" ON estimates
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update estimates" ON estimates
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete estimates" ON estimates
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- INVOICES TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view invoices" ON invoices
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create invoices" ON invoices
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update invoices" ON invoices
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete invoices" ON invoices
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- ESTIMATE_ITEMS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view estimate_items" ON estimate_items
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create estimate_items" ON estimate_items
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update estimate_items" ON estimate_items
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete estimate_items" ON estimate_items
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- INVOICE_ITEMS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view invoice_items" ON invoice_items
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create invoice_items" ON invoice_items
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update invoice_items" ON invoice_items
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete invoice_items" ON invoice_items
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- JOBS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view jobs" ON jobs
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create jobs" ON jobs
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update jobs" ON jobs
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete jobs" ON jobs
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- CUSTOMER_PHOTOS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view photos" ON customer_photos
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create photos" ON customer_photos
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update photos" ON customer_photos
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete photos" ON customer_photos
  FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- CONTACT_REQUEST TABLE POLICIES
-- ==========================================
-- Public can submit contact requests (for contact form on website)
CREATE POLICY "Public can submit contact requests" ON contact_request
  FOR INSERT
  WITH CHECK (true);

-- Admins can view contact requests
CREATE POLICY "Admins can view contact requests" ON contact_request
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Admins can update contact request status
CREATE POLICY "Admins can update contact requests" ON contact_request
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- ADMINS TABLE POLICIES
-- ==========================================
CREATE POLICY "Admins can view admin list" ON admins
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- EMAIL_LOGS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view email logs" ON email_logs
  FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can create email logs" ON email_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT auth.uid() FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================
-- Run these to verify policies are working:

-- Check RLS status on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
