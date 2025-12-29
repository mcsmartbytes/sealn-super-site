'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmbeddedAppFrame from '@/components/EmbeddedAppFrame';

export default function ExpenseTrackerPage() {
  return (
    <ProtectedRoute>
      <ExpenseTrackerContent />
    </ProtectedRoute>
  );
}

function ExpenseTrackerContent() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        <EmbeddedAppFrame
          appUrl="https://expenses-made-easy-opal.vercel.app/expenses/dashboard"
          appName="Expenses Made Easy"
          appIcon="💰"
          standaloneUrl="https://expenses-made-easy-opal.vercel.app/"
          description="Integrated expense management - track expenses, mileage, receipts, and generate tax reports."
          headerColor="from-purple-600 to-indigo-600"
          fullscreenHeaderColor="bg-slate-900"
          permissions="geolocation; camera; microphone"
          integrationBanner={{
            icon: '✨',
            title: 'Smart Expense Tracking Features',
            items: [
              { icon: '🧠', title: 'Money Memory', description: 'Remember past prices and find savings' },
              { icon: '🏆', title: 'Gamification', description: 'XP, levels, achievements & streaks' },
              { icon: '💡', title: 'Smart Insights', description: 'Actionable spending alerts' },
              { icon: '💰', title: 'Mileage → Tax', description: 'See tax deductions per trip' },
            ],
          }}
          features={[
            { icon: '🧾', title: 'Receipt OCR', description: 'Scan receipts with AI to auto-fill expense details' },
            { icon: '🚗', title: 'Mileage Tracking', description: 'GPS-based auto-tracking for business trips' },
            { icon: '🔄', title: 'Recurring Expenses', description: 'Auto-generate monthly subscriptions and bills' },
            { icon: '📊', title: 'Tax Reports', description: 'Schedule C breakdown for tax season' },
          ]}
          additionalFeatures={[
            { icon: '📈', title: 'Budget Tracking', description: 'Set spending limits by category' },
            { icon: '🏷️', title: 'Categories', description: 'Industry-specific expense categories' },
            { icon: '📱', title: 'PWA Support', description: 'Install on mobile like a native app' },
            { icon: '💼', title: 'Business/Personal', description: 'Toggle between expense modes' },
          ]}
        />
      </div>
    </div>
  );
}
