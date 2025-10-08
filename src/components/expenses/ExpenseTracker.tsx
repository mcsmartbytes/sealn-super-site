"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string | null;
  receipt_url: string | null;
  notes: string | null;
  customer_id: string | null;
  job_id: string | null;
  customers?: { name: string };
  jobs?: { job_name: string };
  created_at: string;
}

const EXPENSE_CATEGORIES = [
  "Fuel",
  "Materials",
  "Equipment",
  "Labor",
  "Vehicle Maintenance",
  "Insurance",
  "Supplies",
  "Marketing",
  "Office",
  "Utilities",
  "Other",
];

const PAYMENT_METHODS = ["Cash", "Check", "Credit Card", "Debit Card", "Bank Transfer"];

interface ExpenseTrackerProps {
  showHeader?: boolean;
  showStats?: boolean;
  showFilters?: boolean;
  maxHeight?: string;
  onExpenseAdded?: (expense: Expense) => void;
  onExpenseUpdated?: (expense: Expense) => void;
  onExpenseDeleted?: (id: string) => void;
}

export default function ExpenseTracker({
  showHeader = true,
  showStats = true,
  showFilters = true,
  maxHeight,
  onExpenseAdded,
  onExpenseUpdated,
  onExpenseDeleted,
}: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [customers, setCustomers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Fuel",
    description: "",
    amount: "",
    payment_method: "Cash",
    notes: "",
    customer_id: "",
    job_id: "",
  });

  useEffect(() => {
    fetchExpenses();
    fetchCustomers();
  }, [filter]);

  useEffect(() => {
    if (formData.customer_id) {
      fetchJobs(formData.customer_id);
    } else {
      setJobs([]);
      setFormData(prev => ({ ...prev, job_id: "" }));
    }
  }, [formData.customer_id]);

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("id, name")
      .order("name");

    if (!error && data) {
      setCustomers(data);
    }
  }

  async function fetchJobs(customerId: string) {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, job_name")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(data);
    }
  }

  async function fetchExpenses() {
    setLoading(true);
    let query = supabase
      .from("expenses")
      .select(`
        *,
        customers (name),
        jobs (job_name)
      `)
      .order("date", { ascending: false });

    if (filter !== "all") {
      query = query.eq("category", filter);
    }

    const { data, error} = await query;

    if (error) {
      console.error("Error fetching expenses:", error);
      alert("Failed to load expenses");
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const expenseData = {
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      notes: formData.notes || null,
      customer_id: formData.customer_id || null,
      job_id: formData.job_id || null,
    };

    if (editingExpense) {
      const { data, error } = await supabase
        .from("expenses")
        .update(expenseData)
        .eq("id", editingExpense.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating expense:", error);
        alert("Failed to update expense");
        return;
      }

      if (onExpenseUpdated && data) {
        onExpenseUpdated(data);
      }
    } else {
      const { data, error } = await supabase
        .from("expenses")
        .insert([expenseData])
        .select()
        .single();

      if (error) {
        console.error("Error creating expense:", error);
        alert("Failed to create expense");
        return;
      }

      if (onExpenseAdded && data) {
        onExpenseAdded(data);
      }
    }

    resetForm();
    fetchExpenses();
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormData({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      payment_method: expense.payment_method || "Cash",
      notes: expense.notes || "",
      customer_id: expense.customer_id || "",
      job_id: expense.job_id || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const confirmed = confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    } else {
      if (onExpenseDeleted) {
        onExpenseDeleted(id);
      }
      fetchExpenses();
    }
  }

  function resetForm() {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      category: "Fuel",
      description: "",
      amount: "",
      payment_method: "Cash",
      notes: "",
      customer_id: "",
      job_id: "",
    });
    setEditingExpense(null);
    setShowForm(false);
  }

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Expense"}
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {showStats && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-800">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-800">
              ${expenses
                .filter(
                  (e) =>
                    new Date(e.date).getMonth() === new Date().getMonth() &&
                    new Date(e.date).getFullYear() === new Date().getFullYear()
                )
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Count</p>
            <p className="text-2xl font-bold text-gray-800">{expenses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Avg Amount</p>
            <p className="text-2xl font-bold text-gray-800">
              ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingExpense ? "Edit Expense" : "Add New Expense"}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer (Optional)
              </label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">None - General Expense</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job (Optional)
              </label>
              <select
                value={formData.job_id}
                onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled={!formData.customer_id}
              >
                <option value="">None - General for Customer</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.job_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="What was this expense for?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({ ...formData, payment_method: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                {editingExpense ? "Update Expense" : "Add Expense"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Buttons */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category:
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded ${
                  filter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat} (${(categoryTotals[cat] || 0).toFixed(2)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expenses Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-400 italic">No expenses found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto" style={maxHeight ? { maxHeight, overflowY: 'auto' } : {}}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer/Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expense.customers?.name ? (
                        <div>
                          <div className="font-medium text-gray-900">{expense.customers.name}</div>
                          {expense.jobs?.job_name && (
                            <div className="text-xs text-gray-500">Job: {expense.jobs.job_name}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">General</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {expense.description}
                      </div>
                      {expense.notes && (
                        <div className="text-sm text-gray-500 italic">
                          {expense.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.payment_method || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
