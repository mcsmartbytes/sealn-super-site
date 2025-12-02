"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";

interface QuoteData {
  totalArea: number;
  totalPerimeter: number;
  unit: string;
  shapes: any[];
  heights: any[];
  notes: string;
  timestamp: string;
}

export default function AreaHelperPage() {
  const router = useRouter();
  const [receivedData, setReceivedData] = useState<QuoteData | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Security: only accept messages from Area Bid Pro
      if (!event.origin.includes('area-bid-helper.vercel.app')) return;
      if (event.data?.source !== 'area-bid-pro') return;

      console.log('Received message from Area Bid Pro:', event.data);

      if (event.data.type === 'AREA_BID_PRO_EXPORT_QUOTE') {
        const quoteData = event.data.payload as QuoteData;
        setReceivedData(quoteData);
        setShowBanner(true);

        // Store in sessionStorage for the estimate form to pick up
        const calculatorItems = [
          {
            service_id: "",
            service_name: `Area Measurement: ${quoteData.totalArea.toFixed(0)} sq ft`,
            description: `Total Area: ${quoteData.totalArea.toFixed(0)} sq ft, Perimeter: ${quoteData.totalPerimeter.toFixed(0)} ft${quoteData.notes ? ` - Notes: ${quoteData.notes}` : ''}`,
            quantity: Math.ceil(quoteData.totalArea),
            unit_price: 0
          }
        ];

        // Add individual shapes if there are multiple
        if (quoteData.shapes && quoteData.shapes.length > 1) {
          quoteData.shapes.forEach((shape, idx) => {
            calculatorItems.push({
              service_id: "",
              service_name: `Area ${idx + 1}: ${shape.area.toFixed(0)} sq ft`,
              description: `Shape ${idx + 1}: ${shape.area.toFixed(0)} sq ft, Perimeter: ${shape.perimeter.toFixed(0)} ft`,
              quantity: Math.ceil(shape.area),
              unit_price: 0
            });
          });
        }

        sessionStorage.setItem("calculatorItems", JSON.stringify(calculatorItems));
        sessionStorage.setItem("areaBidProData", JSON.stringify(quoteData));
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function goToEstimates() {
    router.push('/admin/estimates');
  }

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0 }}>
        <AdminNav />

        {/* Success Banner */}
        {showBanner && receivedData && (
          <div style={{
            background: 'linear-gradient(90deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <div>
              <strong>Measurement Received!</strong>{' '}
              {receivedData.totalArea.toFixed(0)} sq ft, {receivedData.totalPerimeter.toFixed(0)} ft perimeter
              {receivedData.shapes.length > 1 && ` (${receivedData.shapes.length} shapes)`}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={goToEstimates}
                style={{
                  background: 'white',
                  color: '#059669',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Create Estimate →
              </button>
              <button
                onClick={() => setShowBanner(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          {/* Embed the live area-bid-helper app */}
          <iframe
            src="https://area-bid-helper.vercel.app"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="Area Bid Helper"
            allow="geolocation"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
