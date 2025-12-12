'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalEstimates: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
    paidInvoices: 0
  });
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [recentEstimates, setRecentEstimates] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      router.push('/admin/login');
      return;
    }
    setUser(user);

    // Fetch all data in parallel
    const [customers, estimates, invoices] = await Promise.all([
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('estimates').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('created_at', { ascending: false })
    ]);

    // Set stats
    setStats({
      totalCustomers: customers.data?.length || 0,
      totalEstimates: estimates.data?.length || 0,
      totalInvoices: invoices.data?.length || 0,
      pendingInvoices: invoices.data?.filter(i => i.status === 'pending').length || 0,
      paidInvoices: invoices.data?.filter(i => i.status === 'paid').length || 0
    });

    // Set recent data (last 5)
    setRecentCustomers(customers.data?.slice(0, 5) || []);
    setRecentEstimates(estimates.data?.slice(0, 5) || []);
    setRecentInvoices(invoices.data?.slice(0, 5) || []);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <AdminNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-xl text-brand-navy font-medium">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-brand-navy to-brand-dark rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Welcome, {user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-brand-navy hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Customers</p>
                <p className="text-3xl font-bold text-brand-navy mt-2">{stats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-brand-gold hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Estimates</p>
                <p className="text-3xl font-bold text-brand-navy mt-2">{stats.totalEstimates}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Invoices</p>
                <p className="text-3xl font-bold text-brand-navy mt-2">{stats.totalInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.paidInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-brand-navy mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <button
              onClick={() => router.push('/admin/customers')}
              className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <span>👤</span>
              <span>Add Customer</span>
            </button>
            <button
              onClick={() => router.push('/admin/estimates')}
              className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <span>📄</span>
              <span>New Estimate</span>
            </button>
            <button
              onClick={() => router.push('/admin/expense-tracker')}
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <span>💰</span>
              <span>Expenses</span>
            </button>
            <button
              onClick={() => router.push('/admin/calculator')}
              className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <span>🧮</span>
              <span>Calculator</span>
            </button>
            <button
              onClick={() => router.push('/admin/area-helper')}
              className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <span>🗺️</span>
              <span>Area Helper</span>
            </button>
          </div>
        </div>

        {/* Business Tools Showcase */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-dark rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">🛠️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Business Tools</h2>
              <p className="text-gray-300 text-sm">Professional applications we&apos;ve built</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Expense Tracker */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-brand-gold">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-xl mb-2 text-brand-navy">Expense Tracker</h3>
              <p className="text-gray-600 text-sm mb-4">
                Full-featured expense tracking with receipt OCR, mileage tracking, recurring expenses, and tax reports.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Receipt OCR</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Mileage GPS</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Tax Reports</span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push('/admin/expense-tracker')}
                  className="w-full py-2 bg-brand-gold text-brand-dark font-semibold rounded hover:bg-yellow-500 transition text-sm"
                >
                  Integrated Version
                </button>
                <a
                  href="https://expenses-made-easy-opal.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition text-sm text-center"
                >
                  Standalone App →
                </a>
              </div>
            </div>

            {/* Area Bid Helper */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-brand-gold">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-bold text-xl mb-2 text-brand-navy">Area Bid Helper</h3>
              <p className="text-gray-600 text-sm mb-4">
                Calculate parking lot areas using satellite imagery, generate accurate bids, and manage project estimates.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Satellite Maps</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Area Calc</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Bid Generator</span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push('/admin/area-helper')}
                  className="w-full py-2 bg-brand-gold text-brand-dark font-semibold rounded hover:bg-yellow-500 transition text-sm"
                >
                  Integrated Version
                </button>
                <a
                  href="https://area-bid-help.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition text-sm text-center"
                >
                  Standalone App →
                </a>
              </div>
            </div>

            {/* Calculator - Internal */}
            <div
              onClick={() => router.push('/admin/calculator')}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-purple-500 group cursor-pointer"
            >
              <div className="text-4xl mb-3">🧮</div>
              <h3 className="font-bold text-xl mb-2 text-brand-navy group-hover:text-purple-600 transition">Project Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">
                Calculate material costs, labor estimates, and project totals with our built-in calculator tool.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Materials</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Labor</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Totals</span>
              </div>
              <span className="text-purple-600 font-semibold text-sm flex items-center gap-1">
                Open Tool →
              </span>
            </div>

            {/* More Coming Soon */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-gray-600">
              <div className="text-4xl mb-3 opacity-50">🚀</div>
              <h3 className="font-bold text-xl mb-2 text-gray-400">More Coming Soon</h3>
              <p className="text-gray-500 text-sm mb-4">
                We&apos;re constantly building new tools to help streamline your business operations.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">Invoicing</span>
                <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">Scheduling</span>
                <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">CRM</span>
              </div>
              <span className="text-gray-500 font-semibold text-sm">
                Stay Tuned
              </span>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Customers */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-brand-navy">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-brand-navy">Recent Customers</h2>
              <button
                onClick={() => router.push('/admin/customers')}
                className="text-brand-navy hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {recentCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No customers yet</p>
            ) : (
              <div className="space-y-3">
                {recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => router.push(`/admin/customers/${customer.id}`)}
                    className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-semibold text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Estimates */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-brand-gold">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-brand-navy">Recent Estimates</h2>
              <button
                onClick={() => router.push('/admin/estimates')}
                className="text-brand-navy hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {recentEstimates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No estimates yet</p>
            ) : (
              <div className="space-y-3">
                {recentEstimates.map((estimate) => (
                  <div key={estimate.id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-semibold text-gray-800">Estimate #{estimate.id}</p>
                    <p className="text-lg font-bold text-green-600">
                      ${estimate.total_amount?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(estimate.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-brand-navy">Recent Invoices</h2>
              <button
                onClick={() => router.push('/admin/invoices')}
                className="text-brand-navy hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {recentInvoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-3 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">Invoice #{invoice.id}</p>
                        <p className="text-lg font-bold text-gray-800">
                          ${invoice.total_amount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
