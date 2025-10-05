-- Update contact_request table to work with our Contact component
-- This ensures the existing contact_request table can receive form submissions

-- If your contact_request table structure doesn't match, run this:
-- (Check your existing columns first - you might already have these)

-- Add any missing columns (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='contact_request' AND column_name='service') THEN
        ALTER TABLE contact_request ADD COLUMN service VARCHAR(100);
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE contact_request ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for the contact form)
DROP POLICY IF EXISTS "Enable insert for all users" ON contact_request;
CREATE POLICY "Enable insert for all users" ON contact_request
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contact_request;
CREATE POLICY "Enable read access for authenticated users" ON contact_request
  FOR SELECT USING (auth.role() = 'authenticated');
