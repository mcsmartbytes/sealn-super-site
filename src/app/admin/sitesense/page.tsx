'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmbeddedAppFrame from '@/components/EmbeddedAppFrame';

export default function SiteSensePage() {
  return (
    <ProtectedRoute>
      <SiteSenseContent />
    </ProtectedRoute>
  );
}

function SiteSenseContent() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        <EmbeddedAppFrame
          appUrl="https://sitesense-lilac.vercel.app/dashboard"
          appName="SiteSense"
          appIcon="🏗️"
          standaloneUrl="https://sitesense-lilac.vercel.app/"
          description="Complete job management platform - track jobs, crews, equipment, estimates, and time all in one place."
          headerColor="from-emerald-600 to-teal-700"
          fullscreenHeaderColor="bg-emerald-700"
          permissions="geolocation; camera; microphone"
          integrationBanner={{
            icon: '🚀',
            title: 'Powerful Features for Contractors',
            items: [
              { icon: '📋', title: 'Job Management', description: 'Track all your projects in one place' },
              { icon: '👷', title: 'Crew Tracking', description: 'Manage crews and subcontractors' },
              { icon: '🔧', title: 'Equipment', description: 'QR code tool tracking system' },
              { icon: '📄', title: 'Estimates', description: 'Create and send professional bids' },
            ],
          }}
          features={[
            { icon: '🏠', title: 'Property Management', description: 'Track properties, units, tenants, and work orders' },
            { icon: '⏱️', title: 'Time Tracking', description: 'Log crew hours and track labor costs' },
            { icon: '💰', title: 'Budget Tracking', description: 'Manage cost codes and project budgets' },
            { icon: '📊', title: 'Reports', description: 'Comprehensive business analytics' },
          ]}
          additionalFeatures={[
            { icon: '🧾', title: 'Receipt OCR', description: 'Scan and auto-extract receipt data' },
            { icon: '🚗', title: 'Mileage Tracking', description: 'GPS-based trip logging for tax deductions' },
            { icon: '📝', title: 'Bid Packages', description: 'Create detailed bid documents' },
            { icon: '✅', title: 'Task Management', description: 'Keep your team organized with todos' },
          ]}
        />
      </div>
    </div>
  );
}
