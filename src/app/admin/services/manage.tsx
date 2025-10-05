"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/utils/supabase";

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  base_price: number;
  unit: string;
  is_active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "sealing",
    description: "",
    base_price: "",
    unit: "sq_ft",
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const serviceData = {
      name: form.name,
      category: form.category,
      description: form.description,
      base_price: parseFloat(form.base_price),
      unit: form.unit,
      is_active: form.is_active
    };

    if (editingId) {
      const { error } = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating service:", error);
        alert("Failed to update service");
      } else {
        setEditingId(null);
        resetForm();
        fetchServices();
      }
    } else {
      const { error } = await supabase
        .from("services")
        .insert([serviceData]);

      if (error) {
        console.error("Error adding service:", error);
        alert("Failed to add service");
      } else {
        resetForm();
        fetchServices();
      }
    }
  }

  function editService(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description || "",
      base_price: service.base_price.toString(),
      unit: service.unit || "sq_ft",
      is_active: service.is_active !== false
    });
  }

  async function deleteService(id: number) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    } else {
      fetchServices();
    }
  }

  function resetForm() {
    setForm({
      name: "",
      category: "sealing",
      description: "",
      base_price: "",
      unit: "sq_ft",
      is_active: true
    });
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>

          {/* Service Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="font-bold text-xl text-gray-800 mb-4">
              {editingId ? "Edit Service" : "Add New Service"}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sealcoating"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="sealing">Sealing Services</option>
                  <option value="striping">Striping Services</option>
                  <option value="repair">Repair Services</option>
                  <option value="maintenance">Maintenance Services</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.base_price}
                  onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="sq_ft">Per Sq Ft</option>
                  <option value="linear_ft">Per Linear Ft</option>
                  <option value="job">Per Job</option>
                  <option value="hour">Per Hour</option>
                  <option value="each">Each</option>
                  <option value="stall">Stall</option>
                  <option value="gallon">Gallon</option>
                  <option value="ton">Ton</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Service details..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
              >
                {editingId ? "Update Service" : "Add Service"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Existing Services</h3>
              
              {loading ? (
                <p className="text-gray-600">Loading services...</p>
              ) : services.length === 0 ? (
                <p className="text-gray-600">No services yet. Add your first service above.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                            {service.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {service.description || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            ${Number(service.base_price).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {service.unit.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => editService(service)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteService(service.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
