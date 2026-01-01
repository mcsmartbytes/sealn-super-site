'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();

    // Only set up Supabase listener if supabase is available
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          // Check if in demo mode before redirecting
          const isDemoMode = localStorage.getItem('demoSession') === 'true';
          if (!isDemoMode) {
            setAuthenticated(false);
            router.push('/admin/login');
          }
        } else if (event === 'SIGNED_IN') {
          setAuthenticated(true);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [router]);

  const checkAuth = async () => {
    // Check for demo session first
    const isDemoMode = localStorage.getItem('demoSession') === 'true';
    if (isDemoMode) {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    // If no supabase, redirect to login
    if (!supabase) {
      router.push('/admin/login');
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/admin/login');
      } else {
        setAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      router.push('/admin/login');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
