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
          appUrl="https://sitesense-lilac.vercel.app"
          appName="SiteSense"
          appIcon="📍"
          standaloneUrl="https://sitesense-lilac.vercel.app"
          description="Professional parking lot management - jobs, quotes, scheduling, crew management, and more."
          headerColor="from-blue-900 to-slate-800"
          fullscreenHeaderColor="bg-blue-900"
          features={[
            { icon: '📋', title: 'Job Management', description: 'Track all projects in one place' },
            { icon: '💰', title: 'Quotes', description: 'Create professional estimates' },
            { icon: '📅', title: 'Scheduling', description: 'Crew and job scheduling' },
            { icon: '👷', title: 'Crew Management', description: 'Manage your team' },
          ]}
          additionalFeatures={[
            { icon: '👥', title: 'CRM', description: 'Customer relationship management' },
            { icon: '📊', title: 'Dashboard', description: 'Real-time business insights' },
            { icon: '🗺️', title: 'Area Calculator', description: 'Measure parking lots' },
            { icon: '📱', title: 'Mobile PWA', description: 'Install as mobile app' },
          ]}
          integrationBanner={{
            icon: '🚀',
            title: 'Made Easy Suite - Sealing & Striping Edition',
            items: [
              { icon: '✅', title: 'Industry-Specific', description: 'Built for parking lot contractors' },
              { icon: '🔗', title: 'Fully Integrated', description: 'Seamless authentication' },
              { icon: '📱', title: 'PWA Ready', description: 'Install on any device' },
            ]
          }}
        />
      </div>
    </div>
  );
}
