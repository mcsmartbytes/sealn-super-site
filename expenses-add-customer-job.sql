-- Migration: Add customer_id and job_id to existing expenses table
-- Run this in your Supabase SQL Editor

-- Add customer_id column (INTEGER to match customers table)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL;

-- Add job_id column (INTEGER to match jobs table)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_customer ON expenses(customer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_job ON expenses(job_id);
