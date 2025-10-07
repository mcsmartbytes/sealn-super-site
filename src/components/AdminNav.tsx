import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/admin" className="text-xl font-bold text-brand-gold hover:text-yellow-500">
            Admin Dashboard
          </Link>
          <Link href="/admin" className="hover:text-brand-gold transition">
            Dashboard
          </Link>
          <Link href="/admin/estimates" className="hover:text-brand-gold transition">
            Estimates
          </Link>
          <Link href="/admin/invoices" className="hover:text-brand-gold transition">
            Invoices
          </Link>
          <Link href="/admin/customers" className="hover:text-brand-gold transition">
            Customers
          </Link>
          <Link href="/admin/inquiries" className="hover:text-brand-gold transition">
            Inquiries
          </Link>
          <Link href="/admin/services" className="hover:text-brand-gold transition">
            Services
          </Link>
          <Link href="/admin/calculator" className="hover:text-brand-gold transition">
            Calculator
          </Link>
          <Link href="/admin/area-helper" className="hover:text-brand-gold transition">
            Area Helper
          </Link>
          <Link href="/" className="hover:text-brand-gold transition">
            View Site
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
