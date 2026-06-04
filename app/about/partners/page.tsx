"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  Plane,
  Warehouse,
  Package,
  ShieldCheck,
  FileCheck,
  Wrench,
  Shield,
  CreditCard,
  Building2,
  TrendingUp,
  ArrowLeftRight,
  Laptop,
  Cloud,
  Smartphone,
  Database,
} from "lucide-react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

const partnerCategories = [
  {
    title: "Shipping & Logistics Partners",
    items: [
      { name: "Shielded Shipping Co.", tag: "International Shipping", icon: Truck, color: "text-blue-600" },
      { name: "Logistics Express", tag: "Worldwide Logistics", icon: Plane, color: "text-blue-600" },
      { name: "Air Cargo Solutions", tag: "Fast Delivery", icon: Package, color: "text-blue-600" },
      { name: "Storage Solutions", tag: "Secure Storage", icon: Warehouse, color: "text-blue-600" },
    ],
  },
  {
    title: "Inspection & Quality Partners",
    items: [
      { name: "Quality Assurance Inc.", tag: "Quality Supervision", icon: ShieldCheck, color: "text-emerald-600" },
      { name: "Certification Services", tag: "Certifications", icon: FileCheck, color: "text-emerald-600" },
      { name: "Auto Tech Reports", tag: "Technical Expertise", icon: Wrench, color: "text-emerald-600" },
      { name: "Safety Standards Ltd.", tag: "Safety Compliance", icon: Shield, color: "text-emerald-600" },
    ],
  },
  {
    title: "Financial & Payment Partners",
    items: [
      { name: "Shielded Payment Solutions", tag: "Secure Payments", icon: CreditCard, color: "text-blue-600" },
      { name: "International Banking", tag: "Banking Services", icon: Building2, color: "text-blue-600" },
      { name: "Revenue Options Ltd.", tag: "Financial Planning", icon: TrendingUp, color: "text-blue-600" },
      { name: "Currency Exchange Pro", tag: "Currency Support", icon: ArrowLeftRight, color: "text-blue-600" },
    ],
  },
  {
    title: "Technology Partners",
    items: [
      { name: "Tech Solutions Inc.", tag: "IT Consultation", icon: Laptop, color: "text-orange-600" },
      { name: "Cloud Services Pro", tag: "Cloud Solutions", icon: Cloud, color: "text-orange-600" },
      { name: "Mobile Solutions", tag: "Mobile Technology", icon: Smartphone, color: "text-orange-600" },
      { name: "Data Management Co.", tag: "Data Solutions", icon: Database, color: "text-orange-600" },
    ],
  },
];

const latestPosts = [
  { title: "Buy a Corolla Cross 2023", date: "Oct 26, 2023", price: "$34,900", img: "https://images.unsplash.com/photo-1542362567-b05486f69246?auto=format&fit=crop&w=400&q=80" },
  { title: "Best New Car", date: "Oct 20, 2023", price: "$28,500", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80" },
  { title: "Fuel Efficiency Car", date: "Oct 15, 2023", price: "$22,000", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80" },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container-custom max-w-5xl">
        <PageBreadcrumb items={[{ label: "About Us", href: "/about" }, { label: "Partners" }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Company Partners</h1>
        <p className="text-teal-600 text-sm font-semibold mb-10">Our trusted partners worldwide.</p>

        <div className="space-y-12">
          {partnerCategories.map((cat) => (
            <div key={cat.title}>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{cat.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.items.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.name}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`mb-3 ${p.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{p.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{p.tag}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Latest Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <Link
                  key={i}
                  href={routes.inventory}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[16/10] bg-slate-200">
                    <Image
                      src={post.img}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="400px"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">{post.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{post.date}</p>
                    <p className="text-teal-600 font-semibold mt-2">Price {post.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
