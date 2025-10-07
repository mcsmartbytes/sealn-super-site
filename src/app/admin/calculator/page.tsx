
"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

interface CalcItem {
  id: string;
  service_id: string;
  service_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Service {
  id: number;
  name: string;
  category: string;
  base_price: number;
  unit: string;
}

export default function CalculatorPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [calcItems, setCalcItems] = useState<CalcItem[]>([
    { id: crypto.randomUUID(), service_id: "", service_name: "", quantity: 0, unit_price: 0, total: 0 }
  ]);

  // Area calculator state
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [activeSize, setActiveSize] = useState<string>("");
  const [showMapHelper, setShowMapHelper] = useState<boolean>(false);

  useEffect(() => {
    // Fetch services from database
    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, category, base_price, unit")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching services:", error);
      } else if (data && data.length > 0) {
        setServices(data);
      }
    }

    fetchServices();

    // Set Mapbox token for area helper
    if (typeof window !== 'undefined') {
      (window as any).MAPBOX_TOKEN = 'pk.eyJ1Ijoic2VhbG5zdHJpcGVuc3BlY2lhbGlzdCIsImEiOiJjbWZtaXE4aW4wMmE5MmpvaWEzMms2MXg3In0.2Py8b4hLtIqzLHVGAo9sYg';

      // Load the script dynamically if not already loaded
      if (!document.querySelector('script[src="/area-bid-helper.js"]')) {
        const script = document.createElement('script');
        script.src = '/area-bid-helper.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    // Calculate area when length or width changes
    setArea(length * width);
  }, [length, width]);

  function handleServiceChange(itemId: string, serviceId: string) {
    const numericServiceId = parseInt(serviceId);
    const service = services.find(s => s.id === numericServiceId);

    if (service) {
      const unitPrice = service.base_price || 0;
      setCalcItems(calcItems.map(item =>
        item.id === itemId ? {
          ...item,
          service_id: serviceId,
          service_name: service.name,
          unit_price: unitPrice,
          total: item.quantity * unitPrice
        } : item
      ));
    }
  }

  function updateQuantity(itemId: string, quantity: number) {
    setCalcItems(calcItems.map(item =>
      item.id === itemId ? {
        ...item,
        quantity,
        total: quantity * item.unit_price
      } : item
    ));
  }

  function updatePrice(itemId: string, price: number) {
    setCalcItems(calcItems.map(item =>
      item.id === itemId ? {
        ...item,
        unit_price: price,
        total: item.quantity * price
      } : item
    ));
  }

  function addCalcItem() {
    setCalcItems([...calcItems, {
      id: crypto.randomUUID(),
      service_id: "",
      service_name: "",
      quantity: 0,
      unit_price: 0,
      total: 0
    }]);
  }

  function removeCalcItem(itemId: string) {
    if (calcItems.length > 1) {
      setCalcItems(calcItems.filter(item => item.id !== itemId));
    }
  }

  function clearCalculator() {
    if (confirm("Clear all calculator items?")) {
      setCalcItems([{
        id: crypto.randomUUID(),
        service_id: "",
        service_name: "",
        quantity: 0,
        unit_price: 0,
        total: 0
      }]);
      setLength(0);
      setWidth(0);
      setArea(0);
      setActiveSize("");
    }
  }

  function setDimensions(l: number, w: number, sizeName: string) {
    setLength(l);
    setWidth(w);
    setActiveSize(sizeName);
  }

  function useAreaInCalculator() {
    if (area > 0) {
      const lastItem = calcItems[calcItems.length - 1];
      updateQuantity(lastItem.id, parseFloat(area.toFixed(1)));
      alert(`Area of ${area.toFixed(1)} sq ft added to calculator`);
    }
  }

  function getGrandTotal(): number {
    return calcItems.reduce((sum, item) => sum + item.total, 0);
  }

  function getSummaryItems() {
    return calcItems.filter(item => item.service_id && item.quantity > 0);
  }

  function createEstimateFromCalc() {
    const grandTotal = getGrandTotal();
    if (grandTotal === 0) {
      alert("Please add some services to the calculator first.");
      return;
    }

    const items = getSummaryItems();
    if (items.length === 0) {
      alert("Please add some services to the calculator first.");
      return;
    }

    // Store items in sessionStorage and redirect
    sessionStorage.setItem("calculatorItems", JSON.stringify(items));
    router.push("/admin/estimates?from_calculator=true");
  }

  function createInvoiceFromCalc() {
    const grandTotal = getGrandTotal();
    if (grandTotal === 0) {
      alert("Please add some services to the calculator first.");
      return;
    }

    const items = getSummaryItems();
    if (items.length === 0) {
      alert("Please add some services to the calculator first.");
      return;
    }

    // Store items in sessionStorage and redirect
    sessionStorage.setItem("calculatorItems", JSON.stringify(items));
    router.push("/admin/invoices?from_calculator=true");
  }

  const summaryItems = getSummaryItems();
  const grandTotal = getGrandTotal();

  return (
    <ProtectedRoute>
      <AdminNav />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,350px] gap-6">
              {/* Main Calculator */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Cost Calculator</h2>
                <p className="text-gray-600 mb-6">Add services to calculate estimated costs for customer quotes.</p>

                {/* Calculator Items */}
                <div className="space-y-4 mb-6">
                  {calcItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="col-span-12 md:col-span-5">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Service</label>
                        <select
                          value={item.service_id}
                          onChange={(e) => handleServiceChange(item.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Service</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.category}) - ${s.base_price.toFixed(2)}/{s.unit.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.quantity || ""}
                          onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price || ""}
                          onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                        <input
                          type="text"
                          value={`$${item.total.toFixed(2)}`}
                          readOnly
                          className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm font-bold"
                        />
                      </div>
                      <div className="col-span-1">
                        {calcItems.length > 1 && (
                          <>
                            <label className="block text-xs font-medium text-gray-700 mb-1">&nbsp;</label>
                            <button
                              type="button"
                              onClick={() => removeCalcItem(item.id)}
                              className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                              title="Remove"
                            >
                              ×
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={addCalcItem}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                  >
                    + Add Service
                  </button>
                  <button
                    type="button"
                    onClick={clearCalculator}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {/* Area Calculator */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-3">📐 Area Calculator</h4>

                  <div className="grid grid-cols-12 gap-3 items-end mb-4">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Length (ft)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={length || ""}
                        onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Width (ft)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={width || ""}
                        onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Area (sq ft)</label>
                      <input
                        type="text"
                        value={area.toFixed(1)}
                        readOnly
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm font-bold"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={useAreaInCalculator}
                        className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                        title="Use area in calculator"
                      >
                        ↑
                      </button>
                    </div>
                  </div>

                  <div>
                    <strong className="text-sm text-gray-700">Common Parking Space Sizes:</strong>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      <button
                        onClick={() => setDimensions(9, 18, "compact")}
                        className={`p-2 rounded border text-sm transition-all ${
                          activeSize === "compact"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Compact: 9×18
                      </button>
                      <button
                        onClick={() => setDimensions(9, 20, "standard")}
                        className={`p-2 rounded border text-sm transition-all ${
                          activeSize === "standard"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Standard: 9×20
                      </button>
                      <button
                        onClick={() => setDimensions(10, 20, "large")}
                        className={`p-2 rounded border text-sm transition-all ${
                          activeSize === "large"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Large: 10×20
                      </button>
                      <button
                        onClick={() => setDimensions(8, 18, "handicap")}
                        className={`p-2 rounded border text-sm transition-all ${
                          activeSize === "handicap"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Handicap: 8×18
                      </button>
                    </div>
                  </div>
                </div>

                {/* Map-based Area Helper */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowMapHelper(!showMapHelper)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-between"
                  >
                    <span>🗺️ {showMapHelper ? 'Hide' : 'Show'} Map Area Helper</span>
                    <span>{showMapHelper ? '▲' : '▼'}</span>
                  </button>

                  {showMapHelper && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 mb-3">
                          <strong>Instructions:</strong> Use the map below to measure the area, then click "Use Total Area" to add it to your calculator.
                        </p>
                        <button
                          onClick={() => {
                            // Get measurement from the map component using getData() method
                            const mapEl = document.querySelector('area-bid-helper') as any;
                            if (mapEl && mapEl.getData) {
                              const data = mapEl.getData();
                              if (data && data.area_sq_ft && data.area_sq_ft > 0) {
                                const sqFt = data.area_sq_ft;
                                const lastItem = calcItems[calcItems.length - 1];
                                updateQuantity(lastItem.id, parseFloat(sqFt.toFixed(1)));
                                alert(`Area of ${sqFt.toFixed(1)} sq ft added to calculator!`);
                              } else {
                                alert('Please draw some shapes on the map first.');
                              }
                            } else {
                              alert('Map component not ready. Please try again.');
                            }
                          }}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                        >
                          📐 Use Total Area in Calculator
                        </button>
                      </div>
                      <div className="border-4 border-blue-500 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                        {/* @ts-ignore - Web component */}
                        <area-bid-helper style={{ display: 'block', width: '100%', height: '100%' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="bg-white p-6 rounded-lg shadow-lg h-fit lg:sticky lg:top-6">
                {/* Total Section */}
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                  <div className="text-4xl font-bold text-green-600 text-center mb-2">
                    ${grandTotal.toFixed(2)}
                  </div>
                  <div className="text-center text-gray-600 text-sm">Total Estimate</div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Summary</h4>
                  {summaryItems.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                      Add services to see breakdown
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {summaryItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-200">
                          <span className="text-gray-700">
                            {item.service_name} ({item.quantity})
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${item.total.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-base font-bold pt-3 mt-2 border-t-2 border-green-500">
                        <span>Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={createEstimateFromCalc}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      📄 Create Estimate
                    </button>
                    <button
                      onClick={createInvoiceFromCalc}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      📋 Create Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
