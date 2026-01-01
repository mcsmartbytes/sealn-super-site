"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";

// Demo estimates for presentation mode
const DEMO_ESTIMATES = [
  { id: 'demo-1', customer_id: 'demo-1', total_amount: 87500, status: 'accepted', description: 'Westfield Mall - Main Parking Lot Sealcoating', customers: { name: 'Westfield Property Management' }, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-2', customer_id: 'demo-2', total_amount: 156000, status: 'pending', description: "O'Hare Employee Lot C - Complete Reseal & Striping", customers: { name: 'Chicago Dept of Aviation' }, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-3', customer_id: 'demo-3', total_amount: 125000, status: 'accepted', description: 'Costco Distribution Center - 380,000 sq ft', customers: { name: 'Costco Wholesale' }, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-4', customer_id: 'demo-4', total_amount: 68500, status: 'draft', description: 'Target Plaza - Front & Side Lots', customers: { name: 'Target Corporation' }, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-5', customer_id: 'demo-5', total_amount: 45000, status: 'pending', description: 'Marriott Hotel Complex - Guest & Valet Areas', customers: { name: 'Marriott International' }, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-6', customer_id: 'demo-6', total_amount: 215000, status: 'accepted', description: 'Mall of America - Section A & B Parking Structures', customers: { name: 'Simon Property Group' }, created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
];

export function useEstimates() {
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';
    setIsDemoMode(demoSession);

    if (demoSession) {
      setEstimates(DEMO_ESTIMATES);
      setLoading(false);
    } else {
      fetchEstimates();
    }
  }, []);

  async function fetchEstimates() {
    if (isDemoMode) return;

    setLoading(true);

    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("estimates")
      .select("*, customers(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading estimates:", error);
    } else {
      setEstimates(data || []);
    }

    setLoading(false);
  }

  async function addEstimate(estimate: any) {
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';

    if (demoSession) {
      const newEstimate = {
        ...estimate,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
        customers: { name: estimate.customer_name || 'New Customer' },
      };
      setEstimates(prev => [newEstimate, ...prev]);
      return { data: newEstimate, error: null };
    }

    if (!supabase) return { data: null, error: 'No connection' };

    const { data, error } = await supabase.from("estimates").insert([estimate]);
    if (!error) fetchEstimates();
    else console.error("Add estimate error:", error);
    return { data, error };
  }

  async function deleteEstimate(id: string) {
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';

    if (demoSession) {
      setEstimates(prev => prev.filter(e => e.id !== id));
      return { data: null, error: null };
    }

    if (!supabase) return { data: null, error: 'No connection' };

    const { data, error } = await supabase.from("estimates").delete().eq("id", id);
    if (!error) fetchEstimates();
    else console.error("Delete estimate error:", error);
    return { data, error };
  }

  return {
    estimates,
    loading,
    addEstimate,
    deleteEstimate,
    fetchEstimates,
  };
}

