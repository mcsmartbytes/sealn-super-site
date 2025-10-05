"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AreaHelperPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Set the Mapbox token globally for the web component
    if (typeof window !== 'undefined') {
      (window as any).MAPBOX_TOKEN = 'pk.eyJ1Ijoic2VhbG5zdHJpcGVuc3BlY2lhbGlzdCIsImEiOiJjbWZtaXE4aW4wMmE5MmpvaWEzMms2MXg3In0.2Py8b4hLtIqzLHVGAo9sYg';

      // Load the script dynamically
      const script = document.createElement('script');
      script.src = '/area-bid-helper.js';
      script.async = true;
      script.onload = () => {
        console.log('area-bid-helper.js loaded');
        setScriptLoaded(true);
      };
      script.onerror = (e) => {
        console.error('Failed to load area-bid-helper.js', e);
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0 }}>
        <AdminNav />
        <div style={{ flex: 1 }}>
          {!scriptLoaded ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <div style={{ fontSize: '18px', color: '#666' }}>Loading map...</div>
              </div>
            </div>
          ) : (
            // @ts-ignore - Web component
            <area-bid-helper style={{ display: 'block', width: '100%', height: '100%' }} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
