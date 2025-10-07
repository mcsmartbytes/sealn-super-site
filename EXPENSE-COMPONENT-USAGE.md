# Expense Tracker Component - Usage Guide

The expense tracker is now a **reusable component** that you can use anywhere in your app!

## 📦 Component Location

`src/components/expenses/ExpenseTracker.tsx`

## 🎯 Basic Usage

```tsx
import ExpenseTracker from "@/components/expenses/ExpenseTracker";

export default function MyPage() {
  return (
    <div>
      <ExpenseTracker />
    </div>
  );
}
```

## ⚙️ Props (All Optional)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showHeader` | boolean | `true` | Show the header with title and "Add Expense" button |
| `showStats` | boolean | `true` | Show the statistics cards (Total, This Month, Count, Avg) |
| `showFilters` | boolean | `true` | Show the category filter buttons |
| `maxHeight` | string | `undefined` | Set max height for scrollable table (e.g., "500px") |
| `onExpenseAdded` | function | `undefined` | Callback when expense is added |
| `onExpenseUpdated` | function | `undefined` | Callback when expense is updated |
| `onExpenseDeleted` | function | `undefined` | Callback when expense is deleted |

## 📋 Usage Examples

### 1. Full Feature (Default)
Shows everything - header, stats, filters, and table.

```tsx
<ExpenseTracker />
```

### 2. Compact Widget (No Header)
Perfect for dashboards or embedded views.

```tsx
<ExpenseTracker
  showHeader={false}
  maxHeight="400px"
/>
```

### 3. Simple List (Stats Only)
Just the stats and table, no filters.

```tsx
<ExpenseTracker
  showHeader={false}
  showFilters={false}
/>
```

### 4. Minimal View (Table Only)
Just the expense table.

```tsx
<ExpenseTracker
  showHeader={false}
  showStats={false}
  showFilters={false}
  maxHeight="300px"
/>
```

### 5. With Callbacks
React to expense changes with custom logic.

```tsx
<ExpenseTracker
  onExpenseAdded={(expense) => {
    console.log("New expense added:", expense);
    // Refresh dashboard, send notification, etc.
  }}
  onExpenseUpdated={(expense) => {
    console.log("Expense updated:", expense);
  }}
  onExpenseDeleted={(id) => {
    console.log("Expense deleted:", id);
  }}
/>
```

## 🎨 Use Cases

### Dashboard Widget
```tsx
// src/app/admin/page.tsx (Dashboard)
export default function Dashboard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <ExpenseTracker
          showHeader={false}
          showFilters={false}
          maxHeight="400px"
        />
      </div>
      {/* Other dashboard widgets */}
    </div>
  );
}
```

### Modal/Dialog
```tsx
// Inside a modal component
<Dialog>
  <DialogContent>
    <ExpenseTracker
      showHeader={true}
      showStats={false}
      maxHeight="500px"
    />
  </DialogContent>
</Dialog>
```

### Customer-Specific Expenses
You could extend the component to filter by customer:

```tsx
// Future enhancement - filter by customer
<ExpenseTracker
  customerId={customer.id}
  showHeader={true}
/>
```

### Sidebar Panel
```tsx
// Right sidebar with expenses
<aside className="w-80 bg-white shadow-lg p-4">
  <ExpenseTracker
    showHeader={false}
    showStats={true}
    showFilters={false}
    maxHeight="calc(100vh - 200px)"
  />
</aside>
```

## 🔧 Customization

### Styling
The component uses Tailwind CSS classes. You can wrap it in a custom container:

```tsx
<div className="custom-expense-container">
  <ExpenseTracker />
</div>
```

### Custom Categories
Edit the categories in `src/components/expenses/ExpenseTracker.tsx`:

```tsx
const EXPENSE_CATEGORIES = [
  "Your Custom Category 1",
  "Your Custom Category 2",
  // ...
];
```

### Custom Payment Methods
Edit the payment methods in the same file:

```tsx
const PAYMENT_METHODS = [
  "Your Payment Method 1",
  "Your Payment Method 2",
  // ...
];
```

## 🧩 Integration with Other Components

### With Customer Profile
```tsx
// src/app/admin/customers/[id]/page.tsx
export default function CustomerProfile({ params }: any) {
  return (
    <div>
      <CustomerDetails id={params.id} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer Expenses</h2>
        <ExpenseTracker
          showHeader={false}
          // Could filter by customer in future version
        />
      </div>
    </div>
  );
}
```

### With Invoice Creation
```tsx
// When creating invoices, show related expenses
<div className="grid md:grid-cols-2 gap-6">
  <div>
    <h3>New Invoice</h3>
    <InvoiceForm />
  </div>

  <div>
    <h3>Related Expenses</h3>
    <ExpenseTracker
      showHeader={false}
      showStats={false}
      maxHeight="600px"
    />
  </div>
</div>
```

## 📊 Example: Dashboard Integration

```tsx
"use client";

import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import ExpenseTracker from "@/components/expenses/ExpenseTracker";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              {/* Your recent activity content */}
            </div>

            {/* Right: Recent Expenses */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
              <ExpenseTracker
                showHeader={false}
                showFilters={false}
                maxHeight="400px"
                onExpenseAdded={(expense) => {
                  // Show notification or refresh dashboard
                  alert(`New expense added: $${expense.amount}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

## 🚀 Benefits of Component Approach

1. **Reusable** - Use in multiple pages
2. **Configurable** - Show/hide features as needed
3. **Responsive** - Works anywhere with callbacks
4. **Maintainable** - Update once, works everywhere
5. **Flexible** - Easy to extend and customize

---

Now you can drop the expense tracker anywhere in your app! 🎉
