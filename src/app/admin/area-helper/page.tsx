"use client";

import AdminNav from "@/components/AdminNav";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AreaHelperPage() {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0 }}>
        <AdminNav />
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
