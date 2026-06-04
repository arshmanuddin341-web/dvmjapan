"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Phone, Mail } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function Header() {
  const siteConfig = useSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Inventory", href: "/inventory" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Import Process", href: "/import-process" },
    { name: "Shipping", href: "/shipping" },
    { name: "Pricing", href: "/pricing" },
    { name: "Auction Info", href: "/auction-information" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1A1F3C] text-white">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-[#00D1C1] transition-colors">
                <Mail className="h-4 w-4" />
                <span>{siteConfig.contact.email}</span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/destinations/japan" className="hover:text-[#00D1C1] transition-colors">Japan</Link>
              <Link href="/destinations/kenya" className="hover:text-[#00D1C1] transition-colors">Kenya</Link>
              <Link href="/destinations/uk" className="hover:text-[#00D1C1] transition-colors">UK</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="text-2xl font-black tracking-tighter text-[#1A1F3C]">DVM</span>
                <span className="text-2xl font-black tracking-tighter text-[#00D1C1]">JAPAN</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#1A1F3C]/60 uppercase leading-none mt-0.5">Japan Export</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#00D1C1] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/inventory?search=true"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#00D1C1] transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/contact" className="hidden md:block btn-primary bg-[#1A1F3C] text-white hover:bg-[#242D52]">
              Get Quote
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-gray-700 hover:text-[#00D1C1]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="btn-primary w-full text-center bg-[#1A1F3C] text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
