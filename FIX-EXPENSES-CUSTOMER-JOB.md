# Fix: Add Customer/Job Linking to Expenses

## Problem
Foreign key constraint error when adding customer_id and job_id to expenses table.

## Cause
The customers and jobs tables use INTEGER ids, not UUID.

## Solution

Run this SQL in your **Seal'n & Stripe'n Supabase**:

```sql
-- Add customer_id column (INTEGER to match customers table)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL;

-- Add job_id column (INTEGER to match jobs table)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_customer ON expenses(customer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_job ON expenses(job_id);
```

## Verify

After running the SQL:
1. Go to **Table Editor** → **expenses** table
2. Should see `customer_id` and `job_id` columns
3. Try adding an expense with a customer
4. Should work!

## Features

Now you can:
- ✅ Link expenses to specific customers
- ✅ Link expenses to specific jobs
- ✅ Track job-specific costs
- ✅ Filter expenses by customer/job
- ✅ Still create general expenses (no customer)
