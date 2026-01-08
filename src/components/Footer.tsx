import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-brand-gold mb-4">Seal'n & Stripe'n Specialist</h3>
            <p className="text-gray-300">Professional parking lot services for commercial properties.</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-gold mb-4">Contact</h4>
            <p className="text-gray-300">Email: gary@sealnstripenspecialist.com</p>
            <p className="text-gray-300">Phone: (555) 123-4567</p>
            <p className="text-gray-300 mt-2">Chicago Metropolitan Area</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-gold mb-4">Services</h4>
            <ul className="text-gray-300 space-y-2">
              <li>Sealcoating</li>
              <li>Line Striping</li>
              <li>Crack Filling</li>
              <li>Maintenance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand-gold mb-4">Quick Links</h4>
            <ul className="text-gray-300 space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-brand-gold transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-gold transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-brand-gold transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2026 Seal'n & Stripe'n Specialist. All rights reserved.</p>
              <p className="mt-1 text-sm">
                <Link href="/privacy" className="hover:text-brand-gold transition">Privacy Policy</Link>
                {' | '}
                <Link href="/terms" className="hover:text-brand-gold transition">Terms of Service</Link>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">Powered by</span>
              <Link href="https://mcsmartbytes.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition">
                <Image
                  src="/mc-smart-bytes-logo.jpg"
                  alt="MC Smart Bytes"
                  width={36}
                  height={36}
                  className="rounded-md"
                />
                <span className="text-brand-gold font-semibold text-sm">MC Smart Bytes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}