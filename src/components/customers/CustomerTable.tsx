"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomerEditModal from "./CustomerEditModal";

export default function CustomerTable({
  customers,
  loading,
  onDelete,
  onUpdate,
}: any) {
  const router = useRouter();
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  if (loading)
    return <p className="text-center text-gray-500">Loading customers...</p>;

  if (!customers.length)
    return (
      <p className="text-center text-gray-400 italic">
        No customers found. Add one above!
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Company</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c: any) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.phone}</td>
              <td className="p-3">{c.company}</td>
              <td className="p-3">
                {new Date(c.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => router.push(`/admin/customers/${c.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => setEditingCustomer(c)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCustomer && (
        <CustomerEditModal
          customer={editingCustomer}
          onSave={onUpdate}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
}

