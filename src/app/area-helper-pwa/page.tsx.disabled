"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Script from "next/script";

export default function AreaHelperPWAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('Please log in to use Area Helper Pro');
      router.push('/admin/login?redirect=/area-helper-pwa');
      return;
    }

    // Check subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      alert('Active subscription required. Redirecting to subscription page...');
      router.push('/subscribe');
      return;
    }

    // Check if still valid
    if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
      alert('Your subscription has expired. Please renew.');
      router.push('/subscribe');
      return;
    }

    setHasAccess(true);
    setLoading(false);

    // Set Mapbox token
    if (typeof window !== 'undefined') {
      (window as any).MAPBOX_TOKEN = 'pk.eyJ1Ijoic2VhbG5zdHJpcGVuc3BlY2lhbGlzdCIsImEiOiJjbWZtaXE4aW4wMmE5MmpvaWEzMms2MXg3In0.2Py8b4hLtIqzLHVGAo9sYg';
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Verifying subscription...</div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0 }}>
        {/* @ts-ignore - Web component */}
        <area-bid-helper style={{ display: 'block', flex: 1 }} />
      </div>
      <Script src="/area-bid-helper.js" strategy="afterInteractive" />
    </>
  );
}
