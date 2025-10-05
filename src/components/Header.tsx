'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-lg md:text-xl font-bold text-brand-gold hover:text-yellow-500 transition">
            <Image src="/Transparent webpage.webp" alt="Seal'n & Stripe'n Specialist Logo" width={100} height={50} className="md:w-[120px] md:h-[60px]" />
            <span className="hidden sm:inline">Seal'n & Stripe'n Specialist</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link href="/" className="text-white hover:text-brand-gold transition font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="#services" className="text-white hover:text-brand-gold transition font-medium">
                Services
              </Link>
            </li>
            <li>
              <Link href="#portfolio" className="text-white hover:text-brand-gold transition font-medium">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-white hover:text-brand-gold transition font-medium">
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-brand-gold transition font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-brand-gold transition font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-brand-gold transition font-medium">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-brand-gold transition font-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}