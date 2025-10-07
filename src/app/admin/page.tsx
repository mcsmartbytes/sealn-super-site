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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </ProtectedRoute>
  );
}
