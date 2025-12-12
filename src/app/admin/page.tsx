"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-navy font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
