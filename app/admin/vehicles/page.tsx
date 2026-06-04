"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Search, RefreshCw, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getToken } from "@/lib/api-client";

interface VehicleRow {
  id: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string | null;
  condition: string;
  location: string;
  images: string[];
  status: string;
  featured: boolean;
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<VehicleRow | null>(null);

  const fetchVehicles = useCallback(async (pg = 1, q = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg.toString(), limit: PAGE_SIZE.toString() });
      if (q) params.set("q", q);
      const res = await fetch(`/api/vehicles?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVehicles(data.vehicles ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(page, searchQuery);
  }, [page, fetchVehicles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVehicles(1, searchQuery);
  };

  const handleDelete = async (vehicle: VehicleRow) => {
    setDeletingId(vehicle.id);
    try {
      const token = getToken();
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
        setTotal(prev => prev - 1);
      } else {
        alert("Failed to delete vehicle. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const formatPrice = (price: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
  const formatMileage = (m: number) => m ? `${m.toLocaleString()} km` : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} vehicles in database</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVehicles(page, searchQuery)}
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link
            href="/admin/vehicles/add"
            className="h-10 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, stock ID..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button type="submit" className="h-10 px-5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition">
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setPage(1); fetchVehicles(1, ""); }}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading vehicles...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">No vehicles found.</p>
            <Link href="/admin/vehicles/add" className="mt-3 inline-flex items-center gap-2 text-teal-600 text-sm font-semibold hover:underline">
              <Plus className="h-4 w-4" /> Add your first vehicle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Stock ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Mileage</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Body</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      {v.images?.[0] ? (
                        <img
                          src={v.images[0]}
                          alt={`${v.make} ${v.model}`}
                          className="w-16 h-11 object-cover rounded-lg border border-slate-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-16 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                          No img
                        </div>
                      )}
                    </td>
                    {/* Stock ID */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                        {v.stockId}
                      </span>
                    </td>
                    {/* Make + Model */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {v.featured && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                        <div>
                          <p className="text-sm font-bold text-slate-900">{v.make}</p>
                          <p className="text-xs text-slate-500">{v.model}</p>
                        </div>
                      </div>
                    </td>
                    {/* Year */}
                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">{v.year}</td>
                    {/* Price */}
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">
                      {formatPrice(v.price, v.currency)}
                    </td>
                    {/* Mileage */}
                    <td className="px-4 py-3 text-sm text-slate-600">{formatMileage(v.mileage)}</td>
                    {/* Body */}
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {v.bodyType || "—"}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        v.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {v.status === "available" ? "Active" : v.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/inventory/${v.id}`}
                          target="_blank"
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition"
                          title="View on site"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/vehicles/edit/${v.id}`}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(v)}
                          disabled={deletingId === v.id}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                          title="Delete"
                        >
                          {deletingId === v.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page - 2 + i;
              if (pg > totalPages) return null;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                    pg === page
                      ? "bg-teal-600 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 mb-1">Delete Vehicle?</h3>
            <p className="text-sm text-center text-slate-500 mb-1">
              This will permanently remove:
            </p>
            <p className="text-sm font-bold text-center text-slate-800 mb-6">
              {confirmDelete.year} {confirmDelete.make} {confirmDelete.model}
              <span className="text-xs font-mono text-slate-400 ml-2">({confirmDelete.stockId})</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deletingId}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
