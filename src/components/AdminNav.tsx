'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

export default function AdminNav() {
  const router = useRouter();
  const [demoMode, setDemoMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDemoMode = localStorage.getItem('presentationMode') === 'true';
    setDemoMode(isDemoMode);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDemoMode = () => {
    const newMode = !demoMode;
    setDemoMode(newMode);
    localStorage.setItem('presentationMode', newMode.toString());
  };

  const handleLogout = async () => {
    localStorage.removeItem('demoSession');
    localStorage.removeItem('presentationMode');
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
  };

  // Grouped navigation
  const navGroups = {
    core: [
      { href: '/admin', label: 'Dashboard' },
      { href: '/admin/customers', label: 'Customers' },
    ],
    sales: [
      { href: '/admin/area-helper', label: 'Area Bid' },
      { href: '/admin/estimates', label: 'Estimates' },
      { href: '/admin/invoices', label: 'Invoices' },
      { href: '/admin/inquiries', label: 'Inquiries' },
    ],
    apps: [
      { href: '/admin/expense-tracker', label: 'Expenses' },
      { href: '/admin/crm', label: 'CRM' },
      { href: '/admin/sitesense', label: 'SiteSense' },
      { href: '/admin/books', label: 'Books' },
    ],
    tools: [
      { href: '/admin/services', label: 'Services' },
      { href: '/admin/calculator', label: 'Calculator' },
    ],
  };

  const Dropdown = ({ label, items, id }: { label: string; items: { href: string; label: string }[]; id: string }) => (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
        className="flex items-center gap-1 hover:text-brand-gold transition text-sm py-2"
      >
        {label}
        <svg className={`w-3 h-3 transition-transform ${activeDropdown === id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {activeDropdown === id && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[160px] z-50 border border-gray-700">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActiveDropdown(null)}
              className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-brand-gold transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-gray-900 text-white px-4 py-3" ref={dropdownRef}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo & Brand */}
        <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition shrink-0">
          <Image
            src="/Transparent webpage.webp"
            alt="Seal'n & Stripe'n Specialist"
            width={60}
            height={30}
            className="h-7 w-auto"
          />
          <span className="text-sm font-bold text-brand-gold hidden lg:inline">Seal'n & Stripe'n</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Core Links - Always visible */}
          {navGroups.core.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-gold transition text-sm">
              {link.label}
            </Link>
          ))}

          {/* Dropdown Menus */}
          <Dropdown label="Sales" items={navGroups.sales} id="sales" />
          {!demoMode && <Dropdown label="Apps" items={navGroups.apps} id="apps" />}
          {!demoMode && <Dropdown label="Tools" items={navGroups.tools} id="tools" />}

          <Link href="/" className="hover:text-brand-gold transition text-sm text-gray-400">
            View Site
          </Link>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDemoMode}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              demoMode
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {demoMode ? 'Preview' : 'Preview'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition text-xs"
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            {navGroups.core.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-gray-800 rounded">
                {link.label}
              </Link>
            ))}
            {navGroups.sales.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-gray-800 rounded">
                {link.label}
              </Link>
            ))}
            {!demoMode && navGroups.apps.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-gray-800 rounded">
                {link.label}
              </Link>
            ))}
            {!demoMode && navGroups.tools.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-gray-800 rounded">
                {link.label}
              </Link>
            ))}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 rounded">
              View Site
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
