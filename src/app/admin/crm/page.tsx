'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmbeddedAppFrame from '@/components/EmbeddedAppFrame';

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <CRMContent />
    </ProtectedRoute>
  );
}

function CRMContent() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        <EmbeddedAppFrame
          appUrl="https://crm-made-easy.vercel.app/"
          appName="CRM Made Easy"
          appIcon="👥"
          standaloneUrl="https://crm-made-easy.vercel.app/"
          description="Complete customer relationship management - contacts, companies, deals, and pipeline tracking."
          headerColor="from-blue-600 to-blue-800"
          fullscreenHeaderColor="bg-slate-900"
          integrationBanner={{
            icon: '🎯',
            title: 'Full Sales Pipeline Management',
            items: [
              { icon: '👤', title: 'Contacts', description: 'Track leads and customers' },
              { icon: '🏢', title: 'Companies', description: 'Organize by business' },
              { icon: '📈', title: 'Deals', description: 'Visual pipeline board' },
              { icon: '📊', title: 'Analytics', description: 'Sales performance insights' },
            ],
          }}
          features={[
            { icon: '👤', title: 'Contact Management', description: 'Track leads, prospects, and customers with full details' },
            { icon: '🏢', title: 'Companies', description: 'Organize contacts by company with industry tracking' },
            { icon: '📈', title: 'Sales Pipeline', description: 'Visual kanban board to track deal stages' },
            { icon: '📊', title: 'Dashboard', description: 'Quick stats and insights at a glance' },
          ]}
          additionalFeatures={[
            { icon: '🏷️', title: 'Tags & Filters', description: 'Organize and find contacts quickly' },
            { icon: '📝', title: 'Activities', description: 'Track calls, emails, and meetings' },
            { icon: '✅', title: 'Tasks', description: 'Follow-up reminders and to-dos' },
            { icon: '💵', title: 'Deal Values', description: 'Track revenue in your pipeline' },
          ]}
        />
      </div>
    </div>
  );
}
