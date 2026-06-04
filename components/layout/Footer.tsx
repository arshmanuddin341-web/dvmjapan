"use client";

import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, ArrowRight, Ship } from "lucide-react";
import { routes } from "@/config/routes";
import { useSiteConfig } from "@/context/SiteConfigContext";

const openingHours = {
  sales: {
    title: "Sales Department",
    lines: ["Mon-Fri : 9:00am - 6:00pm", "Saturday, Sunday is closed"],
  },
  service: {
    title: "Service Department",
    lines: ["Mon-Fri : 9:00am - 6:00pm", "Saturday, Sunday is closed"],
  },
};

const qualityText =
  "DVM JAPAN provides thoroughly inspected Japanese vehicles & genuine auto parts with full transparency and dependable global logistics. With years of industry expertise, we confidently connect customers worldwide to Japan's trusted automotive market.";

export default function Footer() {
  const siteConfig = useSiteConfig();
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");
  const social = [
    { Icon: Facebook, href: siteConfig.social.facebook || "#", label: "Facebook" },
    { Icon: Twitter, href: siteConfig.social.twitter || "#", label: "Twitter" },
    { Icon: Instagram, href: siteConfig.social.instagram || "#", label: "Instagram" },
    { Icon: Linkedin, href: siteConfig.social.linkedin || "#", label: "LinkedIn" },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = subscribeEmail.trim();
    if (!email || !email.includes("@")) {
      setSubError("Please enter a valid email address.");
      return;
    }
    setSubLoading(true);
    setSubError("");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (_) {
      // silently ignore network errors — still show success
    } finally {
      setSubLoading(false);
      setSubscribed(true);
      setSubscribeEmail("");
    }
  };

  return (
    <footer className="pt-6 pb-4 sm:pt-8 sm:pb-6">
      <div className="container-custom">
        {/* Subscribe */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-center">
          <h3 className="text-center sm:text-left text-sm font-bold text-slate-900 uppercase tracking-widest">Subscribe</h3>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2 sm:flex-1 relative">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="john.doe@example.com"
              disabled={subLoading}
              className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              disabled={subLoading}
              className="shrink-0 rounded-lg bg-slate-900 px-4 py-1.5 text-[10px] font-bold uppercase text-white transition hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
              {subLoading ? "..." : "Subscribe"}
            </button>
            {subError && (
              <p className="absolute -bottom-5 left-0 text-[9px] text-red-500 font-medium">
                {subError}
              </p>
            )}
          </form>
          {subscribed && !subError && <p className="text-[10px] text-teal-600 font-medium">✨ Thank you for subscribing!</p>}
        </div>

        {/* Main footer – 3 columns, DVM JAPAN Group */}
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-[#1A1F3C] via-[#242D52] to-[#1A1F3C] text-white shadow-xl">
          <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:px-8 lg:grid-cols-3 lg:gap-7 lg:px-10 lg:py-7">
            {/* Column 1: Quality You Can Rely On */}
            <div>
              <a href={routes.home} className="inline-block mb-3">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-0.5 leading-none">
                    <span className="text-[1.2rem] font-bold tracking-tighter text-white">DVM</span>
                    <span className="text-[1.2rem] font-bold tracking-tighter text-teal-400">JAPAN</span>
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.22em] text-white/60 uppercase leading-none mt-0.5">Japan Export</span>
                </div>
              </a>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2">
                Quality You Can Rely On
              </h3>
              <p className="text-[11px] leading-relaxed text-blue-100/80 max-w-sm">
                {qualityText}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-blue-100/70">
                Follow Us
              </p>
              <div className="mt-2 flex gap-2">
                {social.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                    aria-label={label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Opening Hours only */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2">
                Opening Hours
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase text-blue-100 mb-1">
                    {openingHours.sales.title}
                  </p>
                  <ul className="space-y-0.5">
                    {openingHours.sales.lines.map((line) => (
                      <li key={line} className="text-[12px] text-blue-50/90">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase text-blue-100 mb-1">
                    {openingHours.service.title}
                  </p>
                  <ul className="space-y-0.5">
                    {openingHours.service.lines.map((line) => (
                      <li key={line} className="text-[12px] text-blue-50/90">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 3: Contact Details */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2">
                Contact Details
              </h3>
              <div className="space-y-2.5 text-[12px] text-blue-50/90">
                {siteConfig.contact.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{siteConfig.contact.address}</span>
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2 transition hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>UK (Main): {siteConfig.contact.phone}</span>
                  </a>
                  {siteConfig.contact.phoneJapan && (
                    <a
                      href={`tel:${siteConfig.contact.phoneJapan.replace(/\D/g, "")}`}
                      className="flex items-center gap-2 transition hover:text-white"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>Japan: {siteConfig.contact.phoneJapan}</span>
                    </a>
                  )}
                </div>
                {siteConfig.contact.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 break-all transition hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {email}
                  </a>
                ))}
              </div>
              <a
                href={routes.trackVehicle}
                className="mt-4 mr-2 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-teal-700 shadow-lg shadow-teal-900/20"
              >
                Track Shipment
                <Ship className="h-3.5 w-3.5" />
              </a>
              <a
                href={routes.contact}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/40 bg-transparent px-4 py-2 text-[12px] font-medium text-white transition hover:bg-white/10"
              >
                Contact Us
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Bottom bar – copyright + legal */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/20 px-5 py-3 sm:flex-row sm:px-8 lg:px-12">
            <p className="text-[11px] text-blue-100/90">
              © {new Date().getFullYear()} DVM JAPAN. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <a
                href={routes.privacy}
                className="text-[11px] text-white/90 underline-offset-4 transition hover:text-white hover:underline"
              >
                Privacy Policy
              </a>
              <a
                href={routes.terms}
                className="text-[11px] text-white/90 underline-offset-4 transition hover:text-white hover:underline"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
