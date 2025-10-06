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
      <div className="min-h-screen bg-gray-100">
        <AdminNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCustomers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimates</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEstimates}</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalInvoices}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingInvoices}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.paidInvoices}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/customers')}
              className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
            >
              <span>👤</span>
              <span>Add Customer</span>
            </button>
            <button
              onClick={() => router.push('/admin/estimates')}
              className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>New Estimate</span>
            </button>
            <button
              onClick={() => router.push('/admin/calculator')}
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
            >
              <span>🧮</span>
              <span>Calculator</span>
            </button>
            <button
              onClick={() => router.push('/admin/area-helper')}
              className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center justify-center gap-2"
            >
              <span>🗺️</span>
              <span>Area Helper</span>
            </button>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Customers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Customers</h2>
              <button
                onClick={() => router.push('/admin/customers')}
                className="text-blue-600 hover:underline text-sm"
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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Estimates</h2>
              <button
                onClick={() => router.push('/admin/estimates')}
                className="text-blue-600 hover:underline text-sm"
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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Invoices</h2>
              <button
                onClick={() => router.push('/admin/invoices')}
                className="text-blue-600 hover:underline text-sm"
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
