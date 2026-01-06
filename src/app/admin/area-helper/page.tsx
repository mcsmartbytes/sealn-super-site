"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";

interface QuoteLine {
  serviceId: string;
  serviceName: string;
  measurementValue: number;
  rate: number;
  minimum: number;
  subtotal: number;
}

interface QuoteData {
  totalArea: number;
  totalPerimeter: number;
  unit: string;
  shapes: any[];
  heights: any[];
  notes: string;
  timestamp: string;
  address?: string;
  // New: Quote line items with pricing
  lines?: QuoteLine[];
  total?: number;
  // Concrete mode data
  concrete?: {
    slabs: Array<{
      id: string;
      area_sqft: number;
      thickness_in: number;
      finish: string;
      reinforcement: string;
      demo_included: boolean;
      cubic_yards: number;
    }>;
    lines: Array<{
      id: string;
      lineal_feet: number;
      line_type: 'saw_cut' | 'forming' | 'thickened_edge';
    }>;
    totalCubicYards: number;
    quoteTotal: number;
  };
  // Stall striping data
  stallGroups?: Array<{
    id: string;
    stall_count: number;
    lineal_feet: number;
    row_length_ft: number;
  }>;
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
        const calculatorItems: Array<{
          service_id: string;
          service_name: string;
          description: string;
          quantity: number;
          unit_price: number;
        }> = [];

        // Handle Concrete mode data
        if (quoteData.concrete) {
          const { slabs, lines, totalCubicYards, quoteTotal } = quoteData.concrete;

          // Add concrete summary
          calculatorItems.push({
            service_id: "",
            service_name: `Concrete Work: ${quoteData.totalArea.toFixed(0)} sq ft`,
            description: `${slabs.length} slab(s), ${totalCubicYards.toFixed(2)} yd³ total`,
            quantity: Math.ceil(quoteData.totalArea),
            unit_price: quoteTotal > 0 ? quoteTotal / Math.ceil(quoteData.totalArea) : 0
          });

          // Add individual slabs
          slabs.forEach((slab, idx) => {
            calculatorItems.push({
              service_id: "",
              service_name: `Slab ${idx + 1}: ${slab.area_sqft.toFixed(0)} sq ft`,
              description: `${slab.thickness_in}" thick, ${slab.finish} finish, ${slab.reinforcement}${slab.demo_included ? ', includes demo' : ''} - ${slab.cubic_yards.toFixed(2)} yd³`,
              quantity: Math.ceil(slab.area_sqft),
              unit_price: 0
            });
          });

          // Add line items (saw cuts, forming, etc.)
          lines.forEach((line, idx) => {
            const typeLabels: Record<string, string> = {
              saw_cut: 'Saw Cuts',
              forming: 'Forming',
              thickened_edge: 'Thickened Edge'
            };
            calculatorItems.push({
              service_id: "",
              service_name: `${typeLabels[line.line_type] || line.line_type}: ${line.lineal_feet} lf`,
              description: `Linear measurement for ${typeLabels[line.line_type]?.toLowerCase() || line.line_type}`,
              quantity: Math.ceil(line.lineal_feet),
              unit_price: 0
            });
          });
        }
        // Handle Stall striping data
        else if (quoteData.stallGroups && quoteData.stallGroups.length > 0) {
          const totalStalls = quoteData.stallGroups.reduce((sum, g) => sum + g.stall_count, 0);
          const totalLinealFeet = quoteData.stallGroups.reduce((sum, g) => sum + g.lineal_feet, 0);

          calculatorItems.push({
            service_id: "",
            service_name: `Parking Lot Striping: ${totalStalls} stalls`,
            description: `${quoteData.stallGroups.length} row(s), ${totalLinealFeet.toFixed(0)} lineal feet total`,
            quantity: totalStalls,
            unit_price: 0
          });

          quoteData.stallGroups.forEach((group, idx) => {
            calculatorItems.push({
              service_id: "",
              service_name: `Row ${idx + 1}: ${group.stall_count} stalls`,
              description: `Row length: ${group.row_length_ft.toFixed(1)} ft, ${group.lineal_feet.toFixed(0)} lf striping`,
              quantity: group.stall_count,
              unit_price: 0
            });
          });
        }
        // Check for new line items format (from quote store)
        else if (quoteData.lines && quoteData.lines.length > 0) {
          // Use the structured line items with pricing
          quoteData.lines.forEach((line) => {
            calculatorItems.push({
              service_id: line.serviceId || "",
              service_name: line.serviceName || "Service",
              description: `${line.measurementValue.toFixed(0)} ${line.measurementValue > 100 ? 'sq ft' : 'lf'} @ $${line.rate.toFixed(2)}`,
              quantity: Math.ceil(line.measurementValue),
              unit_price: line.rate
            });
          });
        }
        // Default: standard area measurement
        else {
          calculatorItems.push({
            service_id: "",
            service_name: `Area Measurement: ${quoteData.totalArea.toFixed(0)} sq ft`,
            description: `Total Area: ${quoteData.totalArea.toFixed(0)} sq ft, Perimeter: ${quoteData.totalPerimeter.toFixed(0)} ft${quoteData.notes ? ` - Notes: ${quoteData.notes}` : ''}`,
            quantity: Math.ceil(quoteData.totalArea),
            unit_price: 0
          });

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
              <strong>Quote Ready!</strong>{' '}
              {receivedData.lines && receivedData.lines.length > 0 ? (
                <>
                  {receivedData.lines.length} service{receivedData.lines.length > 1 ? 's' : ''}{' '}
                  {receivedData.total && receivedData.total > 0 && (
                    <strong style={{ marginLeft: 8, fontSize: '1.1em' }}>
                      ${receivedData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  )}
                  {receivedData.address && (
                    <span style={{ opacity: 0.9, marginLeft: 8 }}>- {receivedData.address}</span>
                  )}
                </>
              ) : receivedData.concrete ? (
                <>
                  {receivedData.totalArea.toFixed(0)} sq ft concrete, {receivedData.concrete.totalCubicYards.toFixed(2)} yd³
                  {receivedData.concrete.slabs.length > 0 && ` (${receivedData.concrete.slabs.length} slab${receivedData.concrete.slabs.length > 1 ? 's' : ''})`}
                  {receivedData.concrete.lines.length > 0 && `, ${receivedData.concrete.lines.reduce((sum, l) => sum + l.lineal_feet, 0).toFixed(0)} lf cuts/forming`}
                </>
              ) : receivedData.stallGroups && receivedData.stallGroups.length > 0 ? (
                <>
                  {receivedData.stallGroups.reduce((sum, g) => sum + g.stall_count, 0)} stalls, {receivedData.stallGroups.reduce((sum, g) => sum + g.lineal_feet, 0).toFixed(0)} lf striping
                  {` (${receivedData.stallGroups.length} row${receivedData.stallGroups.length > 1 ? 's' : ''})`}
                </>
              ) : (
                <>
                  {receivedData.totalArea.toFixed(0)} sq ft, {receivedData.totalPerimeter.toFixed(0)} ft perimeter
                  {receivedData.shapes.length > 1 && ` (${receivedData.shapes.length} shapes)`}
                </>
              )}
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
          {/* Embed the live area-bid-helper app with industry preset */}
          <iframe
            src="https://area-bid-helper.vercel.app/quote/map?industry=sealing-striping&embedded=true"
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
