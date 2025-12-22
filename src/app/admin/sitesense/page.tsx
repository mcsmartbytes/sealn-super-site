'use client';

import { useState } from 'react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'container mx-auto px-6 py-8'}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">SiteSense</h1>
                <p className="text-gray-600">
                  Complete job management platform - track jobs, crews, equipment, estimates, and time all in one place.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Fullscreen
                </button>
                <a
                  href="https://sitesense-lilac.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg hover:bg-yellow-500 transition flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Standalone
                </a>
              </div>
            </div>

            {/* Integration Notice */}
            <div className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg p-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏗️</span>
                </div>
                <div>
                  <p className="font-semibold">Job Management Platform</p>
                  <p className="text-sm text-emerald-100 mt-1">
                    Manage your entire operation from one dashboard. Track jobs, crews, equipment, and generate professional estimates.
                    Available as a premium integration for your business website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Header */}
        {isFullscreen && (
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏗️</span>
              <span className="font-bold text-lg">SiteSense</span>
              <span className="px-2 py-1 bg-brand-gold text-brand-dark text-xs rounded font-semibold">INTEGRATED</span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Fullscreen
            </button>
          </div>
        )}

        {/* Iframe Container */}
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isFullscreen ? 'h-[calc(100vh-56px)]' : 'h-[800px]'}`}>
          <iframe
            src="https://sitesense-lilac.vercel.app/"
            className="w-full h-full border-0"
            title="SiteSense"
            allow="geolocation; camera; microphone"
          />
        </div>

        {/* Features Grid - Only show when not fullscreen */}
        {!isFullscreen && (
          <>
            {/* Key Features Banner */}
            <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚀</span>
                <h3 className="text-lg font-bold">Powerful Features for Contractors</h3>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">📋</div>
                  <h4 className="font-semibold text-sm">Job Management</h4>
                  <p className="text-xs text-emerald-200">Track all your projects in one place</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">👷</div>
                  <h4 className="font-semibold text-sm">Crew Tracking</h4>
                  <p className="text-xs text-emerald-200">Manage crews and subcontractors</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">🔧</div>
                  <h4 className="font-semibold text-sm">Equipment</h4>
                  <p className="text-xs text-emerald-200">QR code tool tracking system</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">📄</div>
                  <h4 className="font-semibold text-sm">Estimates</h4>
                  <p className="text-xs text-emerald-200">Create and send professional bids</p>
                </div>
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="mt-6 grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🏠</div>
                <h3 className="font-bold text-gray-800">Property Management</h3>
                <p className="text-sm text-gray-600">Track properties, units, tenants, and work orders</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">⏱️</div>
                <h3 className="font-bold text-gray-800">Time Tracking</h3>
                <p className="text-sm text-gray-600">Log crew hours and track labor costs</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-bold text-gray-800">Budget Tracking</h3>
                <p className="text-sm text-gray-600">Manage cost codes and project budgets</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold text-gray-800">Reports</h3>
                <p className="text-sm text-gray-600">Comprehensive business analytics</p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-4 grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🧾</div>
                <h3 className="font-bold text-gray-800">Receipt OCR</h3>
                <p className="text-sm text-gray-600">Scan and auto-extract receipt data</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🚗</div>
                <h3 className="font-bold text-gray-800">Mileage Tracking</h3>
                <p className="text-sm text-gray-600">GPS-based trip logging for tax deductions</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-bold text-gray-800">Bid Packages</h3>
                <p className="text-sm text-gray-600">Create detailed bid documents</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="font-bold text-gray-800">Task Management</h3>
                <p className="text-sm text-gray-600">Keep your team organized with todos</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
