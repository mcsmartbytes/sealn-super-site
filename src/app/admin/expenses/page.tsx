"use client";

import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import ExpenseTracker from "@/components/expenses/ExpenseTracker";

export default function ExpensesPage() {
  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Tracker</h1>
          <ExpenseTracker />
        </div>
      </div>
    </ProtectedRoute>
  );
}
