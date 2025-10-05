"use client";

import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminNav from "../../components/AdminNav";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminNav />
    <div className="min-h-screen bg-gray-100">

      {/* Dashboard Cards */}
      <div className="p-6 grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded text-center">
          <h2 className="text-4xl font-bold text-yellow-500">4</h2>
          <p className="mt-2 text-gray-700">Total Customers</p>
        </div>
        <div className="bg-white shadow p-6 rounded text-center">
          <h2 className="text-4xl font-bold text-yellow-500">1</h2>
          <p className="mt-2 text-gray-700">Pending Estimates</p>
        </div>
        <div className="bg-white shadow p-6 rounded text-center">
          <h2 className="text-4xl font-bold text-yellow-500">0</h2>
          <p className="mt-2 text-gray-700">Unpaid Invoices</p>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Customers</h2>
        <div className="bg-white shadow rounded p-4 space-y-3">
          <div>
            <p className="font-semibold">Dennis</p>
            <p className="text-sm text-gray-600">L.Apartments3730@gmail.com</p>
            <p className="text-xs text-gray-400">09/29/2025</p>
          </div>
          <hr />
          <div>
            <p className="font-semibold">Mr. Tom</p>
            <p className="text-sm text-gray-600">warson@gmail.com</p>
            <p className="text-xs text-gray-400">09/29/2025</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <Link href="/admin/customers">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Manage Customers
          </button>
        </Link>
        <Link href="/admin/estimates">
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Create Estimate
          </button>
        </Link>
        <Link href="/admin/invoices">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded hover:bg-yellow-600">
            Generate Invoice
          </button>
        </Link>
        <Link href="/admin/calculator">
          <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            Quick Calculator
          </button>
        </Link>
        <Link href="/admin/services">
          <button className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800">
            Manage Services
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 text-sm mt-8">
        © Created by MC Smart Bytes
      </footer>
    </div>
    </ProtectedRoute>
  );
}

