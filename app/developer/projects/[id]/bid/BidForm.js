"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send, AlertCircle } from "lucide-react";

export default function BidForm({ project }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: "",
    timeline: "",
    proposal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/developer/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          amount: formData.amount,
          timeline: formData.timeline,
          proposal: formData.proposal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit bid");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/developer/projects");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bid Submitted!</h2>
        <p className="text-gray-600 mb-6">Your proposal has been successfully sent to the client.</p>
        <p className="text-sm text-gray-400">Redirecting to projects...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center mb-4">
          <Link href={`/developer/projects/${project.id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Project
          </Link>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Place a Bid on: <span className="font-bold text-blue-600">{project.title}</span>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Client Budget: {project.budgetType === "hourly" ? `₹${project.hourlyRate}/hr` : `₹${project.budgetMin?.toLocaleString()} - ₹${project.budgetMax?.toLocaleString()}`}
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 flex items-start border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid text-black grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Bid Amount (₹)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  placeholder="e.g. 5000"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {project.budgetType === "hourly" ? "Your proposed hourly rate" : "Your total project bid"}
              </p>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                Delivery Timeline (Days)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="timeline"
                  id="timeline"
                  min="1"
                  required
                  value={formData.timeline}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  placeholder="e.g. 14"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">days</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Estimated days to completion</p>
            </div>
          </div>

          <div>
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700">
              Proposal / Cover Letter
            </label>
            <div className="mt-1">
              <textarea
                id="proposal"
                name="proposal"
                rows={6}
                required
                value={formData.proposal}
                onChange={handleChange}
                className="shadow-sm  text-black focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                placeholder="Explain why you are the best fit for this project. Highlight relevant experience and your approach."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end px-4 py-3 bg-gray-50 sm:px-6 -mx-4 -mb-5 sm:-mx-6 sm:-mb-6 rounded-b-lg border-t border-gray-200">
            <Link
              href={`/developer/projects/${project.id}`}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Bid
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
