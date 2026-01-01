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

// Demo data for presentation mode
const DEMO_STATS = {
  totalCustomers: 24,
  totalEstimates: 18,
  totalInvoices: 32,
  pendingInvoices: 5,
  paidInvoices: 27
};

const DEMO_CUSTOMERS = [
  { id: '1', name: 'Westfield Property Management', email: 'facilities@westfield.com', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', name: 'Chicago Dept of Aviation', email: 'contracts@flychicago.com', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', name: 'Costco Wholesale', email: 'facilities@costco.com', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', name: 'Target Corporation', email: 'vendorpay@target.com', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', name: 'Marriott International', email: 'facilities@marriott.com', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
];

const DEMO_ESTIMATES = [
  { id: 'EST-001', total_amount: 87500, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-002', total_amount: 156000, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-003', total_amount: 68500, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-004', total_amount: 45000, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-005', total_amount: 215000, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

const DEMO_INVOICES = [
  { id: 'INV-047', total_amount: 125000, status: 'paid', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'INV-052', total_amount: 43750, status: 'pending', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'INV-051', total_amount: 22500, status: 'pending', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'INV-046', total_amount: 78000, status: 'paid', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'INV-045', total_amount: 34250, status: 'paid', created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
];

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
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
    // Check for demo mode first
    const demoSession = localStorage.getItem('demoSession') === 'true';
    setIsDemoMode(demoSession);

    if (demoSession) {
      // Use demo data
      setUser({ email: 'demo@sealn.com' });
      setStats(DEMO_STATS);
      setRecentCustomers(DEMO_CUSTOMERS);
      setRecentEstimates(DEMO_ESTIMATES);
      setRecentInvoices(DEMO_INVOICES);
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  async function fetchData() {
    // Check if supabase is available
    if (!supabase) {
      router.push('/admin/login');
      return;
    }

    // Get user
    try {
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
    } catch (err) {
      console.error('Error fetching data:', err);
    }

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

        {/* Integrated Business Suite */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-dark rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Integrated Business Suite</h2>
                <p className="text-gray-300 text-sm">One login, seamless access to all tools</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full font-semibold">INTEGRATED</span>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">STANDALONE</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* SiteSense */}
            <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-emerald-500">
              <div className="text-3xl mb-2">🏗️</div>
              <h3 className="font-bold text-lg mb-1 text-brand-navy">SiteSense</h3>
              <p className="text-gray-600 text-xs mb-3">
                Job management, crews, estimates, time tracking
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded">Jobs</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Estimates</span>
              </div>
              <button
                onClick={() => router.push('/admin/sitesense')}
                className="w-full py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition text-sm"
              >
                Open App
              </button>
            </div>

            {/* CRM */}
            <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-blue-500">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-bold text-lg mb-1 text-brand-navy">CRM</h3>
              <p className="text-gray-600 text-xs mb-3">
                Contacts, companies, deals, sales pipeline
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Contacts</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">Pipeline</span>
              </div>
              <button
                onClick={() => router.push('/admin/crm')}
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition text-sm"
              >
                Open App
              </button>
            </div>

            {/* Expenses */}
            <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-purple-500">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-lg mb-1 text-brand-navy">Expenses</h3>
              <p className="text-gray-600 text-xs mb-3">
                Receipt OCR, mileage, tax reports
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">OCR</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Mileage</span>
              </div>
              <button
                onClick={() => router.push('/admin/expense-tracker')}
                className="w-full py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition text-sm"
              >
                Open App
              </button>
            </div>

            {/* Books */}
            <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-indigo-500">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-bold text-lg mb-1 text-brand-navy">Books</h3>
              <p className="text-gray-600 text-xs mb-3">
                Invoicing, bills, accounting reports
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">Invoices</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">Reports</span>
              </div>
              <button
                onClick={() => router.push('/admin/books')}
                className="w-full py-2 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 transition text-sm"
              >
                Open App
              </button>
            </div>

            {/* Area Helper */}
            <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-brand-gold">
              <div className="text-3xl mb-2">🗺️</div>
              <h3 className="font-bold text-lg mb-1 text-brand-navy">Area Helper</h3>
              <p className="text-gray-600 text-xs mb-3">
                Satellite mapping, area calculations
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Maps</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">Calc</span>
              </div>
              <button
                onClick={() => router.push('/admin/area-helper')}
                className="w-full py-2 bg-brand-gold text-brand-dark font-semibold rounded hover:bg-yellow-500 transition text-sm"
              >
                Open App
              </button>
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
