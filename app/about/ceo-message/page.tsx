"use client";

import Image from "next/image";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageHero from "@/components/layout/PageHero";

export default function CEOMessagePage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <PageHero title="Message from our CEO" subtitle="Excellence in Japanese vehicles & machinery." />
      <div className="container-custom max-w-4xl pt-8">
        <PageBreadcrumb items={[{ label: "About Us", href: "/about" }, { label: "CEO Message" }]} />
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 mb-8">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
              alt="CEO Message"
              fill
              className="object-cover"
              sizes="800px"
              unoptimized
            />
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed">
              When we started DVM JAPAN, the goal was simple: make buying a vehicle from Japan feel as straightforward as buying one in your own city. No confusing fees, no hidden grades on the auction sheet, and no disappearing exporter once the car leaves port.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Today our team in Japan and overseas personally reviews every vehicle we offer, explains the true condition in plain language, and stays with you until the car is cleared at your port. Many of our customers are on their second or third purchase with us—that trust is our real measure of success.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Whether you are a dealer building stock or a first‑time buyer importing a family car, thank you for considering DVM JAPAN. We look forward to earning your confidence, not just your first order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
