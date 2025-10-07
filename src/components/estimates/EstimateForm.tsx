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

export default function EstimateForm({ onAdd }: any) {
  const [form, setForm] = useState({
    customer_id: "",
    job_id: "",
    description: "",
    status: "pending",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), service_id: "", description: "", quantity: 1, unit_price: 0 }
  ]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

    // Load calculator items from sessionStorage if coming from calculator
    const calcItems = sessionStorage.getItem("calculatorItems");
    if (calcItems) {
      try {
        const items = JSON.parse(calcItems);
        const convertedItems = items.map((item: any) => ({
          id: crypto.randomUUID(),
          service_id: item.service_id || "",
          description: item.service_name || item.description || "",
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0
        }));
        setLineItems(convertedItems);
        sessionStorage.removeItem("calculatorItems"); // Clear after loading
      } catch (error) {
        console.error("Error loading calculator items:", error);
      }
    }
  }, []);

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
    } else {
      setJobs([]);
      setForm({ ...form, job_id: "" });
    }
  }, [form.customer_id]);

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

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  function removeLineItem(id: string) {
    setLineItems(lineItems.filter(item => item.id !== id));
  }

  function updateLineItem(id: string, field: string, value: any) {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  }

  function calculateTotal() {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.customer_id || lineItems.length === 0) return;

    const total = calculateTotal();
    if (total === 0) {
      alert("Please add at least one line item with a price");
      return;
    }

    setSubmitting(true);

    // Create estimate
    const { data: estimate, error: estimateError } = await supabase
      .from("estimates")
      .insert([{
        customer_id: form.customer_id,
        job_id: form.job_id || null,
        amount: total,
        description: form.description,
        status: form.status,
      }])
      .select()
      .single();

    if (estimateError) {
      console.error("Error creating estimate:", estimateError);
      alert("Failed to create estimate");
      setSubmitting(false);
      return;
    }

    // Create line items
    const itemsToInsert = lineItems.map(item => ({
      estimate_id: estimate.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from("estimate_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating line items:", itemsError);
      alert("Estimate created but failed to add line items");
    }

    // Upload photos if any
    if (photos.length > 0) {
      for (const photo of photos) {
        const fileName = `estimate-${estimate.id}-${Date.now()}-${photo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, photo);

        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
        } else {
          // Save photo metadata
          const { data: { publicUrl } } = supabase.storage
            .from("media")
            .getPublicUrl(fileName);

          await supabase.from("customer_photos").insert({
            customer_id: form.customer_id,
            estimate_id: estimate.id,
            filename: fileName,
            original_filename: photo.name,
            file_type: "photo",
            file_size: photo.size
          });
        }
      }
    }

    // Reset form
    setForm({ customer_id: "", job_id: "", description: "", status: "pending" });
    setLineItems([{ id: crypto.randomUUID(), service_id: "", description: "", quantity: 1, unit_price: 0 }]);
    setPhotos([]);
    setSubmitting(false);

    // Refresh parent list
    if (onAdd) onAdd(estimate);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="font-bold text-xl text-gray-800 mb-4">Create New Estimate</h3>

      <div className="grid md:grid-cols-2 gap-4">
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
            <option value="">Select Job (Optional)</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.job_name}
              </option>
            ))}
          </select>
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
          rows={3}
          placeholder="Additional details about this estimate..."
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
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
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
          {lineItems.map((item, index) => (
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
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attach Photos (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        {photos.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-600">{photos.length} photo(s) selected:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <div className="bg-gray-100 p-2 rounded text-xs truncate">
                    {photo.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Creating Estimate..." : "Create Estimate"}
      </button>
    </form>
  );
}
