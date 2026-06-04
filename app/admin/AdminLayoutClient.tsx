"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Car,
  FileText,
  DollarSign,
  LogOut,
  BarChart3,
  Settings,
  Users,
  Gavel,
  Globe,
  MessageSquare,
  HelpCircle,
  Type,
  Menu,
  X,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { routes } from "@/config/routes";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Vehicles", href: "/admin/vehicles", icon: Car },
  { name: "Auctions", href: "/admin/auctions", icon: Gavel },
  { name: "Japan Auctions", href: "/admin/japan-auctions", icon: Gavel },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
  { name: "Page Content", href: "/admin/content", icon: Type },
  { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "SEO", href: "/admin/seo", icon: Globe },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Inquiries", href: "/admin/inquiries", icon: BarChart3 },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAdmin, logout } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(routes.login);
      return;
    }
    if (!isAdmin) {
      router.replace(routes.dashboard);
    }
  }, [user, isLoading, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.replace(routes.login);
    router.refresh();
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg-cinematic-elevated)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-cinematic-elevated)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-brand-navy text-white z-50 transform transition-transform duration-200 ease-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 min-w-0" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/DVM JAPAN-groups-logo-transparent.png"
              alt="DVM JAPAN"
              width={160}
              height={50}
              className="h-10 w-auto max-w-[180px] object-contain object-left brightness-0 invert"
            />
            <span className="text-sm font-semibold text-white/90 shrink-0 hidden sm:inline">Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-mdk ${active ? "bg-teal-500/20 text-red-300" : "hover:bg-white/10 text-white/90"
                  }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-mdk w-full text-left cursor-pointer text-white/90"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="min-w-0 md:ml-64">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3 md:py-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="heading-section-mdk text-lg sm:text-2xl font-bold text-brand-navy truncate">Admin Panel</h1>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span className="text-xs sm:text-sm text-slate-600 truncate max-w-[120px] sm:max-w-none">{user.name}</span>
              <span className="text-xs px-2 py-1 rounded-lg bg-teal-500/10 text-teal-600 font-medium">Admin</span>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8 section min-w-0">{children}</main>
      </div>
    </div>
  );
}

