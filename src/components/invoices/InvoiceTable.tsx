"use client";

import { useState } from "react";

export default function InvoiceTable({ invoices, loading, onDelete }: any) {
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);

  async function handleSendEmail(invoice: any) {
    if (!invoice.customers?.email) {
      alert("Customer email not found!");
      return;
    }

    const confirmed = confirm(`Send invoice to ${invoice.customers.email}?`);
    if (!confirmed) return;

    setSendingEmail(invoice.id);

    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          recipientEmail: invoice.customers.email,
          recipientName: invoice.customers.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Invoice sent successfully!');
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
    return <p className="text-center text-gray-500">Loading invoices...</p>;

  if (!invoices.length)
    return (
      <p className="text-center text-gray-400 italic">
        No invoices yet. Add one above!
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 font-semibold text-gray-700">Invoice #</th>
            <th className="p-3 font-semibold text-gray-700">Customer</th>
            <th className="p-3 font-semibold text-gray-700">Job</th>
            <th className="p-3 font-semibold text-gray-700">Amount</th>
            <th className="p-3 font-semibold text-gray-700">Due Date</th>
            <th className="p-3 font-semibold text-gray-700">Status</th>
            <th className="p-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((i: any) => {
            const invoiceAmount = i.amount || i.total || 0;
            return (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-mono text-sm text-gray-800">
                    {i.invoice_number || `INV-${i.id}`}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-medium">{i.customers?.name || "—"}</div>
                  {i.customers?.email && (
                    <div className="text-xs text-gray-500">{i.customers.email}</div>
                  )}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {i.jobs?.job_name || "—"}
                </td>
                <td className="p-3 font-semibold text-gray-800">
                  ${Number(invoiceAmount).toFixed(2)}
                </td>
                <td className="p-3 text-sm">
                  {new Date(i.due_date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      i.status === "draft"
                        ? "bg-gray-200 text-gray-800"
                        : i.status === "sent"
                        ? "bg-blue-200 text-blue-800"
                        : i.status === "paid"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {i.status !== "paid" && (
                      <button
                        onClick={() => handleSendEmail(i)}
                        disabled={sendingEmail === i.id}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {sendingEmail === i.id ? 'Sending...' : 'Send'}
                      </button>
                    )}
                    {i.status !== "paid" && i.status !== "draft" && (
                      <a
                        href={`/pay-invoice/${i.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Pay Link
                      </a>
                    )}
                    <button
                      onClick={() => onDelete(i.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
