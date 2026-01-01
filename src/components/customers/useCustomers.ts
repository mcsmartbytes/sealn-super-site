import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";

// Demo customers for presentation mode
const DEMO_CUSTOMERS = [
  { id: 'demo-1', name: 'Westfield Property Management', email: 'facilities@westfield.com', phone: '(312) 555-0100', address: '123 Mall Blvd, Chicago, IL', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-2', name: 'Chicago Dept of Aviation', email: 'contracts@flychicago.com', phone: '(312) 555-0200', address: "10000 W O'Hare Ave, Chicago, IL", created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-3', name: 'Costco Wholesale', email: 'facilities@costco.com', phone: '(312) 555-0300', address: '2700 N Clybourn Ave, Chicago, IL', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-4', name: 'Target Corporation', email: 'vendorpay@target.com', phone: '(312) 555-0400', address: '1520 N Ashland Ave, Chicago, IL', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-5', name: 'Marriott International', email: 'facilities@marriott.com', phone: '(312) 555-0500', address: '540 N Michigan Ave, Chicago, IL', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-6', name: 'Simon Property Group', email: 'operations@simon.com', phone: '(312) 555-0600', address: '225 W Washington St, Chicago, IL', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
];

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';
    setIsDemoMode(demoSession);

    if (demoSession) {
      setCustomers(DEMO_CUSTOMERS);
      setLoading(false);
    } else {
      fetchCustomers();
    }
  }, []);

  async function fetchCustomers() {
    if (isDemoMode) {
      return; // Don't fetch in demo mode
    }

    setLoading(true);

    if (!supabase) {
      setLoading(false);
      return;
    }

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
    // Check for demo mode
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';

    if (demoSession) {
      // In demo mode, add to local state only
      const newCustomer = {
        ...customer,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setCustomers(prev => [newCustomer, ...prev]);
      return newCustomer;
    }

    if (!supabase) return null;

    const { data, error } = await supabase
      .from("customers")
      .insert([customer])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
    } else {
      fetchCustomers();
    }
    return data;
  }

  async function deleteCustomer(id: string) {
    // Check for demo mode
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';

    if (demoSession) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      return { data: null, error: null };
    }

    if (!supabase) return { data: null, error: 'No connection' };

    const { data, error } = await supabase.from("customers").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchCustomers();
    return { data, error };
  }

  async function updateCustomer(id: string, updates: any) {
    // Check for demo mode
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';

    if (demoSession) {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return { data: null, error: null };
    }

    if (!supabase) return { data: null, error: 'No connection' };

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

