'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SiteSensePage() {
  return (
    <ProtectedRoute>
      <SiteSenseContent />
    </ProtectedRoute>
  );
}

function SiteSenseContent() {
  // Demo data
  const jobs = [
    { id: 1, name: 'Walmart - Main Lot', status: 'In Progress', crew: 'Team Alpha', date: '2026-01-08', sqft: 45000 },
    { id: 2, name: 'Target Plaza', status: 'Scheduled', crew: 'Team Beta', date: '2026-01-10', sqft: 32000 },
    { id: 3, name: 'CVS Pharmacy', status: 'Completed', crew: 'Team Alpha', date: '2026-01-05', sqft: 8500 },
    { id: 4, name: 'Home Depot', status: 'Quote Sent', crew: 'Unassigned', date: '2026-01-15', sqft: 78000 },
  ];

  const stats = {
    activeJobs: 12,
    completedThisMonth: 8,
    revenue: 47250,
    scheduledHours: 156,
  };

  const statusColors: Record<string, string> = {
    'In Progress': 'bg-blue-100 text-blue-800',
    'Scheduled': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Quote Sent': 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">SiteSense</h1>
            <p className="text-gray-600">Job tracking & crew management</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Demo Mode
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Active Jobs</p>
            <p className="text-3xl font-bold text-blue-600">{stats.activeJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Completed This Month</p>
            <p className="text-3xl font-bold text-green-600">{stats.completedThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Revenue (MTD)</p>
            <p className="text-3xl font-bold text-gray-800">${stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Scheduled Hours</p>
            <p className="text-3xl font-bold text-purple-600">{stats.scheduledHours}</p>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Jobs</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              + New Job
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crew</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sq Ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{job.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{job.crew}</td>
                  <td className="px-6 py-4 text-gray-600">{job.date}</td>
                  <td className="px-6 py-4 text-gray-600">{job.sqft.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow p-6 text-white">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold text-lg mb-1">Job Management</h3>
            <p className="text-blue-100 text-sm">Track all projects from quote to completion</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow p-6 text-white">
            <div className="text-3xl mb-2">👷</div>
            <h3 className="font-bold text-lg mb-1">Crew Scheduling</h3>
            <p className="text-green-100 text-sm">Assign teams and manage availability</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow p-6 text-white">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-lg mb-1">Real-time Analytics</h3>
            <p className="text-purple-100 text-sm">Track performance and profitability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
