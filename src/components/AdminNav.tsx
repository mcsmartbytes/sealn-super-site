'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function AdminNav() {
  const router = useRouter();
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const isDemoMode = localStorage.getItem('presentationMode') === 'true';
    setDemoMode(isDemoMode);
  }, []);

  const toggleDemoMode = () => {
    const newMode = !demoMode;
    setDemoMode(newMode);
    localStorage.setItem('presentationMode', newMode.toString());
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Full navigation links
  const fullLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/area-helper', label: 'Area Bid Calculator' },
    { href: '/admin/estimates', label: 'Estimates' },
    { href: '/admin/invoices', label: 'Invoices' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/inquiries', label: 'Inquiries' },
    { href: '/admin/expense-tracker', label: 'Expenses' },
    { href: '/admin/crm', label: 'CRM' },
    { href: '/admin/sitesense', label: 'SiteSense' },
    { href: '/admin/books', label: 'Books' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/calculator', label: 'Calculator' },
  ];

  // Streamlined links for presentation/demo mode
  const demoLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/area-helper', label: 'Area Bid Calculator' },
    { href: '/admin/estimates', label: 'Estimates' },
    { href: '/admin/invoices', label: 'Invoices' },
    { href: '/admin/customers', label: 'Customers' },
  ];

  const links = demoMode ? demoLinks : fullLinks;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="text-xl font-bold text-brand-gold hover:text-yellow-500">
            Sealn Pro
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand-gold transition text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/" className="hover:text-brand-gold transition text-sm">
            View Site
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDemoMode}
            className={`px-3 py-1 rounded text-sm transition ${
              demoMode
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={demoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
          >
            {demoMode ? 'Demo ON' : 'Demo'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
