"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";

export function useInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers(name)")
      .order("created_at", { ascending: false });

    if (error) console.error("Error loading invoices:", error);
    else setInvoices(data || []);
    setLoading(false);
  }

  async function addInvoice(invoice: any) {
    const { data, error } = await supabase.from("invoices").insert([invoice]);
    if (!error) fetchInvoices();
    else console.error("Add invoice error:", error);
    return { data, error };
  }

  async function deleteInvoice(id: string) {
    const { data, error } = await supabase.from("invoices").delete().eq("id", id);
    if (!error) fetchInvoices();
    else console.error("Delete invoice error:", error);
    return { data, error };
  }

  return {
    invoices,
    loading,
    addInvoice,
    deleteInvoice,
    fetchInvoices,
  };
}

