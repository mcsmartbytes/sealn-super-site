"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function InvoiceForm({ onAdd }: any) {
  const [form, setForm] = useState({
    customer_id: "",
    total: "",
    due_date: "",
    status: "draft",
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("customers")
      .select("id, name")
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Error fetching customers:", error);
        else setCustomers(data || []);
      });
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.customer_id || !form.total || !form.due_date) return;

    setSubmitting(true);
    await onAdd({
      ...form,
      total: parseFloat(form.total),
    });

    setForm({ customer_id: "", total: "", due_date: "", status: "draft" });
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 max-w-md">
      <h3 className="font-bold text-lg">Add Invoice</h3>

      <select
        value={form.customer_id}
        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Total Amount"
        className="w-full p-2 border rounded"
        value={form.total}
        onChange={(e) => setForm({ ...form, total: e.target.value })}
        required
      />

      <input
        type="date"
        value={form.due_date}
        onChange={(e) => setForm({ ...form, due_date: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Invoice"}
      </button>
    </form>
  );
}

