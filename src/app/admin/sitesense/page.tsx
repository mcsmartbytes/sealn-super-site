'use client';

import { useState } from 'react';
import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

// Demo jobs for presentation
const DEMO_JOBS = [
  { id: 1, name: 'Westfield Mall - Main Lot', client: 'Westfield Property Management', status: 'In Progress', value: '$87,500', progress: 65 },
  { id: 2, name: "O'Hare Employee Lot C", client: 'Chicago Dept of Aviation', status: 'Scheduled', value: '$156,000', progress: 0 },
  { id: 3, name: 'Costco Distribution Center', client: 'Costco Wholesale', status: 'Completed', value: '$125,000', progress: 100 },
  { id: 4, name: 'Target Plaza - Front Lots', client: 'Target Corporation', status: 'In Progress', value: '$68,500', progress: 40 },
  { id: 5, name: 'Marriott Hotel Complex', client: 'Marriott International', status: 'Scheduled', value: '$45,000', progress: 0 },
];

export default function SiteSensePage() {
  return (
    <ProtectedRoute>
      <SiteSenseContent />
    </ProtectedRoute>
  );
}

function SiteSenseContent() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏗️</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SiteSense</h1>
              <p className="text-gray-600">Job management, crews, estimates & time tracking</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full font-medium">INTEGRATED</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active Jobs</p>
            <p className="text-2xl font-bold text-gray-800">8</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold text-emerald-600">$482K</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Crew Members</p>
            <p className="text-2xl font-bold text-gray-800">24</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold text-blue-600">94%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b flex">
            {['jobs', 'crews', 'equipment', 'time'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {activeTab === 'jobs' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">Active Jobs</h2>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                  + New Job
                </button>
              </div>
              <div className="space-y-3">
                {DEMO_JOBS.map(job => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">{job.name}</h3>
                        <p className="text-sm text-gray-500">{job.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{job.value}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{job.status}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${job.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crews Tab */}
          {activeTab === 'crews' && (
            <div className="p-6 text-center text-gray-500">
              <p className="text-4xl mb-3">👷</p>
              <p className="font-medium">Crew Management</p>
              <p className="text-sm">Manage your crews, assign to jobs, and track availability</p>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="p-6 text-center text-gray-500">
              <p className="text-4xl mb-3">🔧</p>
              <p className="font-medium">Equipment Tracking</p>
              <p className="text-sm">QR code scanning, maintenance schedules, and tool checkout</p>
            </div>
          )}

          {/* Time Tab */}
          {activeTab === 'time' && (
            <div className="p-6 text-center text-gray-500">
              <p className="text-4xl mb-3">⏱️</p>
              <p className="font-medium">Time Tracking</p>
              <p className="text-sm">Log crew hours, track labor costs by job</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-bold text-gray-800">Job Management</h3>
            <p className="text-sm text-gray-600">Track all projects in one place</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">👷</div>
            <h3 className="font-bold text-gray-800">Crew Tracking</h3>
            <p className="text-sm text-gray-600">Manage crews and subcontractors</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-bold text-gray-800">Equipment</h3>
            <p className="text-sm text-gray-600">QR code tool tracking</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-bold text-gray-800">Estimates</h3>
            <p className="text-sm text-gray-600">Create professional bids</p>
          </div>
        </div>
      </div>
    </div>
  );
}
