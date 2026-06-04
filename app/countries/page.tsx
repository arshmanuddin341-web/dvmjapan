import { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Import Destinations - Countries We Serve | DVM JAPAN",
  description: "Browse import guides for different countries. Learn about import requirements, shipping times, and regulations for importing Japanese vehicles to your country.",
};

const regions = [
  {
    name: "Africa",
    countries: [
      { name: "Kenya", href: "/countries/kenya", flag: "🇰🇪" },
      { name: "Tanzania", href: "/countries/tanzania", flag: "🇹🇿" },
      { name: "Uganda", href: "/countries/uganda", flag: "🇺🇬" },
      { name: "South Africa", href: "/countries/south-africa", flag: "🇿🇦" },
      { name: "Nigeria", href: "/countries/nigeria", flag: "🇳🇬" },
      { name: "Ghana", href: "/countries/ghana", flag: "🇬🇭" },
    ],
  },
  {
    name: "Asia",
    countries: [
      { name: "Pakistan", href: "/countries/pakistan", flag: "🇵🇰" },
      { name: "Bangladesh", href: "/countries/bangladesh", flag: "🇧🇩" },
      { name: "Philippines", href: "/countries/philippines", flag: "🇵🇭" },
      { name: "UAE", href: "/countries/uae", flag: "🇦🇪" },
      { name: "Saudi Arabia", href: "/countries/saudi-arabia", flag: "🇸🇦" },
      { name: "Thailand", href: "/countries/thailand", flag: "🇹🇭" },
    ],
  },
  {
    name: "Pacific",
    countries: [
      { name: "Australia", href: "/countries/australia", flag: "🇦🇺" },
      { name: "New Zealand", href: "/countries/new-zealand", flag: "🇳🇿" },
      { name: "Fiji", href: "/countries/fiji", flag: "🇫🇯" },
    ],
  },
  {
    name: "Europe",
    countries: [
      { name: "United Kingdom", href: "/countries/uk", flag: "🇬🇧" },
      { name: "Ireland", href: "/countries/ireland", flag: "🇮🇪" },
    ],
  },
];

export default function CountriesPage() {
  return (
    <div className="min-h-screen bg-[#050508] py-16">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-cyan-500" />
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Import Destinations</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Countries We <span className="gradient-text">Serve</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Import Japanese vehicles to 50+ countries worldwide. Select your country to view specific import requirements and shipping information.
          </p>
        </div>

        <div className="space-y-12">
          {regions.map((region) => (
            <div key={region.name}>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-cyan-500" />
                {region.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {region.countries.map((country) => (
                  <Link
                    key={country.name}
                    href={country.href}
                    className="card p-6 group hover:border-cyan-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{country.flag}</div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {country.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                      <span>View Import Guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 card p-12 border border-cyan-500/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Don't See Your <span className="gradient-text">Country?</span>
          </h3>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            We ship to many more countries. Contact us to check if we can deliver to your location.
          </p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Contact Us
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
