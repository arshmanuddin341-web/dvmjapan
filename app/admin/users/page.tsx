"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { Users, CheckCircle, Loader2, UserCheck, Shield, MapPin } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: "pending" | "approved";
  canTrackVehicle?: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [trackingTogglingId, setTrackingTogglingId] = useState<string | null>(null);

  useEffect(() => {
    api<{ data: UserRow[] }>("/api/admin/users")
      .then((res) => setUsers(res.data ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await api<{ success: boolean }>(`/api/admin/users/${id}/approve`, { method: "PATCH" });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "approved" as const } : u))
      );
    } catch {
      // keep UI as is on error
    } finally {
      setApprovingId(null);
    }
  };

  const handleToggleTracking = async (id: string, current: boolean) => {
    setTrackingTogglingId(id);
    try {
      await api<{ success: boolean; canTrackVehicle: boolean }>(`/api/admin/users/${id}/tracking`, {
        method: "PATCH",
        body: JSON.stringify({ canTrackVehicle: !current }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, canTrackVehicle: !current } : u))
      );
    } catch {
      // keep UI as is on error
    } finally {
      setTrackingTogglingId(null);
    }
  };

  const pending = users.filter((u) => u.role === "user" && u.status === "pending");
  const approved = users.filter((u) => u.role === "user" && u.status === "approved");
  const admins = users.filter((u) => u.role === "admin");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Approve new users to give them access to Live Auctions, Car Tracking, and Payments. Only you (main admin) can approve.
        </p>
      </div>

      {/* Pending */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-amber-500" />
          Pending approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No users waiting for approval.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Registered</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="py-3 text-gray-600">{u.email}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleApprove(u.id)}
                        disabled={approvingId === u.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 disabled:opacity-50"
                      >
                        {approvingId === u.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved users */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Approved users ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-gray-500 text-sm">No approved users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Registered</th>
                  <th className="pb-3 font-medium text-right">Track Vehicle</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="py-3 text-gray-600">{u.email}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleTracking(u.id, u.canTrackVehicle ?? false)}
                        disabled={trackingTogglingId === u.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          u.canTrackVehicle
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } disabled:opacity-50`}
                        title={u.canTrackVehicle ? "Revoke tracking access" : "Allow tracking access"}
                      >
                        {trackingTogglingId === u.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                        {u.canTrackVehicle ? "Allowed" : "Allow"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admins */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-teal-600" />
          Admins ({admins.length})
        </h2>
        {admins.length === 0 ? (
          <p className="text-gray-500 text-sm">No other admins.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="py-3 text-gray-600">{u.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-teal-700 text-xs font-medium">
                        Admin
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
