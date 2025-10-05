"use client";

export default function InvoiceTable({ invoices, loading, onDelete }: any) {
  if (loading)
    return <p className="text-center text-gray-500">Loading invoices...</p>;

  if (!invoices.length)
    return (
      <p className="text-center text-gray-400 italic">
        No invoices yet. Add one above!
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Due Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Payment Link</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((i: any) => (
            <tr key={i.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{i.customers?.name || "—"}</td>
              <td className="p-3">${Number(i.total).toFixed(2)}</td>
              <td className="p-3">
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
                {i.status !== "paid" && i.status !== "draft" ? (
                  <a
                    href={`/pay-invoice/${i.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Payment Link
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </td>
              <td className="p-3">
                <button
                  onClick={() => onDelete(i.id)}
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

