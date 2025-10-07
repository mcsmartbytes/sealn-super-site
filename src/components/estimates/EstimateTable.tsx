"use client";

import { useState } from "react";

export default function EstimateTable({ estimates, loading, onDelete }: any) {
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);

  async function handleSendEmail(estimate: any) {
    if (!estimate.customers?.email) {
      alert("Customer email not found!");
      return;
    }

    const confirmed = confirm(`Send estimate to ${estimate.customers.email}?`);
    if (!confirmed) return;

    setSendingEmail(estimate.id);

    try {
      const response = await fetch('/api/send-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimateId: estimate.id,
          recipientEmail: estimate.customers.email,
          recipientName: estimate.customers.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✓ Estimate sent successfully!');
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      alert('Error sending email. Please try again.');
      console.error('Email error:', error);
    } finally {
      setSendingEmail(null);
    }
  }
  if (loading)
    return <p className="text-center text-gray-500">Loading estimates...</p>;

  if (!estimates.length)
    return (
      <p className="text-center text-gray-400 italic">
        No estimates yet. Add one above!
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Customer</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {estimates.map((e: any) => (
            <tr key={e.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{e.customers?.name || "—"}</td>
              <td className="p-3">${Number(e.amount).toFixed(2)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    e.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : e.status === "sent"
                      ? "bg-blue-200 text-blue-800"
                      : e.status === "accepted"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td className="p-3">
                {new Date(e.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleSendEmail(e)}
                  disabled={sendingEmail === e.id}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {sendingEmail === e.id ? '📧 Sending...' : '📧 Send Email'}
                </button>
                <button
                  onClick={() => onDelete(e.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

