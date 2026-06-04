"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { Gavel, Plus, Loader2 } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  status: string;
  currentBid: number;
  bidCount: number;
  startTime: string;
  endTime: string;
  car?: { title: string; brand: string; model: string };
}

interface PaginatedData {
  data: Auction[];
  total: number;
}

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<PaginatedData>("/api/admin/auctions")
      .then((res) => setAuctions(res.data ?? []))
      .catch(() => setAuctions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Auction Management</h1>
        <Link href="/admin/auctions/create" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Auction
        </Link>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Auction</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Current Bid</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Bids</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Ends</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auctions.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{a.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {a.car ? `${a.car.brand} ${a.car.model}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          a.status === "live"
                            ? "bg-green-100 text-green-700"
                            : a.status === "sold"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ${a.currentBid?.toLocaleString() ?? "0"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{a.bidCount ?? 0}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {a.endTime ? new Date(a.endTime).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && auctions.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No auctions yet. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
