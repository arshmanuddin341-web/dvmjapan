"use client";

import { useState, useEffect } from "react";
import { Car, Users, DollarSign, TrendingUp, FileText, Gavel, Loader2, UserCheck, Shield, Mail, ClipboardList } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface DashboardData {
  overview?: {
    users?: { total: number; active: number };
    cars?: { total: number; available: number };
    auctions?: { total: number; live: number };
    inquiries?: { total: number; pending: number };
    revenue?: { total: number };
  };
  recentActivity?: {
    users?: Array<{ name: string; email: string }>;
    auctions?: Array<{ title: string; status: string; currentBid: number }>;
    inquiries?: Array<{ name: string; subject: string; status: string; date: string }>;
  };
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: "pending" | "approved";
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userList, setUserList] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: DashboardData }>("/api/admin/dashboard")
      .then((res) => {
        const r = res as { data?: DashboardData } & Partial<DashboardData>;
        const dashboard: DashboardData | null = r.data ?? ("overview" in r ? (r as DashboardData) : null);
        setData(dashboard);
      })
      .catch(() => setData(null));
  }, []);

  useEffect(() => {
    api<{ data: UserRow[] }>("/api/admin/users")
      .then((res) => setUserList(res.data ?? []))
      .catch(() => setUserList([]))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = userList.filter((u) => u.role === "user" && u.status === "pending").length;

  const o = data?.overview;
  const stats = [
    { label: "Total Users", value: o?.users?.total ?? "—", icon: Users, color: "bg-blue-500" },
    { label: "Pending Inquiries", value: o?.inquiries?.pending ?? "—", icon: Mail, color: "bg-teal-500" },
    { label: "Live Auctions", value: o?.auctions?.live ?? "—", icon: Gavel, color: "bg-yellow-500" },
    { label: "Total Vehicles", value: o?.cars?.total ?? "—", icon: Car, color: "bg-purple-500" },
  ];

  const recentUsers = data?.recentActivity?.users ?? [];
  const recentInquiries = (data?.recentActivity as any)?.inquiries ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main admin: approve new users to give them access (Live Auctions, Car Tracking, Payments) */}
      <div className="card p-8 border border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16" />
        <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-teal-50 flex items-center justify-center">
              <Shield className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Control Center</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md font-medium">
                Manage your global automotive inventory, customer inquiries, and platform security from one unified dashboard.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Attention Required</span>
                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                  {pendingCount} Pending Approvals
                </span>
              </div>
            )}
            <Link
              href="/admin/users"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Manage Access
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-6 border border-slate-200 bg-white shadow-sm rounded-2xl group hover:border-teal-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl shadow-lg shadow-${stat.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <TrendingUp className="h-4 w-4 text-teal-500" />
                  <span className="text-[10px] font-bold text-teal-500 uppercase">Live</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 border border-slate-200 bg-white shadow-sm rounded-3xl">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Inquiries</h2>
            </div>
            <Link href="/admin/inquiries" className="text-[11px] text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inq: any, i: number) => (
                <Link key={i} href="/admin/inquiries" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-teal-600 transition-colors">{inq.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium line-clamp-1">{inq.subject || "No Subject"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${inq.status === "new" ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-400"
                      }`}>
                      {inq.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-slate-400 text-sm text-center py-8">No recent inquiries</p>
            )}
          </div>
        </div>

        <div className="card p-6 border border-slate-200 bg-white shadow-sm rounded-3xl">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Users</h2>
            </div>
            <Link href="/admin/users" className="text-[11px] text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-transparent rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm tracking-tight">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{u.email}</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                    <Shield className="h-3 w-3 text-slate-300" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm text-center py-8">No users yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-8 border border-slate-200 bg-white shadow-sm rounded-3xl">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase tracking-widest text-xs">Quick Management Portal</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "New Vehicle", href: "/admin/vehicles/add", icon: Car, color: "text-teal-600 bg-teal-50" },
            { label: "Inventory", href: "/admin/vehicles", icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
            { label: "Inquiries", href: "/admin/inquiries", icon: Mail, color: "text-purple-600 bg-purple-50" },
            { label: "SEO Config", href: "/admin/seo", icon: FileText, color: "text-amber-600 bg-amber-50" },
            { label: "Site Settings", href: "/admin/settings", icon: Gavel, color: "text-indigo-600 bg-indigo-50" },
            { label: "User Access", href: "/admin/users", icon: Users, color: "text-rose-600 bg-rose-50" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
