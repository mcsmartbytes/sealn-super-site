"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";

export function useEstimates() {
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimates();
  }, []);

  async function fetchEstimates() {
    setLoading(true);
    const { data, error } = await supabase
      .from("estimates")
      .select("*, customers(name)") // include customer name
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading estimates:", error);
    } else {
      setEstimates(data || []);
    }

    setLoading(false);
  }

  async function addEstimate(estimate: any) {
    const { data, error } = await supabase.from("estimates").insert([estimate]);
    if (!error) fetchEstimates();
    else console.error("Add estimate error:", error);
    return { data, error };
  }

  async function deleteEstimate(id: string) {
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

