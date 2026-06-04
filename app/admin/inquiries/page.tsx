"use client";

import { useState, useEffect } from "react";
import { Eye, Mail, Phone, Loader2, X, Calendar, ClipboardList, Car } from "lucide-react";
import { api } from "@/lib/api-client";
import Link from "next/link";

interface InquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  vehicleId: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null);

  const loadInquiries = () => {
    setLoading(true);
    api<InquiryRow[]>("/api/inquiries")
      .then((data) => setInquiries(Array.isArray(data) ? data : (data as { data?: InquiryRow[] })?.data ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load inquiries"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api(`/api/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-teal-100 text-teal-700";
      case "contacted":
        return "bg-amber-100 text-amber-700";
      case "resolved":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString(undefined, { dateStyle: "long", timeStyle: "short" });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Customer Inquiries</h1>
          <p className="text-sm text-slate-500 mt-1">Manage leads and customer requests from the website.</p>
        </div>
        <div className="bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
          <span className="text-sm font-bold text-teal-700 uppercase tracking-widest">{inquiries.filter(i => i.status === 'new').length} New Leads</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Received Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm italic">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedInquiry(inquiry)}>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm tracking-tight">{inquiry.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800 line-clamp-1">{inquiry.subject || "No Subject"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:border-teal-200 transition-all shadow-sm">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 md:static">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Inquiry Details</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Reference ID: {selectedInquiry.id.slice(-8)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Customer Profile</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-sm font-bold text-slate-900 w-20 shrink-0">Name:</div>
                      <div className="text-sm text-slate-600">{selectedInquiry.name}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-sm font-bold text-slate-900 w-20 shrink-0">Email:</div>
                      <div className="text-sm text-slate-600 flex items-center gap-1.5">
                        {selectedInquiry.email}
                        <a href={`mailto:${selectedInquiry.email}`} className="text-teal-600 hover:underline"><Mail className="h-3 w-3" /></a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-sm font-bold text-slate-900 w-20 shrink-0">Phone:</div>
                      <div className="text-sm text-slate-600 flex items-center gap-1.5">
                        {selectedInquiry.phone || "Not provided"}
                        {selectedInquiry.phone && <a href={`tel:${selectedInquiry.phone}`} className="text-teal-600 hover:underline"><Phone className="h-3 w-3" /></a>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Status & Date</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">{formatDate(selectedInquiry.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                        disabled={updatingId === selectedInquiry.id}
                        className={`text-xs font-bold rounded-xl border-slate-200 px-4 py-2.5 focus:ring-teal-500 focus:border-teal-500 h-10 w-full md:w-32 transition-all ${getStatusColor(selectedInquiry.status)}`}
                      >
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                      {updatingId === selectedInquiry.id && <Loader2 className="h-4 w-4 animate-spin text-teal-600" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Content */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Message Content</h4>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-900 mb-2">{selectedInquiry.subject || "Untitled Inquiry"}</p>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Vehicle Connection */}
              {selectedInquiry.vehicleId && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Related Vehicle</h4>
                  <Link
                    href={`/admin/vehicles/edit/${selectedInquiry.vehicleId}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-teal-100 bg-teal-50/30 hover:bg-teal-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                      <Car className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Vehicle Link Attached</p>
                      <p className="text-sm text-slate-600 font-medium">Click to view/edit vehicle details</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4 text-teal-600" />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || "DVM JAPAN Inquiry"}`}
                className="px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all"
              >
                Send Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

