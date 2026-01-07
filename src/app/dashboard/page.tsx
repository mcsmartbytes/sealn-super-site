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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-x-hidden">
      <AdminNav />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-brand-navy to-brand-dark rounded-xl p-4 sm:p-6 shadow-lg">
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-300 truncate">Welcome, {user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 border-l-4 border-brand-navy hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Customers</p>
                <p className="text-xl sm:text-3xl font-bold text-brand-navy mt-1">{stats.totalCustomers}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 border-l-4 border-brand-gold hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Estimates</p>
                <p className="text-xl sm:text-3xl font-bold text-brand-navy mt-1">{stats.totalEstimates}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">📄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 border-l-4 border-indigo-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Invoices</p>
                <p className="text-xl sm:text-3xl font-bold text-brand-navy mt-1">{stats.totalInvoices}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Pending</p>
                <p className="text-xl sm:text-3xl font-bold text-orange-600 mt-1">{stats.pendingInvoices}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 border-l-4 border-green-500 hover:shadow-lg transition col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Paid</p>
                <p className="text-xl sm:text-3xl font-bold text-green-600 mt-1">{stats.paidInvoices}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-xl font-bold text-brand-navy mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/admin/customers')}
              className="p-2 sm:p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition"
            >
              <span className="text-lg sm:text-base">👤</span>
              <span className="text-[10px] sm:text-base">Customer</span>
            </button>
            <button
              onClick={() => router.push('/admin/estimates')}
              className="p-2 sm:p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition"
            >
              <span className="text-lg sm:text-base">📄</span>
              <span className="text-[10px] sm:text-base">Estimate</span>
            </button>
            <button
              onClick={() => router.push('/admin/expense-tracker')}
              className="p-2 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition"
            >
              <span className="text-lg sm:text-base">💰</span>
              <span className="text-[10px] sm:text-base">Expenses</span>
            </button>
            <button
              onClick={() => router.push('/admin/calculator')}
              className="p-2 sm:p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition col-span-1"
            >
              <span className="text-lg sm:text-base">🧮</span>
              <span className="text-[10px] sm:text-base">Calculator</span>
            </button>
            <button
              onClick={() => router.push('/admin/area-helper')}
              className="p-2 sm:p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition col-span-2 sm:col-span-1"
            >
              <span className="text-lg sm:text-base">🗺️</span>
              <span className="text-[10px] sm:text-base">Area</span>
            </button>
          </div>
        </div>

        {/* Integrated Business Suite */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-dark rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-xl sm:text-2xl">🚀</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-white">Business Suite</h2>
                <p className="text-gray-300 text-xs sm:text-sm">One login, all tools</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-500 text-white text-[10px] sm:text-xs rounded-full font-semibold">INTEGRATED</span>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-500 text-white text-[10px] sm:text-xs rounded-full font-semibold">STANDALONE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* SiteSense */}
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-emerald-500">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏗️</div>
              <h3 className="font-bold text-sm sm:text-lg mb-1 text-brand-navy">SiteSense</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 hidden sm:block">
                Job management, crews, estimates
              </p>
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 hidden sm:flex">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded">Jobs</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Estimates</span>
              </div>
              <button
                onClick={() => router.push('/admin/sitesense')}
                className="w-full py-1.5 sm:py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition text-xs sm:text-sm"
              >
                Open
              </button>
            </div>

            {/* CRM */}
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-blue-500">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">👥</div>
              <h3 className="font-bold text-sm sm:text-lg mb-1 text-brand-navy">CRM</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 hidden sm:block">
                Contacts, companies, deals
              </p>
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 hidden sm:flex">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Contacts</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">Pipeline</span>
              </div>
              <button
                onClick={() => router.push('/admin/crm')}
                className="w-full py-1.5 sm:py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition text-xs sm:text-sm"
              >
                Open
              </button>
            </div>

            {/* Expenses */}
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-purple-500">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💰</div>
              <h3 className="font-bold text-sm sm:text-lg mb-1 text-brand-navy">Expenses</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 hidden sm:block">
                Receipt OCR, mileage, tax
              </p>
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 hidden sm:flex">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">OCR</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Mileage</span>
              </div>
              <button
                onClick={() => router.push('/admin/expense-tracker')}
                className="w-full py-1.5 sm:py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition text-xs sm:text-sm"
              >
                Open
              </button>
            </div>

            {/* Books */}
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-indigo-500">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📚</div>
              <h3 className="font-bold text-sm sm:text-lg mb-1 text-brand-navy">Books</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 hidden sm:block">
                Invoicing, bills, reports
              </p>
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 hidden sm:flex">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">Invoices</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">Reports</span>
              </div>
              <button
                onClick={() => router.push('/admin/books')}
                className="w-full py-1.5 sm:py-2 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 transition text-xs sm:text-sm"
              >
                Open
              </button>
            </div>

            {/* Area Helper */}
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-brand-gold col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🗺️</div>
              <h3 className="font-bold text-sm sm:text-lg mb-1 text-brand-navy">Area Helper</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 hidden sm:block">
                Satellite mapping, calculations
              </p>
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 hidden sm:flex">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Maps</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">Calc</span>
              </div>
              <button
                onClick={() => router.push('/admin/area-helper')}
                className="w-full py-1.5 sm:py-2 bg-brand-gold text-brand-dark font-semibold rounded hover:bg-yellow-500 transition text-xs sm:text-sm"
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Customers */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-t-4 border-brand-navy">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-lg font-bold text-brand-navy">Recent Customers</h2>
              <button
                onClick={() => router.push('/admin/customers')}
                className="text-brand-navy hover:text-blue-800 text-xs sm:text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {recentCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">No customers yet</p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentCustomers.slice(0, 3).map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => router.push(`/admin/customers/${customer.id}`)}
                    className="p-2 sm:p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-semibold text-gray-800 text-sm truncate">{customer.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{customer.email}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Estimates */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-t-4 border-brand-gold">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-lg font-bold text-brand-navy">Recent Estimates</h2>
              <button
                onClick={() => router.push('/admin/estimates')}
                className="text-brand-navy hover:text-blue-800 text-xs sm:text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {recentEstimates.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">No estimates yet</p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentEstimates.slice(0, 3).map((estimate) => (
                  <div key={estimate.id} className="p-2 sm:p-3 border rounded hover:bg-gray-50">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">Estimate #{estimate.id}</p>
                    <p className="text-base sm:text-lg font-bold text-green-600">
                      ${estimate.total_amount?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                      {new Date(estimate.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-t-4 border-green-500 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-lg font-bold text-brand-navy">Recent Invoices</h2>
              <button
                onClick={() => router.push('/admin/invoices')}
                className="text-brand-navy hover:text-blue-800 text-xs sm:text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {recentInvoices.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">No invoices yet</p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentInvoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="p-2 sm:p-3 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-xs sm:text-sm">Invoice #{invoice.id}</p>
                        <p className="text-base sm:text-lg font-bold text-gray-800">
                          ${invoice.total_amount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded flex-shrink-0 ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Professional Footer */}
        <footer className="mt-8 sm:mt-12 py-4 border-t border-slate-200">
          <p className="text-center text-xs sm:text-sm text-slate-500">
            © {new Date().getFullYear()} MC Smart Bytes · Secure
          </p>
        </footer>
      </div>
    </div>
  );
}
