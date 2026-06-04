"use client";

import Link from "next/link";
import { MapPin, UserPlus, ShieldCheck, Truck, LogIn, ArrowRight } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { routes } from "@/config/routes";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageHero from "@/components/layout/PageHero";

export default function TrackVehiclePage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const hasAccess = isAuthenticated && (user?.canTrackVehicle === true || user?.role === "admin");

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Track Your Vehicle"
        subtitle="See where your car is at every stage — from auction yard to port, vessel, and final delivery."
        variant="navy"
      />
      <div className="container-custom py-10 md:py-14">
        <PageBreadcrumb
          items={[
            { label: "Home", href: routes.home },
            { label: "Track Vehicle" },
          ]}
        />

        {/* What this page does - clear content for visitors */}
        <section className="max-w-3xl mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-4">What is Vehicle Tracking?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Once you have purchased a vehicle through DVM JAPAN Group, you can use this page to <strong>see where your car is</strong> at every step — from the auction yard in Japan to documentation, port loading, shipping, and delivery to your country. No more guessing: you get clear status updates and an estimated arrival time.
          </p>
          <p className="text-slate-700 leading-relaxed">
            <strong>Access is granted by our team</strong> after we confirm your purchase and set up your tracking. If you have already bought a vehicle and don’t see tracking yet, please <Link href={routes.contact} className="text-teal-600 font-semibold hover:underline">contact us</Link> and we’ll enable it for you.
          </p>
        </section>

        {/* How it works - 3 steps */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">1. Sign up</h3>
            <p className="text-sm text-slate-700">Create an account on DVM JAPAN. After approval, you can browse vehicles and place orders.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">2. Get tracking access</h3>
            <p className="text-sm text-slate-700">Once your purchase is confirmed, our admin enables tracking for your account. You’ll then see the &quot;Track Vehicle&quot; option here.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">3. Track your car</h3>
            <p className="text-sm text-slate-700">Log in and view real-time status: purchased, documentation, port, in transit, customs, and delivery.</p>
          </div>
        </section>

        {/* State-based content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !isAuthenticated ? (
          <section className="max-w-xl p-8 rounded-2xl border-2 border-slate-200 bg-slate-50/50 text-center">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Log in to see your tracking</h3>
            <p className="text-slate-700 mb-6">Vehicle tracking is available only to registered customers whose accounts have been granted access by our team.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={routes.login}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-navy text-white font-semibold hover:bg-brand-navy/90 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                Log in
              </Link>
              <Link
                href={routes.register}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                Sign up
              </Link>
            </div>
          </section>
        ) : !hasAccess ? (
          <section className="max-w-xl p-8 rounded-2xl border-2 border-amber-200 bg-amber-50/50 text-center">
            <ShieldCheck className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tracking not enabled yet</h3>
            <p className="text-slate-700 mb-4">
              Your account doesn’t have vehicle tracking access yet. Our team enables it once your purchase is confirmed. If you’ve already bought a vehicle, please <Link href={routes.contact} className="text-teal-600 font-semibold hover:underline">contact us</Link> and we’ll turn it on for you.
            </p>
            <Link
              href={routes.inventory}
              className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:underline"
            >
              Browse vehicles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <section className="max-w-xl p-8 rounded-2xl border-2 border-green-200 bg-green-50/50">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              You have tracking access
            </h3>
            <p className="text-slate-700 mb-6">View the status of your vehicles and see where they are in the delivery process.</p>
            <Link
              href={routes.dashboardTracking}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
            >
              Open My Car Tracking
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        )}

        <p className="mt-10 text-sm text-slate-600">
          Questions? <Link href={routes.contact} className="text-teal-600 font-medium hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
