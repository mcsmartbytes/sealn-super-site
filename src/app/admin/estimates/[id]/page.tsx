"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/utils/supabase";

interface LineItem {
  id?: number;
  service_id: string;
  quantity: number;
  unit_price: number;
  notes: string;
  isNew?: boolean;
}

export default function EstimateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const estimateId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [form, setForm] = useState({
    customer_id: "",
    job_id: "",
    service_type: "sealcoating",
    lot_size: "",
    condition: "good",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    loadData();
  }, [estimateId]);

  async function loadData() {
    setLoading(true);

    // Load customers
    const { data: customersData } = await supabase
      .from("customers")
      .select("id, name")
      .order("name");
    setCustomers(customersData || []);

    // Load services
    const { data: servicesData } = await supabase
      .from("services")
      .select("id, name, base_price")
      .eq("is_active", true)
      .order("name");
    setServices(servicesData || []);

    // Load estimate
    const { data: estimateData, error } = await supabase
      .from("estimates")
      .select("*, customers(name, email)")
      .eq("id", estimateId)
      .single();

    if (error || !estimateData) {
      alert("Estimate not found");
      router.push("/admin/estimates");
      return;
    }

    setEstimate(estimateData);
    setForm({
      customer_id: estimateData.customer_id?.toString() || "",
      job_id: estimateData.job_id?.toString() || "",
      service_type: estimateData.service_type || "sealcoating",
      lot_size: estimateData.lot_size?.toString() || "",
      condition: estimateData.condition || "good",
      description: estimateData.description || "",
      status: estimateData.status || "pending",
    });

    // Load jobs for this customer
    if (estimateData.customer_id) {
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id, job_name")
        .eq("customer_id", estimateData.customer_id)
        .order("created_at", { ascending: false });
      setJobs(jobsData || []);
    }

    // Load line items
    const { data: itemsData } = await supabase
      .from("estimate_items")
      .select("*")
      .eq("estimate_id", estimateId)
      .order("id");

    if (itemsData && itemsData.length > 0) {
      setLineItems(itemsData.map(item => ({
        id: item.id,
        service_id: item.service_id?.toString() || "",
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        notes: item.notes || ""
      })));
    } else {
      setLineItems([{ service_id: "", quantity: 1, unit_price: 0, notes: "", isNew: true }]);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (form.customer_id) {
      supabase
        .from("jobs")
        .select("id, job_name")
        .eq("customer_id", form.customer_id)
        .order("created_at", { ascending: false })
        .then(({ data }) => setJobs(data || []));
    } else {
      setJobs([]);
    }
  }, [form.customer_id]);

  function addLineItem() {
    setLineItems([...lineItems, { service_id: "", quantity: 1, unit_price: 0, notes: "", isNew: true }]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(index: number, field: string, value: any) {
    setLineItems(lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  }

  function handleServiceChange(index: number, serviceId: string) {
    const service = services.find(s => s.id === parseInt(serviceId));
    if (service) {
      setLineItems(lineItems.map((item, i) =>
        i === index ? {
          ...item,
          service_id: serviceId,
          unit_price: service.base_price || 0,
          notes: item.notes || service.name
        } : item
      ));
    } else {
      updateLineItem(index, "service_id", serviceId);
    }
  }

  function calculateTotal() {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }

  async function handleSave() {
    if (!form.customer_id) {
      alert("Please select a customer");
      return;
    }

    const total = calculateTotal();
    if (total === 0) {
      alert("Please add at least one line item with a price");
      return;
    }

    setSaving(true);

    // Update estimate
    const { error: updateError } = await supabase
      .from("estimates")
      .update({
        customer_id: form.customer_id,
        job_id: form.job_id || null,
        service_type: form.service_type,
        lot_size: form.lot_size ? parseFloat(form.lot_size) : null,
        condition: form.condition,
        estimated_cost: total,
        description: form.description,
        status: form.status,
      })
      .eq("id", estimateId);

    if (updateError) {
      console.error("Error updating estimate:", updateError);
      alert(`Failed to update estimate: ${updateError.message}`);
      setSaving(false);
      return;
    }

    // Delete existing line items and re-insert
    await supabase
      .from("estimate_items")
      .delete()
      .eq("estimate_id", estimateId);

    // Insert updated line items
    const itemsToInsert = lineItems
      .filter(item => item.quantity > 0)
      .map(item => ({
        estimate_id: parseInt(estimateId),
        service_id: item.service_id ? parseInt(item.service_id) : null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        notes: item.notes || null
      }));

    if (itemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from("estimate_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error saving line items:", itemsError);
        alert("Estimate updated but failed to save line items");
      }
    }

    setSaving(false);
    alert("Estimate saved successfully!");
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminNav />
        <div className="min-h-screen bg-gray-100 p-6">
          <p className="text-center text-gray-500">Loading estimate...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Estimate #{estimateId}
            </h1>
            <button
              onClick={() => router.push("/admin/estimates")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ← Back to Estimates
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            {/* Customer Info */}
            {estimate?.customers && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-blue-800">
                  Customer: {estimate.customers.name}
                </p>
                {estimate.customers.email && (
                  <p className="text-blue-600 text-sm">{estimate.customers.email}</p>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer *
                </label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value, job_id: "" })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job (Optional)
                </label>
                <select
                  value={form.job_id}
                  onChange={(e) => setForm({ ...form, job_id: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!form.customer_id}
                >
                  <option value="">Select Job (Optional)</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.job_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="sealcoating">Sealcoating</option>
                  <option value="striping">Line Striping</option>
                  <option value="crack_filling">Crack Filling</option>
                  <option value="patching">Patching</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size (sq ft)
                </label>
                <input
                  type="number"
                  value={form.lot_size}
                  onChange={(e) => setForm({ ...form, lot_size: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description / Notes
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional details about this estimate..."
              />
            </div>

            {/* Line Items */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">Line Items</h4>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <label className="block text-xs text-gray-600 mb-1">Service</label>
                      <select
                        value={item.service_id}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} - ${s.base_price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-600 mb-1">Notes</label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateLineItem(index, "notes", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs text-gray-600 mb-1">Qty</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs text-gray-600 mb-1">Total</label>
                      <div className="p-2 bg-gray-100 rounded text-sm font-medium">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          title="Remove item"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end">
                <div className="text-right">
                  <span className="text-gray-600 mr-4">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                onClick={() => router.push("/admin/estimates")}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
