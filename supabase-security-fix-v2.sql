-- ==========================================
-- SECURITY FIX V2: Enable RLS and Create Policies
-- Run this in Supabase SQL Editor
-- ==========================================

-- FIRST: Add your admin email if not already there (DO THIS FIRST!)
-- Replace with your actual email: gary@sealnstripenspecialist.com

-- Temporarily disable RLS on admins table to add your email
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Add your admin email (this will fail silently if it already exists)
INSERT INTO admins (email)
VALUES ('gary@sealnstripenspecialist.com')
ON CONFLICT (email) DO NOTHING;

-- Verify it's there
SELECT * FROM admins;

-- Now we can safely enable RLS and create policies

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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

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
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- CUSTOMERS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage customers" ON customers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- ESTIMATES TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage estimates" ON estimates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- INVOICES TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage invoices" ON invoices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- ESTIMATE_ITEMS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage estimate_items" ON estimate_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- INVOICE_ITEMS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage invoice_items" ON invoice_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- JOBS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage jobs" ON jobs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- CUSTOMER_PHOTOS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage photos" ON customer_photos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- CONTACT_REQUEST TABLE POLICIES
-- ==========================================
-- Public can submit contact requests (for contact form on website)
CREATE POLICY "Public can submit contact requests" ON contact_request
  FOR INSERT
  WITH CHECK (true);

-- Admins can view and update contact requests
CREATE POLICY "Admins can manage contact requests" ON contact_request
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- ADMINS TABLE POLICIES
-- ==========================================
-- Admins can view the admin list (but not create/modify)
CREATE POLICY "Admins can view admin list" ON admins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- EMAIL_LOGS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can manage email logs" ON email_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- USERS TABLE POLICIES (Admin only)
-- ==========================================
CREATE POLICY "Admins can view users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN admins a ON u.email = a.email
      WHERE u.id = auth.uid()
    )
  );

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================
-- Check RLS status on all tables
SELECT
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'services', 'customers', 'estimates', 'invoices',
    'estimate_items', 'invoice_items', 'jobs', 'customer_photos',
    'contact_request', 'admins', 'email_logs', 'users'
  )
ORDER BY tablename;

-- List all policies
SELECT
  tablename,
  policyname,
  cmd as "Operation"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verify your admin email is in the table
SELECT id, email, created_at FROM admins;
