"use client";

export default function EstimateTable({ estimates, loading, onDelete }: any) {
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
              <td className="p-3">
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

