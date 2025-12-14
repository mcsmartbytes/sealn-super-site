"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function CustomerForm({ onAdd, onRefresh }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [createJob, setCreateJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    job_name: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdCustomerId, setCreatedCustomerId] = useState<number | null>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Add customer
      const result = await onAdd(form);

      // If creating a job, add it after customer is created
      if (createJob && jobForm.job_name && result?.id) {
        const { error: jobError } = await supabase
          .from("jobs")
          .insert([{
            customer_id: result.id,
            job_name: jobForm.job_name,
            description: jobForm.description || null,
            status: "active"
          }]);

        if (jobError) {
          console.error("Error creating job:", jobError);
          alert("Customer created but failed to create job");
        }
      }

      await onRefresh();
      setForm({ name: "", email: "", phone: "", company: "" });
      setJobForm({ job_name: "", description: "" });
      setCreateJob(false);
      setCreatedCustomerId(result?.id || null);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCreatedCustomerId(null);
      }, 3000);
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-bold text-xl text-gray-800 mb-4">Add Customer</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            placeholder="Customer name"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="(555) 123-4567"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            placeholder="Company name (optional)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>

        {/* Create Job Option */}
        <div className="border-t pt-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createJob}
              onChange={(e) => setCreateJob(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Also create a job for this customer
            </span>
          </label>

          {createJob && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-semibold text-gray-700">Job Details</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Main Parking Lot Sealcoating"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={jobForm.job_name}
                  onChange={(e) => setJobForm({ ...jobForm, job_name: e.target.value })}
                  required={createJob}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Job details, location, special notes..."
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : createJob ? "Add Customer & Job" : "Add Customer"}
        </button>
      </form>

      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
          <p className="font-semibold">Customer added successfully!</p>
          {createJob && <p className="text-sm">Job has been created and linked.</p>}
        </div>
      )}
    </div>
  );
}
