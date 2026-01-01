
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabase';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import AdminNav from '../../../../components/AdminNav';

// Rich demo data for Westfield (demo-1) - flagship demo customer
const DEMO_CUSTOMER_WESTFIELD = {
  id: 'demo-1',
  name: 'Westfield Property Management',
  email: 'facilities@westfield.com',
  phone: '(312) 555-0100',
  address: '123 Mall Blvd, Chicago, IL 60601',
  company: 'Westfield Corporation',
  notes: 'Premium client - handles 12 shopping centers in the Chicago metro area. Preferred scheduling: weeknight work after 9pm. Contact: Mike Reynolds (Facilities Director)',
  created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
};

const DEMO_JOBS_WESTFIELD = [
  {
    id: 'job-1',
    customer_id: 'demo-1',
    job_name: 'Westfield Old Orchard - Main Lot',
    description: 'Complete sealcoating and restriping of main visitor parking lot. 245,000 sq ft with 1,200 parking spaces. Includes ADA compliance updates.',
    status: 'completed',
    value: 87500,
    sqft: 245000,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: '2024-10-15',
    services: ['Sealcoating', 'Crack Filling', 'Line Striping', 'ADA Markings'],
  },
  {
    id: 'job-2',
    customer_id: 'demo-1',
    job_name: 'Westfield Hawthorn - North Parking Structure',
    description: 'Multi-level parking structure restoration. Levels 1-3 sealcoating with specialty coatings for covered areas. Traffic flow optimization.',
    status: 'active',
    value: 156000,
    sqft: 380000,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    scheduled_date: '2024-12-01',
    services: ['Sealcoating', 'Pothole Repair', 'ADA Compliance', 'Directional Arrows', 'Fire Lane Markings'],
  },
  {
    id: 'job-3',
    customer_id: 'demo-1',
    job_name: 'Westfield Fox Valley - Employee Lot',
    description: 'Employee parking area behind mall. Includes new speed bump installation and updated wayfinding signage.',
    status: 'scheduled',
    value: 42000,
    sqft: 85000,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    scheduled_date: '2025-03-15',
    services: ['Sealcoating', 'Line Striping', 'Speed Bump Installation'],
  }
];

const DEMO_MEDIA_WESTFIELD = [
  // Job 1 Photos - Completed project
  { id: 'm1', customer_id: 'demo-1', job_id: 'job-1', file_type: 'photo', original_filename: 'before-main-entrance.jpg', public_url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600', uploaded_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Before - Main entrance showing wear' },
  { id: 'm2', customer_id: 'demo-1', job_id: 'job-1', file_type: 'photo', original_filename: 'crack-filling-progress.jpg', public_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', uploaded_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Crack filling in progress' },
  { id: 'm3', customer_id: 'demo-1', job_id: 'job-1', file_type: 'photo', original_filename: 'sealcoat-application.jpg', public_url: 'https://images.unsplash.com/photo-1621976498727-9e5d56476276?w=600', uploaded_at: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Sealcoat application - Section A' },
  { id: 'm4', customer_id: 'demo-1', job_id: 'job-1', file_type: 'photo', original_filename: 'striping-complete.jpg', public_url: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600', uploaded_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Fresh striping completed' },
  { id: 'm5', customer_id: 'demo-1', job_id: 'job-1', file_type: 'photo', original_filename: 'ada-parking-complete.jpg', public_url: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=600', uploaded_at: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(), caption: 'ADA spaces - final result' },
  { id: 'm6', customer_id: 'demo-1', job_id: 'job-1', file_type: 'photo', original_filename: 'aerial-finished.jpg', public_url: 'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?w=600', uploaded_at: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Aerial view - project complete' },

  // Job 2 Photos - In Progress
  { id: 'm7', customer_id: 'demo-1', job_id: 'job-2', file_type: 'photo', original_filename: 'structure-level1.jpg', public_url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600', uploaded_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Structure Level 1 - prep work' },
  { id: 'm8', customer_id: 'demo-1', job_id: 'job-2', file_type: 'photo', original_filename: 'crack-sealing.jpg', public_url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600', uploaded_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Crack sealing complete - Level 1' },
  { id: 'm9', customer_id: 'demo-1', job_id: 'job-2', file_type: 'photo', original_filename: 'equipment-setup.jpg', public_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600', uploaded_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), caption: 'Equipment staged for Level 2' },
];

const DEMO_ESTIMATES_WESTFIELD = [
  { id: 'EST-2024-089', customer_id: 'demo-1', description: 'Westfield Old Orchard - Main Lot Complete Resurfacing', total_amount: 87500, status: 'accepted', created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-2024-112', customer_id: 'demo-1', description: 'Westfield Hawthorn - North Parking Structure', total_amount: 156000, status: 'accepted', created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-2024-145', customer_id: 'demo-1', description: 'Westfield Fox Valley - Employee Lot', total_amount: 42000, status: 'pending', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EST-2024-158', customer_id: 'demo-1', description: 'Westfield Stratford - Emergency Pothole Repairs', total_amount: 8500, status: 'draft', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

const DEMO_INVOICES_WESTFIELD = [
  { id: 'INV-2024-067', customer_id: 'demo-1', description: 'Old Orchard - Deposit (50%)', total_amount: 43750, status: 'paid', created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), paid_date: '2024-09-18' },
  { id: 'INV-2024-078', customer_id: 'demo-1', description: 'Old Orchard - Final Payment', total_amount: 43750, status: 'paid', created_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), paid_date: '2024-10-25' },
  { id: 'INV-2024-089', customer_id: 'demo-1', description: 'Hawthorn - Deposit (50%)', total_amount: 78000, status: 'paid', created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), paid_date: '2024-11-05' },
  { id: 'INV-2024-102', customer_id: 'demo-1', description: 'Hawthorn - Progress Payment', total_amount: 39000, status: 'pending', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), due_date: '2024-12-15' },
  { id: 'INV-2024-115', customer_id: 'demo-1', description: 'Hawthorn - Final Payment (pending completion)', total_amount: 39000, status: 'draft', created_at: null, due_date: null },
];

export default function CustomerDetailPage() {
  return (
    <ProtectedRoute>
      <CustomerDetail />
    </ProtectedRoute>
  );
}

function CustomerDetail() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Job form
  const [jobForm, setJobForm] = useState({ job_name: '', description: '', status: 'active' });
  const [showJobForm, setShowJobForm] = useState(false);

  // Media upload
  const [uploading, setUploading] = useState(false);

  // Photo lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    const demoSession = typeof window !== 'undefined' && localStorage.getItem('demoSession') === 'true';
    setIsDemoMode(demoSession);

    if (demoSession && customerId === 'demo-1') {
      // Load rich demo data for Westfield
      setCustomer(DEMO_CUSTOMER_WESTFIELD);
      setJobs(DEMO_JOBS_WESTFIELD);
      setMedia(DEMO_MEDIA_WESTFIELD);
      setEstimates(DEMO_ESTIMATES_WESTFIELD);
      setInvoices(DEMO_INVOICES_WESTFIELD);
      setLoading(false);
    } else if (demoSession) {
      // Basic demo customer for other demo IDs
      setCustomer({
        id: customerId,
        name: 'Demo Customer',
        email: 'demo@example.com',
        phone: '(555) 555-0000',
        address: '123 Demo St',
        company: 'Demo Company',
        created_at: new Date().toISOString(),
      });
      setJobs([]);
      setMedia([]);
      setEstimates([]);
      setInvoices([]);
      setLoading(false);
    } else {
      fetchCustomer();
      fetchJobs();
      fetchMedia();
    }
  }, [customerId]);

  async function fetchCustomer() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      router.push('/admin/customers');
    } else {
      setCustomer(data);
    }
    setLoading(false);
  }

  async function fetchJobs() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (!error) setJobs(data || []);
  }

  async function fetchMedia() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('customer_photos')
      .select('*')
      .eq('customer_id', customerId)
      .order('uploaded_at', { ascending: false });

    if (!error) setMedia(data || []);
  }

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();

    if (isDemoMode) {
      // Demo mode - add to local state
      const newJob = {
        id: `job-demo-${Date.now()}`,
        customer_id: customerId,
        ...jobForm,
        created_at: new Date().toISOString(),
        services: [],
      };
      setJobs([newJob, ...jobs]);
      setJobForm({ job_name: '', description: '', status: 'active' });
      setShowJobForm(false);
      return;
    }

    const { error } = await supabase.from('jobs').insert([{
      customer_id: customerId,
      ...jobForm
    }]);

    if (!error) {
      setJobForm({ job_name: '', description: '', status: 'active' });
      setShowJobForm(false);
      fetchJobs();
    }
  }

  async function handleDeleteJob(jobId: string | number) {
    if (!confirm('Delete this job?')) return;

    if (isDemoMode) {
      setJobs(jobs.filter(j => j.id !== jobId));
      return;
    }

    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (!error) fetchJobs();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, jobId?: string | number) {
    if (!e.target.files || e.target.files.length === 0) return;

    if (isDemoMode) {
      alert('File upload is disabled in demo mode');
      return;
    }

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${customerId}-${Date.now()}.${fileExt}`;
    const filePath = `customer-media/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      await supabase.from('customer_photos').insert([{
        customer_id: customerId,
        job_id: jobId || null,
        filename: fileName,
        original_filename: file.name,
        file_type: file.type.startsWith('image/') ? 'photo' : 'video',
        file_size: file.size,
        public_url: publicUrl
      }]);

      fetchMedia();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Make sure Supabase Storage bucket "media" exists.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteMedia(mediaId: string | number, filename: string) {
    if (!confirm('Delete this file?')) return;

    if (isDemoMode) {
      setMedia(media.filter(m => m.id !== mediaId));
      return;
    }

    await supabase.storage.from('media').remove([`customer-media/${filename}`]);
    await supabase.from('customer_photos').delete().eq('id', mediaId);
    fetchMedia();
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading customer...</div>
      </div>
    </div>
  );

  if (!customer) return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Customer not found</p>
        <button
          onClick={() => router.push('/admin/customers')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Customers
        </button>
      </div>
    </div>
  );

  // Calculate totals
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const activeJobsCount = jobs.filter(j => j.status === 'active').length;

  const statusColors: Record<string, string> = {
    'completed': 'bg-green-100 text-green-800',
    'active': 'bg-blue-100 text-blue-800',
    'scheduled': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'accepted': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'draft': 'bg-gray-100 text-gray-800',
    'paid': 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      {/* Demo Banner */}
      {isDemoMode && customerId === 'demo-1' && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium">
          Viewing demo customer with sample jobs, photos, estimates & invoices
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <button onClick={() => router.push('/admin/customers')} className="text-blue-600 hover:underline mb-2 text-sm">
            ← Back to Customers
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-brand-navy">{customer.name}</h1>
              {customer.company && <p className="text-lg text-gray-600">{customer.company}</p>}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <span>📧 {customer.email}</span>
                <span>📞 {customer.phone}</span>
                <span>📍 {customer.address}</span>
              </div>
              {customer.notes && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  <strong>Notes:</strong> {customer.notes}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  sessionStorage.setItem('preselectedCustomer', JSON.stringify(customer));
                  router.push('/admin/estimates');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
              >
                + Estimate
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('preselectedCustomer', JSON.stringify(customer));
                  router.push('/admin/invoices');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              >
                + Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase">Revenue (Paid)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{jobs.length}</p>
              <p className="text-xs text-gray-500 uppercase">Total Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{activeJobsCount}</p>
              <p className="text-xs text-gray-500 uppercase">Active Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{media.length}</p>
              <p className="text-xs text-gray-500 uppercase">Photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { key: 'info', label: 'Overview' },
              { key: 'jobs', label: `Jobs (${jobs.length})` },
              { key: 'media', label: `Photos (${media.length})` },
              { key: 'estimates', label: `Estimates (${estimates.length})` },
              { key: 'invoices', label: `Invoices (${invoices.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-4 font-medium border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-brand-gold text-brand-navy bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Info/Overview Tab */}
        {activeTab === 'info' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Company</label>
                    <p className="font-medium">{customer.company || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{customer.phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium">{customer.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Customer Since</label>
                  <p className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              {jobs.length === 0 && estimates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activity yet</p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{job.job_name}</p>
                        <p className="text-sm text-gray-500">{job.sqft?.toLocaleString()} sq ft</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || 'bg-gray-100'}`}>
                          {job.status}
                        </span>
                        {job.value && <p className="text-green-600 font-bold mt-1">${job.value.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Jobs</h2>
                <button
                  onClick={() => setShowJobForm(!showJobForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                >
                  + Add Job
                </button>
              </div>

              {showJobForm && (
                <form onSubmit={handleAddJob} className="mb-6 p-4 border rounded bg-gray-50 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Name *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.job_name}
                      onChange={(e) => setJobForm({ ...jobForm, job_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Main Parking Lot Sealcoating"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={jobForm.status}
                      onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                      Save Job
                    </button>
                    <button type="button" onClick={() => setShowJobForm(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {jobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No jobs yet. Add one above!</p>
              ) : (
                <div className="space-y-6">
                  {jobs.map((job) => {
                    const jobMedia = media.filter(m => m.job_id === job.id);
                    return (
                      <div key={job.id} className="border rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800">{job.job_name}</h3>
                            <p className="text-gray-600 mt-1">{job.description}</p>
                            {job.sqft && <p className="text-sm text-gray-500 mt-1">{job.sqft.toLocaleString()} sq ft</p>}
                            {job.services && job.services.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {job.services.map((s: string) => (
                                  <span key={s} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[job.status] || 'bg-gray-100'}`}>
                              {job.status}
                            </span>
                            {job.value && <p className="text-2xl font-bold text-green-600 mt-2">${job.value.toLocaleString()}</p>}
                            {job.completed_at && <p className="text-sm text-gray-500 mt-1">Completed: {job.completed_at}</p>}
                            {job.scheduled_date && job.status !== 'completed' && (
                              <p className="text-sm text-gray-500 mt-1">Scheduled: {job.scheduled_date}</p>
                            )}
                          </div>
                        </div>

                        {/* Job Photos */}
                        {jobMedia.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-gray-700 mb-3">Photos ({jobMedia.length})</h4>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                              {jobMedia.map((item) => (
                                <div
                                  key={item.id}
                                  className="relative group cursor-pointer"
                                  onClick={() => setSelectedPhoto(item)}
                                >
                                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                                    <img
                                      src={item.public_url}
                                      alt={item.caption || item.original_filename}
                                      className="w-full h-full object-cover group-hover:scale-105 transition"
                                    />
                                  </div>
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 text-2xl">🔍</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <label className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 cursor-pointer font-medium">
                            + Add Photo
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleFileUpload(e, job.id)}
                              disabled={uploading || isDemoMode}
                              className="hidden"
                            />
                          </label>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 font-medium"
                          >
                            Delete Job
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Photos & Videos</h2>
              <label className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer font-semibold">
                {uploading ? 'Uploading...' : '+ Upload File'}
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e)}
                  disabled={uploading || isDemoMode}
                  className="hidden"
                />
              </label>
            </div>

            {media.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No media yet. Upload some files!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {media.map((item) => {
                  const job = jobs.find(j => j.id === item.job_id);
                  return (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedPhoto(item)}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 shadow hover:shadow-lg transition">
                        {item.file_type === 'photo' ? (
                          <img
                            src={item.public_url}
                            alt={item.caption || item.original_filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <video src={item.public_url} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium truncate">{item.caption || item.original_filename}</p>
                        {job && <p className="text-xs text-blue-600">{job.job_name}</p>}
                        <p className="text-xs text-gray-400">{new Date(item.uploaded_at).toLocaleDateString()}</p>
                      </div>
                      {!isDemoMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(item.id, item.filename);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Estimates Tab */}
        {activeTab === 'estimates' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Estimates</h2>
              <button
                onClick={() => {
                  sessionStorage.setItem('preselectedCustomer', JSON.stringify(customer));
                  router.push('/admin/estimates');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
              >
                + Create Estimate
              </button>
            </div>

            {estimates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No estimates yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 font-semibold">Estimate #</th>
                      <th className="p-3 font-semibold">Description</th>
                      <th className="p-3 font-semibold">Amount</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimates.map((est) => (
                      <tr key={est.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{est.id}</td>
                        <td className="p-3">{est.description}</td>
                        <td className="p-3 font-bold text-green-600">${est.total_amount?.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[est.status] || 'bg-gray-100'}`}>
                            {est.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">{new Date(est.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Invoices</h2>
              <button
                onClick={() => {
                  sessionStorage.setItem('preselectedCustomer', JSON.stringify(customer));
                  router.push('/admin/invoices');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              >
                + Create Invoice
              </button>
            </div>

            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 font-semibold">Invoice #</th>
                      <th className="p-3 font-semibold">Description</th>
                      <th className="p-3 font-semibold">Amount</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{inv.id}</td>
                        <td className="p-3">{inv.description}</td>
                        <td className="p-3 font-bold text-green-600">${inv.total_amount?.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[inv.status] || 'bg-gray-100'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {inv.status === 'paid' && inv.paid_date ? (
                            <span>Paid: {inv.paid_date}</span>
                          ) : inv.status === 'pending' && inv.due_date ? (
                            <span>Due: {inv.due_date}</span>
                          ) : inv.created_at ? (
                            new Date(inv.created_at).toLocaleDateString()
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.public_url}
              alt={selectedPhoto.caption || selectedPhoto.original_filename}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-white text-lg">{selectedPhoto.caption || selectedPhoto.original_filename}</p>
              <p className="text-gray-400 text-sm">{new Date(selectedPhoto.uploaded_at).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 font-light"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
