"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface LineItem {
  id: string;
  service_id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export default function InvoiceForm({ onAdd }: any) {
  const [form, setForm] = useState({
    customer_id: "",
    job_id: "",
    estimate_id: "",
    invoice_number: "",
    description: "",
    due_date: "",
    status: "draft",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), service_id: "", description: "", quantity: 1, unit_price: 0 }
  ]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Generate invoice number on mount
  useEffect(() => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    setForm(prev => ({ ...prev, invoice_number: `INV-${timestamp}${random}` }));
  }, []);

  useEffect(() => {
    // Fetch customers
    supabase
      .from("customers")
      .select("id, name")
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Error fetching customers:", error);
        else setCustomers(data || []);
      });

    // Fetch services
    supabase
      .from("services")
      .select("id, name, base_price")
      .eq("is_active", true)
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Error fetching services:", error);
        else setServices(data || []);
      });
  }, []);

  // Fetch jobs when customer changes
  useEffect(() => {
    if (form.customer_id) {
      supabase
        .from("jobs")
        .select("id, job_name")
        .eq("customer_id", form.customer_id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) console.error("Error fetching jobs:", error);
          else setJobs(data || []);
        });

      // Fetch accepted estimates for this customer
      supabase
        .from("estimates")
        .select("id, service_type, estimated_cost, created_at")
        .eq("customer_id", form.customer_id)
        .eq("status", "accepted")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) console.error("Error fetching estimates:", error);
          else setEstimates(data || []);
        });
    } else {
      setJobs([]);
      setEstimates([]);
      setForm(prev => ({ ...prev, job_id: "", estimate_id: "" }));
    }
  }, [form.customer_id]);

  // Load estimate items when estimate is selected
  useEffect(() => {
    if (form.estimate_id) {
      supabase
        .from("estimate_items")
        .select("*, services(name)")
        .eq("estimate_id", form.estimate_id)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching estimate items:", error);
          } else if (data && data.length > 0) {
            const convertedItems = data.map((item: any) => ({
              id: crypto.randomUUID(),
              service_id: item.service_id?.toString() || "",
              description: item.services?.name || item.notes || "",
              quantity: item.quantity || 1,
              unit_price: item.unit_price || 0
            }));
            setLineItems(convertedItems);
          }
        });
    }
  }, [form.estimate_id]);

  function addLineItem() {
    setLineItems([...lineItems, { id: crypto.randomUUID(), service_id: "", description: "", quantity: 1, unit_price: 0 }]);
  }

  function handleServiceChange(id: string, serviceId: string) {
    const numericServiceId = parseInt(serviceId);
    const service = services.find(s => s.id === numericServiceId);
    if (service) {
      setLineItems(lineItems.map(item =>
        item.id === id ? {
          ...item,
          service_id: serviceId,
          description: service.name,
          unit_price: service.base_price || 0
        } : item
      ));
    } else {
      updateLineItem(id, "service_id", serviceId);
    }
  }

  function removeLineItem(id: string) {
    setLineItems(lineItems.filter(item => item.id !== id));
  }

  function updateLineItem(id: string, field: string, value: any) {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  }

  function calculateSubtotal() {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.customer_id || !form.due_date || lineItems.length === 0) return;

    const subtotal = calculateSubtotal();
    if (subtotal === 0) {
      alert("Please add at least one line item with a price");
      return;
    }

    setSubmitting(true);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert([{
        customer_id: form.customer_id,
        job_id: form.job_id || null,
        estimate_id: form.estimate_id || null,
        invoice_number: form.invoice_number,
        amount: subtotal,
        description: form.description,
        due_date: form.due_date,
        status: form.status,
      }])
      .select()
      .single();

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError);
      alert(`Failed to create invoice: ${invoiceError.message || 'Unknown error'}`);
      setSubmitting(false);
      return;
    }

    // Create line items
    const itemsToInsert = lineItems.map(item => ({
      invoice_id: invoice.id,
      service_id: item.service_id ? parseInt(item.service_id) : null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      notes: item.description || null
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating line items:", itemsError);
      alert("Invoice created but failed to add line items");
    }

    // Reset form
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    setForm({
      customer_id: "",
      job_id: "",
      estimate_id: "",
      invoice_number: `INV-${timestamp}${random}`,
      description: "",
      due_date: "",
      status: "draft",
    });
    setLineItems([{ id: crypto.randomUUID(), service_id: "", description: "", quantity: 1, unit_price: 0 }]);
    setSubmitting(false);

    // Refresh parent list
    if (onAdd) onAdd(invoice);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="font-bold text-xl text-gray-800 mb-4">Create New Invoice</h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            value={form.invoice_number}
            onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="INV-XXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer *
          </label>
          <select
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
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
            <option value="">Select Job</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.job_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Estimate (Optional)
          </label>
          <select
            value={form.estimate_id}
            onChange={(e) => setForm({ ...form, estimate_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={!form.customer_id}
          >
            <option value="">Select Estimate</option>
            {estimates.map((est) => (
              <option key={est.id} value={est.id}>
                {est.service_type} - ${est.estimated_cost?.toFixed(2)} ({new Date(est.created_at).toLocaleDateString()})
              </option>
            ))}
          </select>
          {estimates.length === 0 && form.customer_id && (
            <p className="text-xs text-gray-500 mt-1">No accepted estimates for this customer</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description / Notes
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Additional notes for this invoice..."
        />
      </div>

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
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="block text-xs text-gray-600 mb-1">
                  Service *
                </label>
                <select
                  value={item.service_id}
                  onChange={(e) => handleServiceChange(item.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                >
                  <option value="">Select Service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - ${s.base_price}
                    </option>
                  ))}
                  <option value="custom">Custom Service...</option>
                </select>
                {item.service_id === "custom" && (
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm mt-1"
                    placeholder="Enter custom service"
                    required
                  />
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Qty *
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Total
                </label>
                <div className="p-2 bg-gray-100 rounded text-sm font-medium">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
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
              ${calculateSubtotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Creating Invoice..." : "Create Invoice"}
      </button>
    </form>
  );
}
