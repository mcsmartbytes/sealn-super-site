"use client";

import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useInvoices } from "@/components/invoices/useInvoices";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoiceTable from "@/components/invoices/InvoiceTable";

export default function InvoicesPage() {
  const { invoices, loading, addInvoice, deleteInvoice } = useInvoices();

  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <InvoiceForm onAdd={addInvoice} />
          <InvoiceTable invoices={invoices} loading={loading} onDelete={deleteInvoice} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

