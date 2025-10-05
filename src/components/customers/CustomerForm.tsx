"use client";

import { useState } from "react";

export default function CustomerForm({ onAdd, onRefresh }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    await onAdd(form);
    await onRefresh(); // ✅ instantly refreshes table after adding
    setForm({ name: "", email: "", phone: "", company: "" });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <div className="bg-white p-4 shadow rounded max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <h3 className="font-bold text-lg">Add Customer</h3>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 border rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company"
          className="w-full p-2 border rounded"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>

      {success && (
        <div className="mt-3 text-green-700 font-semibold">
          ✅ Customer added successfully!
        </div>
      )}
    </div>
  );
}

