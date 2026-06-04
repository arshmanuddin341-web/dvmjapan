"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface VehicleOption {
  id: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  status?: string;
}

export default function CreateAuctionPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    title: "",
    startTime: "",
    endTime: "",
    startingBid: "",
    bidIncrement: "100",
    reservePrice: "",
  });

  useEffect(() => {
    const base = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetch(`${base}/api/vehicles?limit=200`)
      .then((res) => res.json())
      .then((data: { vehicles?: VehicleOption[] }) => setVehicles(data?.vehicles ?? []))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/api/auctions", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: form.vehicleId || undefined,
          car: form.vehicleId || undefined,
          title: form.title,
          startTime: form.startTime ? new Date(form.startTime).toISOString() : undefined,
          endTime: form.endTime ? new Date(form.endTime).toISOString() : undefined,
          startingBid: parseFloat(form.startingBid),
          bidIncrement: parseFloat(form.bidIncrement) || 100,
          reservePrice: form.reservePrice ? parseFloat(form.reservePrice) : undefined,
        }),
      });
      router.push("/admin/auctions");
      router.refresh();
    } catch {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/auctions" className="text-gray-600 hover:text-gray-900">← Back</Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Auction</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle (optional)</label>
          <select
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- None / manual entry --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.year} {v.make} {v.model} ({v.stockId})
              </option>
            ))}
          </select>
          {vehicles.length === 0 && !loading && (
            <p className="text-sm text-amber-600 mt-1">No vehicles yet. Add vehicles in Vehicle Management.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auction Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="e.g. Rare 2020 Toyota Land Cruiser"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Bid ($) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.startingBid}
              onChange={(e) => setForm({ ...form, startingBid: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bid Increment ($)</label>
            <input
              type="number"
              min="1"
              value={form.bidIncrement}
              onChange={(e) => setForm({ ...form, bidIncrement: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reserve Price ($) optional</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.reservePrice}
            onChange={(e) => setForm({ ...form, reservePrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Creating..." : "Create Auction"}
          </button>
          <Link href="/admin/auctions" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
