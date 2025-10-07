# Expense Tracker Setup Guide

## Overview

Your admin panel now includes a comprehensive expense tracking system for managing business expenses.

## ✅ What's Included

### Features:
- **Full CRUD Operations** - Create, Read, Update, Delete expenses
- **Category Management** - 11 predefined business categories
- **Payment Tracking** - Track payment methods (Cash, Check, Credit Card, etc.)
- **Date-based Logging** - Record when expenses occurred
- **Dashboard Statistics** - Total expenses, monthly total, count, and average
- **Category Filtering** - Filter by category with real-time totals
- **Notes & Descriptions** - Detailed expense documentation
- **Inline Editing** - Edit expenses directly from the table view

### Categories Available:
1. Fuel
2. Materials
3. Equipment
4. Labor
5. Vehicle Maintenance
6. Insurance
7. Supplies
8. Marketing
9. Office
10. Utilities
11. Other

### Payment Methods:
- Cash
- Check
- Credit Card
- Debit Card
- Bank Transfer

## 📋 Setup Instructions

### Step 1: Create the Expenses Table

Run the following SQL in your Supabase SQL Editor:

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Add trigger for updated_at
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for now (consistent with other tables in the project)
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
```

Or simply run the `expenses-schema.sql` file located in the project root.

### Step 2: Access the Expense Tracker

1. Log in to your admin panel
2. Click **"Expenses"** in the navigation menu
3. You'll see the expense tracker dashboard

## 📊 How to Use

### Adding an Expense:

1. Click **"+ Add Expense"** button
2. Fill in the form:
   - **Date**: When the expense occurred
   - **Category**: Select from the dropdown
   - **Description**: What was purchased/paid for
   - **Amount**: Dollar amount (e.g., 45.50)
   - **Payment Method**: How you paid
   - **Notes**: Any additional details (optional)
3. Click **"Add Expense"**

### Editing an Expense:

1. Find the expense in the table
2. Click **"✏️ Edit"**
3. Update the fields
4. Click **"Update Expense"**

### Deleting an Expense:

1. Find the expense in the table
2. Click **"🗑️ Delete"**
3. Confirm deletion

### Filtering by Category:

- Click any category button at the top
- The table will filter to show only that category
- Category buttons show the total amount spent in each category
- Click **"All"** to see all expenses

## 📈 Dashboard Statistics

The expense tracker displays four key metrics:

1. **Total Expenses** - Sum of all expenses
2. **This Month** - Total expenses for the current month
3. **Count** - Number of expense entries
4. **Avg Amount** - Average expense amount

## 🎨 Professional Design

The expense tracker features:
- Clean, modern interface
- Color-coded categories
- Responsive table layout
- Inline editing forms
- Stats dashboard
- Hover effects and transitions
- Mobile-friendly design

## 🔮 Future Enhancements

Consider adding:
- [ ] Receipt photo uploads to Supabase Storage
- [ ] Export expenses to CSV/Excel
- [ ] Date range filtering
- [ ] Monthly/yearly reports
- [ ] Expense charts and graphs
- [ ] Budget tracking and alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Tax category tagging
- [ ] Mileage tracking integration

## 📍 File Locations

- **Admin Page**: `src/app/admin/expenses/page.tsx`
- **Database Schema**: `expenses-schema.sql`
- **Navigation Link**: `src/components/AdminNav.tsx` (line 35-37)

## 🔗 Navigation

The "Expenses" link appears in your admin navigation between:
- Inquiries
- **Expenses** ← New
- Services

## 💡 Tips

1. **Be Consistent**: Use the same category names to maintain organized records
2. **Add Notes**: Include vendor names, invoice numbers, or project references
3. **Review Regularly**: Check your monthly expenses to track spending patterns
4. **Receipt URLs**: While not required now, consider adding receipt photo uploads in the future

## 🐛 Troubleshooting

### "Failed to load expenses"
- Check that the expenses table was created in Supabase
- Verify your Supabase connection in `.env.local`

### Expenses not saving
- Check browser console for errors
- Verify all required fields are filled
- Ensure amount is a valid number

### Table not showing
- Refresh the page
- Check if there are any expenses in the database
- Run: `SELECT COUNT(*) FROM expenses;` in Supabase SQL Editor

---

**You're all set! 🎉** Start tracking your business expenses with your new expense tracker.
