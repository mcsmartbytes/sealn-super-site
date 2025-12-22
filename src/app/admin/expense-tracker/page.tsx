'use client';

import { useState } from 'react';
import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ExpenseTrackerPage() {
  return (
    <ProtectedRoute>
      <ExpenseTrackerContent />
    </ProtectedRoute>
  );
}

function ExpenseTrackerContent() {
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
                <p className="text-gray-600">
                  Integrated expense management - track expenses, mileage, receipts, and generate tax reports.
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
                  href="https://expenses-made-easy-opal.vercel.app/"
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
            <div className="mt-4 bg-gradient-to-r from-brand-navy to-brand-dark rounded-lg p-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <p className="font-semibold">Seamless Integration Demo</p>
                  <p className="text-sm text-gray-300 mt-1">
                    This demonstrates how we can integrate any of our standalone applications directly into your existing website.
                    Your team stays in one place while accessing powerful tools. Available as a premium integration service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Header */}
        {isFullscreen && (
          <div className="bg-brand-navy text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <span className="font-bold text-lg">Expense Tracker</span>
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
            src="https://expenses-made-easy-opal.vercel.app/expenses/dashboard"
            className="w-full h-full border-0"
            title="Expense Tracker"
            allow="geolocation; camera; microphone"
          />
        </div>

        {/* Features Grid - Only show when not fullscreen */}
        {!isFullscreen && (
          <>
            {/* New Features Banner */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg font-bold">New Features Just Added!</h3>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">🧠</div>
                  <h4 className="font-semibold text-sm">Money Memory</h4>
                  <p className="text-xs text-purple-200">Remember past prices and find savings</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">🏆</div>
                  <h4 className="font-semibold text-sm">Gamification</h4>
                  <p className="text-xs text-purple-200">XP, levels, achievements & streaks</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">💡</div>
                  <h4 className="font-semibold text-sm">Smart Insights</h4>
                  <p className="text-xs text-purple-200">Actionable spending alerts</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl mb-1">💰</div>
                  <h4 className="font-semibold text-sm">Mileage → Tax</h4>
                  <p className="text-xs text-purple-200">See tax deductions per trip</p>
                </div>
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="mt-6 grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🧾</div>
                <h3 className="font-bold text-gray-800">Receipt OCR</h3>
                <p className="text-sm text-gray-600">Scan receipts with AI to auto-fill expense details</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🚗</div>
                <h3 className="font-bold text-gray-800">Mileage Tracking</h3>
                <p className="text-sm text-gray-600">GPS-based auto-tracking for business trips</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-bold text-gray-800">Recurring Expenses</h3>
                <p className="text-sm text-gray-600">Auto-generate monthly subscriptions and bills</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold text-gray-800">Tax Reports</h3>
                <p className="text-sm text-gray-600">Schedule C breakdown for tax season</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
