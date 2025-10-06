
// src/app/admin/estimates/page.tsx
"use client";

import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEstimates } from "@/components/estimates/useEstimates";
import EstimateForm from "@/components/estimates/EstimateForm";
import EstimateTable from "@/components/estimates/EstimateTable";

export default function EstimatesPage() {
  const { estimates, addEstimate, deleteEstimate, loading } = useEstimates();

  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Estimates</h1>
          <EstimateForm onAdd={addEstimate} />
          <EstimateTable estimates={estimates} loading={loading} onDelete={deleteEstimate} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

