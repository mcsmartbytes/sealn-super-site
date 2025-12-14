'use client';

import { useState } from 'react';
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">CRM</h1>
                <p className="text-gray-600">
                  Complete customer relationship management - contacts, companies, deals, and pipeline tracking.
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
                  href="https://crm-made-easy.vercel.app/"
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
            <div className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <p className="font-semibold">Full CRM System</p>
                  <p className="text-sm text-blue-100 mt-1">
                    Manage contacts, companies, and deals with a visual pipeline. Track your entire sales process from lead to close.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Header */}
        {isFullscreen && (
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <span className="font-bold text-lg">CRM Made Easy</span>
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-semibold">INTEGRATED</span>
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
            src="https://crm-made-easy.vercel.app/"
            className="w-full h-full border-0"
            title="CRM Made Easy"
          />
        </div>

        {/* Features Grid - Only show when not fullscreen */}
        {!isFullscreen && (
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-bold text-gray-800">Contact Management</h3>
              <p className="text-sm text-gray-600">Track leads, prospects, and customers with full details</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="font-bold text-gray-800">Companies</h3>
              <p className="text-sm text-gray-600">Organize contacts by company with industry tracking</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-bold text-gray-800">Sales Pipeline</h3>
              <p className="text-sm text-gray-600">Visual kanban board to track deal stages</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-gray-800">Dashboard</h3>
              <p className="text-sm text-gray-600">Quick stats and insights at a glance</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
