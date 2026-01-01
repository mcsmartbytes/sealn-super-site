'use client';

import { useState } from 'react';
import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

// Demo expenses for presentation
const DEMO_EXPENSES = [
  { id: 1, description: 'Sealcoating material - 500 gal', vendor: 'Neyra Industries', amount: 8450.00, category: 'Materials', date: 'Dec 28' },
  { id: 2, description: 'Equipment rental - Squeegee trailer', vendor: 'Sunbelt Rentals', amount: 1250.00, category: 'Equipment', date: 'Dec 27' },
  { id: 3, description: 'Crew fuel - Week 52', vendor: 'BP Fleet Card', amount: 892.50, category: 'Fuel', date: 'Dec 26' },
  { id: 4, description: 'Striping paint - Yellow', vendor: 'Sherwin-Williams', amount: 645.00, category: 'Materials', date: 'Dec 24' },
  { id: 5, description: 'Safety equipment', vendor: 'Grainger', amount: 328.75, category: 'Supplies', date: 'Dec 22' },
];

const DEMO_MILEAGE = [
  { id: 1, from: 'Office', to: 'Westfield Mall', miles: 24.5, deduction: '$16.17', date: 'Dec 30' },
  { id: 2, from: 'Westfield Mall', to: 'Target Plaza', miles: 12.3, deduction: '$8.12', date: 'Dec 30' },
  { id: 3, from: 'Office', to: "O'Hare Airport", miles: 18.7, deduction: '$12.34', date: 'Dec 29' },
];

export default function ExpenseTrackerPage() {
  return (
    <ProtectedRoute>
      <ExpenseTrackerContent />
    </ProtectedRoute>
  );
}

function ExpenseTrackerContent() {
  const [activeTab, setActiveTab] = useState('expenses');

  const totalExpenses = DEMO_EXPENSES.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">💰</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Expenses Made Easy</h1>
              <p className="text-gray-600">Track expenses, mileage, receipts & tax reports</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">INTEGRATED</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-gray-800">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Mileage (YTD)</p>
            <p className="text-2xl font-bold text-purple-600">4,892 mi</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Tax Deductions</p>
            <p className="text-2xl font-bold text-green-600">$3,228</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Receipts Scanned</p>
            <p className="text-2xl font-bold text-blue-600">147</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b flex">
            {['expenses', 'mileage', 'receipts', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Expenses List */}
          {activeTab === 'expenses' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">Recent Expenses</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  + Add Expense
                </button>
              </div>
              <div className="space-y-3">
                {DEMO_EXPENSES.map(expense => (
                  <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{expense.description}</h3>
                      <p className="text-sm text-gray-500">{expense.vendor} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">${expense.amount.toLocaleString()}</p>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{expense.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mileage Tab */}
          {activeTab === 'mileage' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">Recent Trips</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  + Log Trip
                </button>
              </div>
              <div className="space-y-3">
                {DEMO_MILEAGE.map(trip => (
                  <div key={trip.id} className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{trip.from} → {trip.to}</h3>
                      <p className="text-sm text-gray-500">{trip.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{trip.miles} mi</p>
                      <span className="text-xs text-green-600 font-medium">{trip.deduction} deduction</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipts Tab */}
          {activeTab === 'receipts' && (
            <div className="p-6 text-center text-gray-500">
              <p className="text-4xl mb-3">🧾</p>
              <p className="font-medium">Receipt Scanner</p>
              <p className="text-sm">AI-powered OCR to auto-extract receipt data</p>
              <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                Scan Receipt
              </button>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="p-6 text-center text-gray-500">
              <p className="text-4xl mb-3">📊</p>
              <p className="font-medium">Tax Reports</p>
              <p className="text-sm">Schedule C breakdown for tax season</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">🧾</div>
            <h3 className="font-bold text-gray-800">Receipt OCR</h3>
            <p className="text-sm text-gray-600">AI-powered scanning</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">🚗</div>
            <h3 className="font-bold text-gray-800">Mileage Tracking</h3>
            <p className="text-sm text-gray-600">GPS auto-tracking</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-bold text-gray-800">Recurring</h3>
            <p className="text-sm text-gray-600">Auto-generate bills</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold text-gray-800">Tax Reports</h3>
            <p className="text-sm text-gray-600">Schedule C ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
