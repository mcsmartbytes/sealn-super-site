"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function ServicesOverviewPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category")
      .order("name");

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  }

  async function toggleActive(id: number, currentStatus: boolean) {
    const { error } = await supabase
      .from("services")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    } else {
      fetchServices();
    }
  }

  async function deleteService(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

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

  const filteredServices = services.filter(s =>
    filter === "all" || s.category === filter
  );

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Services</h1>
              <p className="text-gray-600 mt-1">Manage your sealcoating and striping services</p>
            </div>
            <button
              onClick={() => router.push("/admin/services/new")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              + Add New Service
            </button>
          </div>

          {/* Category Filter */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Services ({services.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    filter === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat} ({services.filter(s => s.category === cat).length})
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading services...</div>
          ) : filteredServices.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-lg text-center">
              <p className="text-gray-600 mb-4">No services found.</p>
              <button
                onClick={() => router.push("/admin/services/new")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    !service.is_active ? "opacity-60" : ""
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {service.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                          {service.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${service.base_price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">
                          per {service.unit.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    {service.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(service.id, service.is_active)}
                        className={`flex-1 px-3 py-2 text-sm rounded font-semibold ${
                          service.is_active
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {service.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteService(service.id, service.name)}
                        className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 font-semibold"
                      >
                        Delete
                      </button>
                    </div>

                    {!service.is_active && (
                      <div className="mt-3 text-center">
                        <span className="text-xs text-red-600 font-semibold">
                          ⚠ Service Disabled
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
