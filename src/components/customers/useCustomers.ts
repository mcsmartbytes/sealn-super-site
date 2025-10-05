import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading customers:", error);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  }

  async function addCustomer(customer: any) {
    const { data, error } = await supabase.from("customers").insert([customer]);
    if (error) {
      console.error("Insert error:", error);
    } else {
      fetchCustomers();
    }
    return { data, error };
  }

  async function deleteCustomer(id: string) {
    const { data, error } = await supabase.from("customers").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchCustomers();
    return { data, error };
  }

  async function updateCustomer(id: string, updates: any) {
    const { data, error } = await supabase.from("customers").update(updates).eq("id", id);
    if (error) console.error("Update error:", error);
    else fetchCustomers();
    return { data, error };
  }

  return {
    customers,
    loading,
    addCustomer,
    deleteCustomer,
    updateCustomer,
    fetchCustomers,
  };
}

