'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <CRMContent />
    </ProtectedRoute>
  );
}

function CRMContent() {
  // Demo data
  const leads = [
    { id: 1, name: 'John Smith', company: 'ABC Properties', email: 'john@abc.com', phone: '(555) 123-4567', status: 'Hot', value: 15000, lastContact: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', company: 'Metro Mall', email: 'sarah@metro.com', phone: '(555) 234-5678', status: 'Warm', value: 28000, lastContact: '1 day ago' },
    { id: 3, name: 'Mike Davis', company: 'Davis & Sons', email: 'mike@davis.com', phone: '(555) 345-6789', status: 'New', value: 8500, lastContact: 'Just now' },
    { id: 4, name: 'Lisa Chen', company: 'Chen Enterprises', email: 'lisa@chen.com', phone: '(555) 456-7890', status: 'Cold', value: 45000, lastContact: '1 week ago' },
  ];

  const stats = {
    totalLeads: 47,
    hotLeads: 12,
    pipelineValue: 425000,
    conversionRate: 34,
  };

  const activities = [
    { type: 'call', text: 'Called John Smith about parking lot project', time: '2 hours ago' },
    { type: 'email', text: 'Sent quote to Metro Mall', time: '4 hours ago' },
    { type: 'meeting', text: 'Site visit scheduled with Davis & Sons', time: 'Tomorrow 10am' },
    { type: 'note', text: 'Chen Enterprises interested in annual contract', time: '2 days ago' },
  ];

  const statusColors: Record<string, string> = {
    'Hot': 'bg-red-100 text-red-800',
    'Warm': 'bg-orange-100 text-orange-800',
    'New': 'bg-blue-100 text-blue-800',
    'Cold': 'bg-gray-100 text-gray-800',
  };

  const activityIcons: Record<string, string> = {
    call: '📞',
    email: '📧',
    meeting: '📅',
    note: '📝',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">CRM Made Easy</h1>
            <p className="text-gray-600">Customer relationship management</p>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            Demo Mode
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalLeads}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Hot Leads</p>
            <p className="text-3xl font-bold text-red-600">{stats.hotLeads}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Pipeline Value</p>
            <p className="text-3xl font-bold text-green-600">${stats.pipelineValue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.conversionRate}%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Leads Table */}
          <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Active Leads</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                + Add Lead
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${lead.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {lead.lastContact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {activities.map((activity, idx) => (
                <div key={idx} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{activityIcons[activity.type]}</span>
                    <div>
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-bold mb-1">Contact Management</h3>
            <p className="text-indigo-100 text-sm">Organize all your contacts</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-bold mb-1">Sales Pipeline</h3>
            <p className="text-pink-100 text-sm">Track deals & opportunities</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">🔔</div>
            <h3 className="font-bold mb-1">Follow-up Reminders</h3>
            <p className="text-cyan-100 text-sm">Never miss a lead</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold mb-1">Reports</h3>
            <p className="text-amber-100 text-sm">Analyze your performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
