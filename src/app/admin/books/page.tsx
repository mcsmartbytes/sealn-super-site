'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmbeddedAppFrame from '@/components/EmbeddedAppFrame';

export default function BooksPage() {
  return (
    <ProtectedRoute>
      <BooksContent />
    </ProtectedRoute>
  );
}

function BooksContent() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        <EmbeddedAppFrame
          appUrl="https://books-made-easy-app.vercel.app/dashboard"
          appName="Books Made Easy"
          appIcon="📚"
          standaloneUrl="https://books-made-easy-app.vercel.app/"
          description="Professional accounting software - invoices, bills, customers, vendors, and financial reports."
          headerColor="from-blue-600 to-indigo-700"
          fullscreenHeaderColor="bg-blue-700"
          permissions="geolocation; camera; microphone"
          integrationBanner={{
            icon: '🔗',
            title: 'Connected Ecosystem',
            items: [
              { icon: '💰', title: 'Expenses Made Easy', description: 'Expenses sync as bills automatically' },
              { icon: '🏗️', title: 'SiteSense', description: 'Estimates become invoices' },
              { icon: '📊', title: 'Unified Reports', description: 'See your complete financial picture' },
            ],
          }}
          features={[
            { icon: '🧾', title: 'Invoicing', description: 'Create and send professional invoices to customers' },
            { icon: '📋', title: 'Bill Tracking', description: 'Manage vendor bills and payment schedules' },
            { icon: '👥', title: 'Contacts', description: 'Organize customers and vendors in one place' },
            { icon: '📈', title: 'Reports', description: 'P&L, Balance Sheet, Cash Flow, and more' },
          ]}
          additionalFeatures={[
            { icon: '📒', title: 'Chart of Accounts', description: 'Full double-entry accounting system' },
            { icon: '💳', title: 'Payment Tracking', description: 'Track payments received and made' },
            { icon: '🏭', title: 'Industry Setup', description: 'Pre-configured for your business type' },
            { icon: '📉', title: 'AR/AP Aging', description: 'Track overdue invoices and bills' },
          ]}
        />
      </div>
    </div>
  );
}
