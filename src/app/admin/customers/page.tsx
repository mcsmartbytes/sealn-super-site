"use client";

import { useCustomers } from "../../../components/customers/useCustomers";
import CustomerForm from "../../../components/customers/CustomerForm";
import CustomerTable from "../../../components/customers/CustomerTable";
import ProtectedRoute from "../../../components/ProtectedRoute";
import AdminNav from "../../../components/AdminNav";

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <AdminNav />
      <CustomersContent />
    </ProtectedRoute>
  );
}

function CustomersContent() {
  const {
    customers,
    loading,
    addCustomer,
    deleteCustomer,
    updateCustomer,
    fetchCustomers,
  } = useCustomers();

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      <CustomerForm onAdd={addCustomer} onRefresh={fetchCustomers} />
      <CustomerTable
        customers={customers}
        loading={loading}
        onDelete={deleteCustomer}
        onUpdate={updateCustomer}
      />
    </div>
  );
}

