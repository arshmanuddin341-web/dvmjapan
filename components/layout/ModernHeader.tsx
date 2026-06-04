"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Car, ArrowRight } from "lucide-react";
import Image from "next/image";
import { headerNavigation, isNavItemActive } from "@/config/navigation";
import { routes } from "@/config/routes";
import CarLogo from "@/components/ui/CarLogo";
import UniversalSearch from "@/components/ui/UniversalSearch";
import TopBar from "./TopBar";
import { useCurrency } from "@/context/CurrencyContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function ModernHeader() {
  const { t } = useCurrency();
  const siteConfig = useSiteConfig();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const getLabel = (name: string) => {
    const key = `nav_${name.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '').replace(/\//g, '_')}`;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  const navigation = headerNavigation.map((item) => ({
    name: item.label,
    href: item.href,
    isActive: isNavItemActive(pathname, item),
    hasDropdown: !!item.children,
    dropdownItems: item.children?.map((child) => ({
      name: child.label,
      displayName: getLabel(child.label),
      href: child.href,
      description: child.description,
      isActive: isNavItemActive(pathname, child),
    })),
  }));

  const isServicesOpen = activeDesktopDropdown === "Services";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white/98 backdrop-blur-md transition-all duration-200 ${scrolled ? "border-slate-200 shadow-sm" : "border-slate-200/60"
          }`}
      >
        <TopBar />
        <div
          className="relative"
          onMouseLeave={() => setActiveDesktopDropdown(null)}
        >
          <div className="container-custom flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <CarLogo />
            </div>

            <nav className="hidden items-center gap-0.5 xl:flex">
              {navigation.map((item) => {
                const isServices = item.name === "Services";
                const isActive = item.isActive || (isServices && isServicesOpen);
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDesktopDropdown(item.hasDropdown ? item.name : null)}
                  >
                    <a
                      href={item.href}
                      className={`inline-flex items-center gap-0.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${isActive
                        ? "text-teal-600"
                        : "text-slate-700 hover:text-slate-900"
                        }`}
                    >
                      {getLabel(item.name)}
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${activeDesktopDropdown === item.name ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </a>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <UniversalSearch />
              <a
                href={routes.login}
                className="hidden lg:inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Login
              </a>
              <Link
                href={routes.dashboard}
                className="hidden lg:inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="xl:hidden flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Services mega dropdown */}
          <AnimatePresence>
            {isServicesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full hidden xl:block border-t border-slate-200 bg-white shadow-xl rounded-b-2xl mx-4"
              >
                <div className="container-custom py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-4">
                      <Link
                        href={routes.auction}
                        className="block rounded-xl border border-slate-200 p-4 hover:border-teal-200 hover:bg-teal-50/50 transition"
                      >
                        <p className="font-bold text-slate-900">Auction</p>
                        <p className="mt-1 text-sm text-slate-600">Premium Japanese auction cars. Trusted quality. Unbeatable value.</p>
                      </Link>
                      <Link
                        href={routes.about}
                        className="block rounded-xl border border-slate-200 p-4 hover:border-teal-200 hover:bg-teal-50/50 transition"
                      >
                        <p className="font-bold text-slate-900">How to Buy</p>
                        <p className="mt-1 text-sm text-slate-600">Simple steps. Secure process. Seamless delivery.</p>
                      </Link>
                    </div>
                    <div className="lg:col-span-4 flex flex-col items-center justify-center">
                      <div className="relative w-full aspect-video max-w-xs rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <Image
                          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80"
                          alt="Auction vehicles"
                          fill
                          className="object-cover"
                          sizes="(max-width: 400px) 100vw, 400px"
                          unoptimized
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-teal-600 px-2.5 py-1.5 text-white text-xs font-semibold">
                          <Car className="h-3.5 w-3.5" />
                          Auction
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-3 flex flex-col justify-center">
                      <Link
                        href={routes.auction}
                        className="block rounded-xl border border-slate-200 p-4 hover:border-teal-200 hover:bg-teal-50/50 transition"
                      >
                        <p className="font-bold text-slate-900">Smart Auction Bidding</p>
                        <p className="mt-1 text-sm text-slate-600">Bid directly at leading Japanese auctions while we handle inspection, payment, and export logistics.</p>
                      </Link>
                      <Link
                        href={routes.auction}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Explore Auctions
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* About Us & other dropdowns */}
          <AnimatePresence>
            {activeDesktopDropdown && activeDesktopDropdown !== "Services" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full hidden border-t border-slate-200 bg-white shadow-xl xl:block"
              >
                <div className="container-custom py-5">
                  {navigation
                    .filter((item) => item.name === activeDesktopDropdown && item.dropdownItems?.length)
                    .map((item) => (
                      <div key={item.name} className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {item.dropdownItems?.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="rounded-xl border border-slate-200 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50/60"
                          >
                            <p className="text-sm font-semibold text-slate-900">{child.displayName || child.name}</p>
                            {child.description && (
                              <p className="mt-1 text-xs text-slate-600">{child.description}</p>
                            )}
                          </a>
                        ))}
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 bg-black/45"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 flex w-full max-w-[min(360px,92vw)] flex-col overflow-y-auto rounded-l-2xl bg-white shadow-2xl"
              aria-label="Mobile navigation"
            >
              <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 shrink-0">
                <CarLogo />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1 p-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 py-2 text-[14px] font-medium ${item.isActive
                        ? "bg-blue-50 text-brand-navy"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      {getLabel(item.name)}
                    </a>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3">
                        {item.dropdownItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-1.5 text-xs ${subItem.isActive
                              ? "font-semibold text-brand-navy"
                              : "text-slate-600 hover:text-slate-900"
                              }`}
                          >
                            {subItem.displayName || subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto space-y-3 border-t border-slate-200 bg-slate-50 p-4">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm text-slate-700"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={routes.login}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700"
                >
                  Login
                </a>
                <a
                  href={routes.register}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white"
                >
                  Register
                </a>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
