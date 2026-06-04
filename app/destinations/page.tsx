"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { scrollReveal, slideUp } from "@/lib/animations";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Only these countries: UK, Zambia, Zimbabwe, Tanzania, Kenya, Ireland, Jamaica */
const regions = [
  {
    name: "Europe",
    countries: [
      { name: "United Kingdom", href: routes.countryDetail("uk"), flag: "🇬🇧" },
      { name: "Ireland", href: routes.countryDetail("ireland"), flag: "🇮🇪" },
    ],
  },
  {
    name: "Africa",
    countries: [
      { name: "Zambia", href: routes.countryDetail("zambia"), flag: "🇿🇲" },
      { name: "Zimbabwe", href: routes.countryDetail("zimbabwe"), flag: "🇿🇼" },
      { name: "Tanzania", href: routes.countryDetail("tanzania"), flag: "🇹🇿" },
      { name: "Kenya", href: routes.countryDetail("kenya"), flag: "🇰🇪" },
    ],
  },
  {
    name: "Caribbean",
    countries: [
      { name: "Jamaica", href: routes.countryDetail("jamaica"), flag: "🇯🇲" },
    ],
  },
];

export default function DestinationsPage() {
  const regionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regionsRef.current) {
      scrollReveal(regionsRef.current, slideUp, { delay: 0.3 });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      <PageHero
        title="Explore Global Stock"
        subtitle="Import Japanese vehicles to UK, Ireland, Africa (Zambia, Zimbabwe, Tanzania, Kenya) and Jamaica. Select your country for import requirements and shipping information."
      />
      <div className="container-custom pt-8">
        <div className="max-w-6xl mx-auto">
          <div ref={regionsRef} className="space-y-12 mb-16">
            {regions.map((region) => (
              <div key={region.name}>
                <h2 className="text-2xl font-bold heading-section-mdk mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-teal-600 rounded-full" />
                  {region.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {region.countries.map((country) => (
                    <Link
                      key={country.name}
                      href={country.href}
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-500/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{country.flag}</div>
                        <h3 className="text-xl font-bold text-brand-navy group-hover:text-teal-600 transition-colors">
                          {country.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm">
                        <span>View Import Guide</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <CTASection
            title="Don't See Your Country?"
            description="We ship to 50+ countries worldwide. Contact us to check if we can serve your destination."
            primaryAction={{
              label: "Contact Us",
              href: routes.contact,
            }}
            secondaryAction={{
              label: "View Global Presence",
              href: routes.globalPresence,
            }}
          />
        </div>
      </div>
    </div>
  );
}
