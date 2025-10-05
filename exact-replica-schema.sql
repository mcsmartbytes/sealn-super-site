-- EXACT REPLICA of Flask SQLite Database for Supabase PostgreSQL
-- This matches your original site structure exactly
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS estimate_items CASCADE;
DROP TABLE IF EXISTS customer_photos CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS contact_request CASCADE;

-- 1. Users table (for admin authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(120) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  company VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  job_name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  base_price NUMERIC(10, 2),
  unit VARCHAR(20) DEFAULT 'sq_ft',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Estimates table
CREATE TABLE estimates (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  service_type VARCHAR(50) NOT NULL,
  lot_size NUMERIC(10, 2),
  condition VARCHAR(20),
  estimated_cost NUMERIC(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  valid_until TIMESTAMP WITH TIME ZONE
);

-- 6. Invoices table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id INTEGER REFERENCES estimates(id) ON DELETE SET NULL,
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_date TIMESTAMP WITH TIME ZONE
);

-- 7. Email logs table
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  recipient VARCHAR(120) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  content TEXT,
  email_type VARCHAR(50),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  status VARCHAR(20) DEFAULT 'sent'
);

-- 8. Customer photos/media table
CREATE TABLE customer_photos (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id INTEGER REFERENCES estimates(id) ON DELETE SET NULL,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(10) NOT NULL,
  description TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Estimate items table
CREATE TABLE estimate_items (
  id SERIAL PRIMARY KEY,
  estimate_id INTEGER REFERENCES estimates(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  notes TEXT
);

-- 10. Invoice items table
CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  notes TEXT
);

-- 11. Contact request table (for website contact form)
CREATE TABLE contact_request (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_customer_photos_customer_id ON customer_photos(customer_id);
CREATE INDEX idx_estimate_items_estimate_id ON estimate_items(estimate_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_request ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users (admin access)
-- Customers
CREATE POLICY "Enable all for authenticated users" ON customers FOR ALL USING (auth.role() = 'authenticated');

-- Jobs
CREATE POLICY "Enable all for authenticated users" ON jobs FOR ALL USING (auth.role() = 'authenticated');

-- Services
CREATE POLICY "Enable all for authenticated users" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Estimates
CREATE POLICY "Enable all for authenticated users" ON estimates FOR ALL USING (auth.role() = 'authenticated');

-- Invoices
CREATE POLICY "Enable all for authenticated users" ON invoices FOR ALL USING (auth.role() = 'authenticated');

-- Email logs
CREATE POLICY "Enable all for authenticated users" ON email_logs FOR ALL USING (auth.role() = 'authenticated');

-- Customer photos
CREATE POLICY "Enable all for authenticated users" ON customer_photos FOR ALL USING (auth.role() = 'authenticated');

-- Estimate items
CREATE POLICY "Enable all for authenticated users" ON estimate_items FOR ALL USING (auth.role() = 'authenticated');

-- Invoice items
CREATE POLICY "Enable all for authenticated users" ON invoice_items FOR ALL USING (auth.role() = 'authenticated');

-- Contact request (public can insert, authenticated can read)
CREATE POLICY "Enable insert for all users" ON contact_request FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated users" ON contact_request FOR SELECT USING (auth.role() = 'authenticated');

-- Users table (only authenticated can read their own data)
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Insert default services
INSERT INTO services (name, category, base_price, unit, description, is_active) VALUES
  ('Sealcoating', 'Sealcoating', 0.25, 'sq_ft', 'Professional sealcoating to protect asphalt', true),
  ('Line Striping', 'Striping', 0.15, 'sq_ft', 'Line striping for parking lots', true),
  ('Crack Filling', 'Repair', 3.00, 'linear_ft', 'Hot rubber crack filling', true),
  ('Asphalt Repair', 'Repair', 5.00, 'sq_ft', 'Patch and repair damaged asphalt', true),
  ('Power Washing', 'Cleaning', 0.10, 'sq_ft', 'Pressure washing for surfaces', true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create admin user in Authentication > Users';
  RAISE NOTICE '2. Test the application';
END $$;
