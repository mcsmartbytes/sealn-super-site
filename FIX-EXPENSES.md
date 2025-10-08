# Fix: Expenses Not Creating

## Problem
When trying to create an expense, you get an error that it wasn't created.

## Cause
The `expenses` table doesn't exist in your Seal'n & Stripe'n Supabase database yet.

## Solution

### Run SQL Script in Supabase

1. Go to your **Seal'n & Stripe'n Supabase project**:
   - URL: https://oloskddnlvqjmxrlehpn.supabase.co

2. Open **SQL Editor**

3. Copy and paste this SQL:

```sql
-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Add trigger for updated_at
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS (consistent with other tables)
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
```

4. Click **"Run"**

5. ✅ Done! Now try creating an expense again.

## Verify

After running the SQL:
1. Go to **Table Editor** in Supabase
2. You should see the `expenses` table
3. Try creating an expense in your admin panel
4. It should work now!
