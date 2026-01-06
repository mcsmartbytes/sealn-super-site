'use client';

import AdminNav from '@/components/AdminNav';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BooksPage() {
  return (
    <ProtectedRoute>
      <BooksContent />
    </ProtectedRoute>
  );
}

function BooksContent() {
  // Demo data
  const recentTransactions = [
    { id: 1, date: '2026-01-06', description: 'Sealcoat Materials - ABC Supply', type: 'expense', amount: -1245.00, category: 'Materials' },
    { id: 2, date: '2026-01-05', description: 'Payment - Walmart Parking Lot', type: 'income', amount: 8500.00, category: 'Services' },
    { id: 3, date: '2026-01-05', description: 'Fuel - Shell Station', type: 'expense', amount: -287.50, category: 'Fuel' },
    { id: 4, date: '2026-01-04', description: 'Payment - Target Plaza', type: 'income', amount: 4200.00, category: 'Services' },
    { id: 5, date: '2026-01-03', description: 'Equipment Rental', type: 'expense', amount: -450.00, category: 'Equipment' },
  ];

  const stats = {
    revenue: 156780,
    expenses: 67450,
    profit: 89330,
    invoicesPending: 12500,
  };

  const accounts = [
    { name: 'Business Checking', balance: 45230, change: '+$8,500' },
    { name: 'Business Savings', balance: 25000, change: '+$0' },
    { name: 'Credit Card', balance: -2340, change: '-$287' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Books Made Easy</h1>
            <p className="text-gray-600">Financial management & bookkeeping</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            Demo Mode
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Revenue (YTD)</p>
            <p className="text-3xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Expenses (YTD)</p>
            <p className="text-3xl font-bold text-red-600">${stats.expenses.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Net Profit</p>
            <p className="text-3xl font-bold text-blue-600">${stats.profit.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Pending Invoices</p>
            <p className="text-3xl font-bold text-yellow-600">${stats.invoicesPending.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Accounts */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Accounts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {accounts.map((account, idx) => (
                <div key={idx} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className={`text-sm ${account.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {account.change} today
                    </p>
                  </div>
                  <p className={`text-xl font-bold ${account.balance < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                    ${Math.abs(account.balance).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                + Add Transaction
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{tx.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold mb-1">P&L Reports</h3>
            <p className="text-emerald-100 text-sm">Track income & expenses</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">🧾</div>
            <h3 className="font-bold mb-1">Invoicing</h3>
            <p className="text-blue-100 text-sm">Create & send invoices</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">📁</div>
            <h3 className="font-bold mb-1">Tax Ready</h3>
            <p className="text-purple-100 text-sm">Export for tax season</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg shadow p-5 text-white">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-bold mb-1">Bank Sync</h3>
            <p className="text-orange-100 text-sm">Auto-import transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
