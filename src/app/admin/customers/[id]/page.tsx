
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabase';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import AdminNav from '../../../../components/AdminNav';

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
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);

  // Job form
  const [jobForm, setJobForm] = useState({ job_name: '', description: '', status: 'active' });
  const [showJobForm, setShowJobForm] = useState(false);

  // Media upload
  const [uploading, setUploading] = useState(false);
  const [selectedJobForUpload, setSelectedJobForUpload] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomer();
    fetchJobs();
    fetchMedia();
  }, [customerId]);

  async function fetchCustomer() {
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
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (!error) setJobs(data || []);
  }

  async function fetchMedia() {
    const { data, error } = await supabase
      .from('customer_photos')
      .select('*')
      .eq('customer_id', customerId)
      .order('uploaded_at', { ascending: false });

    if (!error) setMedia(data || []);
  }

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
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

  async function handleDeleteJob(jobId: number) {
    if (!confirm('Delete this job?')) return;

    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (!error) fetchJobs();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, jobId?: number) {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${customerId}-${Date.now()}.${fileExt}`;
    const filePath = `customer-media/${fileName}`;

    try {
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Save to database with job_id if provided
      await supabase.from('customer_photos').insert([{
        customer_id: customerId,
        job_id: jobId || null,
        filename: fileName,
        original_filename: file.name,
        file_type: file.type.startsWith('image/') ? 'photo' : 'video',
        file_size: file.size
      }]);

      fetchMedia();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Make sure Supabase Storage bucket "media" exists.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteMedia(mediaId: number, filename: string) {
    if (!confirm('Delete this file?')) return;

    await supabase.storage.from('media').remove([`customer-media/${filename}`]);
    await supabase.from('customer_photos').delete().eq('id', mediaId);
    fetchMedia();
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!customer) return <div className="p-8">Customer not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-2">
              ← Back to Customers
            </button>
            <h1 className="text-3xl font-bold text-brand-navy">{customer.name}</h1>
            <p className="text-gray-600">{customer.email}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              + Create Estimate
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              + Create Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'info' ? 'border-brand-gold text-brand-navy' : 'border-transparent text-gray-500'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'jobs' ? 'border-brand-gold text-brand-navy' : 'border-transparent text-gray-500'
              }`}
            >
              Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'media' ? 'border-brand-gold text-brand-navy' : 'border-transparent text-gray-500'
              }`}
            >
              Photos/Videos ({media.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-lg">{customer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-lg">{customer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <p className="text-lg">{customer.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <p className="text-lg">{customer.company || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <p className="text-lg">{customer.address || 'N/A'}</p>
              </div>
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
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
                      className="w-full px-3 py-2 border rounded"
                      placeholder="e.g., Main Parking Lot Sealcoating"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={jobForm.status}
                      onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Save Job
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJobForm(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {jobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No jobs yet. Add one above!</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => {
                    const jobMedia = media.filter(m => m.job_id === job.id);
                    return (
                      <div key={job.id} className="border rounded p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold">{job.job_name}</h3>
                            <p className="text-gray-600 mt-1">{job.description}</p>
                            <div className="mt-2 flex gap-4 text-sm text-gray-500">
                              <span>Status: <span className="font-medium">{job.status}</span></span>
                              <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
                              <span>Photos: <span className="font-medium">{jobMedia.length}</span></span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <label className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 cursor-pointer">
                              + Photo
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => handleFileUpload(e, job.id)}
                                disabled={uploading}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Show job photos */}
                        {jobMedia.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-semibold mb-2">Job Photos:</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {jobMedia.map((item) => (
                                <div key={item.id} className="relative border rounded p-1 hover:shadow-lg transition">
                                  <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-2xl">
                                    {item.file_type === 'photo' ? '🖼️' : '🎥'}
                                  </div>
                                  <p className="text-xs truncate mt-1">{item.original_filename}</p>
                                  <button
                                    onClick={() => handleDeleteMedia(item.id, item.filename)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
              <h2 className="text-2xl font-bold">Photos & Videos</h2>
              <label className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
                {uploading ? 'Uploading...' : '+ Upload File'}
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {media.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No media yet. Upload some files!</p>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="border rounded p-3 hover:shadow-lg transition">
                    <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
                      {item.file_type === 'photo' ? (
                        <span className="text-4xl">🖼️</span>
                      ) : (
                        <span className="text-4xl">🎥</span>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{item.original_filename}</p>
                    <p className="text-xs text-gray-500">{(item.file_size / 1024).toFixed(0)} KB</p>
                    <p className="text-xs text-gray-500">{new Date(item.uploaded_at).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleDeleteMedia(item.id, item.filename)}
                      className="mt-2 w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
