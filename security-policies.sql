-- Security Policies for Seal'n & Stripe'n Specialist Database
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
-- Only authenticated users (admins) can view/modify data

-- Customers table policies
CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete customers" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Services table policies
CREATE POLICY "Admins can view all services" ON services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update services" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete services" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Estimates table policies
CREATE POLICY "Admins can view all estimates" ON estimates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert estimates" ON estimates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update estimates" ON estimates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete estimates" ON estimates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Estimate items table policies
CREATE POLICY "Admins can view all estimate_items" ON estimate_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert estimate_items" ON estimate_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update estimate_items" ON estimate_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete estimate_items" ON estimate_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Invoices table policies
CREATE POLICY "Admins can view all invoices" ON invoices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert invoices" ON invoices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update invoices" ON invoices
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete invoices" ON invoices
  FOR DELETE USING (auth.role() = 'authenticated');

-- Invoice items table policies
CREATE POLICY "Admins can view all invoice_items" ON invoice_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert invoice_items" ON invoice_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update invoice_items" ON invoice_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete invoice_items" ON invoice_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Contact submissions - special policy (public can insert, only admins can view)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contact submissions" ON contact_submissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add audit logging trigger for sensitive operations
CREATE OR REPLACE FUNCTION log_customer_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, record_id, action, user_id, changed_at)
  VALUES (TG_TABLE_NAME, NEW.id, TG_OP, auth.uid(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON audit_log
  FOR SELECT USING (auth.role() = 'authenticated');

-- Add triggers for audit logging
CREATE TRIGGER customer_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION log_customer_changes();

-- Encrypt sensitive data at rest (Supabase handles this automatically with AES-256)
-- But we can add a note in comments
COMMENT ON COLUMN customers.email IS 'PII - Encrypted at rest';
COMMENT ON COLUMN customers.phone IS 'PII - Encrypted at rest';
COMMENT ON COLUMN customers.address IS 'PII - Encrypted at rest';
