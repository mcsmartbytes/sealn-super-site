
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

// Comprehensive demo services for sealcoating & striping business
const DEMO_SERVICES: Service[] = [
  // Sealcoating Services
  { id: 1, name: 'Commercial Sealcoating', category: 'sealcoating', description: 'Premium coal tar or asphalt emulsion sealcoating for commercial parking lots. Includes cleaning and preparation.', base_price: 0.12, unit: 'sq_ft', is_active: true },
  { id: 2, name: 'Residential Driveway Sealcoating', category: 'sealcoating', description: 'High-quality sealcoating for residential driveways up to 1,000 sq ft.', base_price: 0.18, unit: 'sq_ft', is_active: true },
  { id: 3, name: 'Industrial Sealcoating', category: 'sealcoating', description: 'Heavy-duty sealcoating for industrial facilities, warehouses, and distribution centers.', base_price: 0.10, unit: 'sq_ft', is_active: true },
  { id: 4, name: 'Fuel-Resistant Sealcoating', category: 'sealcoating', description: 'Specialized sealcoat resistant to gas, oil, and chemical spills. Ideal for gas stations.', base_price: 0.22, unit: 'sq_ft', is_active: true },

  // Crack Repair Services
  { id: 5, name: 'Hot Rubberized Crack Filling', category: 'crack_repair', description: 'Professional hot-pour rubber crack sealing for cracks up to 1 inch wide. Most durable solution.', base_price: 1.25, unit: 'linear_ft', is_active: true },
  { id: 6, name: 'Cold Pour Crack Sealing', category: 'crack_repair', description: 'Economical cold-applied crack filler for narrow cracks. Good for smaller projects.', base_price: 0.75, unit: 'linear_ft', is_active: true },
  { id: 7, name: 'Alligator Crack Repair', category: 'crack_repair', description: 'Repair of interconnected spider web cracking patterns. Includes infrared heating or patching.', base_price: 4.50, unit: 'sq_ft', is_active: true },

  // Patching & Repair
  { id: 8, name: 'Pothole Repair', category: 'patching', description: 'Complete pothole repair including excavation, compaction, and hot or cold mix asphalt.', base_price: 85.00, unit: 'each', is_active: true },
  { id: 9, name: 'Asphalt Patching', category: 'patching', description: 'Repair of damaged asphalt sections. Price per square foot for patches over 4 sq ft.', base_price: 8.50, unit: 'sq_ft', is_active: true },
  { id: 10, name: 'Infrared Asphalt Repair', category: 'patching', description: 'Seamless repair using infrared technology. Heats existing asphalt for perfect bonding.', base_price: 12.00, unit: 'sq_ft', is_active: true },
  { id: 11, name: 'Speed Bump Installation', category: 'patching', description: 'Install new rubber or asphalt speed bumps. Includes anchoring and striping.', base_price: 450.00, unit: 'each', is_active: true },

  // Line Striping Services
  { id: 12, name: 'Parking Lot Striping - New Layout', category: 'striping', description: 'Complete new parking lot layout including spaces, arrows, and handicap symbols.', base_price: 3.50, unit: 'linear_ft', is_active: true },
  { id: 13, name: 'Re-striping Existing Lines', category: 'striping', description: 'Refresh existing parking lot lines. Clean, bright professional finish.', base_price: 2.25, unit: 'linear_ft', is_active: true },
  { id: 14, name: 'Handicap/ADA Parking Stall', category: 'striping', description: 'Complete ADA-compliant handicap stall with blue paint, symbol, access aisle, and sign.', base_price: 175.00, unit: 'each', is_active: true },
  { id: 15, name: 'Directional Arrows', category: 'striping', description: 'Traffic flow arrows in white or yellow. Standard size approximately 8ft long.', base_price: 45.00, unit: 'each', is_active: true },
  { id: 16, name: 'Stop Bars', category: 'striping', description: 'Stop bars at intersections and crosswalks. Standard 24" width.', base_price: 8.00, unit: 'linear_ft', is_active: true },
  { id: 17, name: 'Fire Lane Striping', category: 'striping', description: 'Red curb painting and "NO PARKING - FIRE LANE" stenciling per local codes.', base_price: 6.50, unit: 'linear_ft', is_active: true },
  { id: 18, name: 'Crosswalk Striping', category: 'striping', description: 'Pedestrian crosswalk lines. Standard ladder or continental style.', base_price: 4.00, unit: 'linear_ft', is_active: true },
  { id: 19, name: 'Custom Stenciling', category: 'striping', description: 'Custom logos, reserved parking, numbered stalls, or specialty markings.', base_price: 75.00, unit: 'each', is_active: true },

  // Curb & Specialty
  { id: 20, name: 'Curb Painting - Yellow', category: 'curb', description: 'No parking/loading zone yellow curb painting.', base_price: 4.00, unit: 'linear_ft', is_active: true },
  { id: 21, name: 'Curb Painting - Red', category: 'curb', description: 'Fire lane red curb painting.', base_price: 4.00, unit: 'linear_ft', is_active: true },
  { id: 22, name: 'Curb Painting - Blue', category: 'curb', description: 'Handicap blue curb painting for accessible spaces.', base_price: 4.00, unit: 'linear_ft', is_active: true },
  { id: 23, name: 'Wheel Stop Installation', category: 'curb', description: 'Concrete or rubber wheel stops with anchoring hardware.', base_price: 85.00, unit: 'each', is_active: true },

  // Additional Services
  { id: 24, name: 'Power Sweeping', category: 'maintenance', description: 'Mechanical sweeping of parking lot to remove debris before sealcoating.', base_price: 0.02, unit: 'sq_ft', is_active: true },
  { id: 25, name: 'Pressure Washing', category: 'maintenance', description: 'High-pressure cleaning of asphalt surface to remove oil stains and buildup.', base_price: 0.08, unit: 'sq_ft', is_active: true },
  { id: 26, name: 'Oil Spot Priming', category: 'maintenance', description: 'Special primer application for oil-stained areas before sealcoating.', base_price: 2.50, unit: 'sq_ft', is_active: true },
  { id: 27, name: 'Traffic Cone Rental', category: 'maintenance', description: 'Daily rental of traffic cones for lot closure during work.', base_price: 2.00, unit: 'each', is_active: true },
  { id: 28, name: 'Barricade Rental', category: 'maintenance', description: 'Daily rental of barricades for traffic control.', base_price: 15.00, unit: 'each', is_active: true },
];

export default function ServicesOverviewPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';
    setIsDemoMode(demoSession);

    if (demoSession) {
      setServices(DEMO_SERVICES);
      setLoading(false);
    } else {
      fetchServices();
    }
  }, []);

  async function fetchServices() {
    if (!supabase) {
      setLoading(false);
      return;
    }

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
    if (isDemoMode) {
      setServices(services.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      return;
    }

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

    if (isDemoMode) {
      setServices(services.filter(s => s.id !== id));
      return;
    }

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
