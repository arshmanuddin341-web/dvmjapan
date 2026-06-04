"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Ship, AlertCircle, CheckCircle2, Sparkles, ArrowRight, Globe, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    country: string;
  };
}

const countryData: Record<string, any> = {
  japan: {
    name: "Japan",
    flag: "🇯🇵",
    description: "Exporting from Japan's major ports to destinations worldwide",
    ports: ["Yokohama", "Kobe", "Osaka", "Nagoya"],
    shippingTime: "N/A (Export origin)",
    color: "from-red-500 to-pink-500",
  },
  africa: {
    name: "Africa",
    flag: "🌍",
    description: "Importing Japanese vehicles to various African countries",
    requirements: [
      "Age restrictions: Typically 5-8 years (varies by country)",
      "Right-hand drive usually accepted",
      "Emission standards: Euro 4 or equivalent",
      "Import permit may be required",
      "Customs duties: 10-30% of vehicle value",
    ],
    shippingTime: "35-50 days",
    popularModels: ["Toyota Land Cruiser", "Nissan Patrol", "Toyota Hiace", "Toyota Corolla"],
    color: "from-green-500 to-emerald-500",
  },
  uae: {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    description: "Importing Japanese vehicles to UAE",
    requirements: [
      "Age restrictions: Up to 10 years",
      "GCC specifications preferred",
      "Left-hand drive preferred",
      "Import permit required",
      "Customs duties: 5% of vehicle value",
    ],
    shippingTime: "25-35 days",
    popularModels: ["Toyota Land Cruiser", "Nissan Patrol", "Lexus LX", "Toyota Camry"],
    color: "from-red-500 to-orange-500",
  },
  kenya: {
    name: "Kenya",
    flag: "🇰🇪",
    description: "Importing Japanese vehicles to Kenya",
    requirements: [
      "Age limit: 8 years from year of manufacture",
      "Right-hand drive accepted",
      "Import permit required",
      "Customs duties: 25% of CIF value",
      "Roadworthiness inspection required",
    ],
    shippingTime: "35-45 days",
    popularModels: ["Toyota Land Cruiser", "Nissan Patrol", "Toyota Hiace", "Subaru Forester"],
    color: "from-green-500 to-emerald-500",
  },
  pakistan: {
    name: "Pakistan",
    flag: "🇵🇰",
    description: "Importing Japanese vehicles to Pakistan",
    requirements: [
      "Age limit: 3-5 years depending on engine size",
      "Right-hand drive accepted",
      "Import permit and NOC required",
      "Customs duties: 50-100% of value",
      "Registration with local authorities",
    ],
    shippingTime: "25-35 days",
    popularModels: ["Toyota Corolla", "Honda Civic", "Suzuki Every", "Toyota Vitz"],
    color: "from-green-500 to-emerald-500",
  },
  tanzania: {
    name: "Tanzania",
    flag: "🇹🇿",
    description: "Importing Japanese vehicles to Tanzania",
    requirements: [
      "Age limit: 8 years",
      "Right-hand drive accepted",
      "Import permit required",
      "Customs duties: 25% of CIF value",
      "TRA inspection required",
    ],
    shippingTime: "40-50 days",
    popularModels: ["Toyota Land Cruiser", "Nissan Patrol", "Toyota Hiace"],
    color: "from-blue-500 to-cyan-500",
  },
};

export default function CountryPage({ params }: PageProps) {
  const country = countryData[params.country];

  if (!country) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-gold-400" />
              <span className="text-gold-400 font-semibold text-sm uppercase tracking-wider">Import Guide</span>
            </div>
            <div className="text-6xl mb-4">{country.flag}</div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Importing to <span className="gradient-text">{country.name}</span>
            </h1>
            <p className="text-xl text-gray-300">{country.description}</p>
          </motion.div>

          {/* Requirements */}
          {country.requirements && (
            <motion.div
              className="card p-8 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8 text-gold-400" />
                Import Requirements
              </h2>
              <ul className="space-y-4">
                {country.requirements.map((req: string, index: number) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4 p-4 bg-dark-800/50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-lg font-medium">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {country.shippingTime && (
              <motion.div
                className="card p-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Ship className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white">Shipping Time</h3>
                    <p className="text-gray-300 text-lg font-semibold">{country.shippingTime} from Japan</p>
                  </div>
                </div>
              </motion.div>
            )}

            {country.ports && (
              <motion.div
                className="card p-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white">Export Ports</h3>
                    <p className="text-gray-300">{country.ports.join(", ")}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Popular Models */}
          {country.popularModels && (
            <motion.div
              className="card p-8 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-black text-white mb-4">Popular Models for {country.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {country.popularModels.map((model: string, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    <span className="text-gold-400 font-bold">•</span>
                    <span className="text-gray-300 font-semibold">{model}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Important Note */}
          <motion.div
            className="card p-8 bg-yellow-500/10 border-2 border-yellow-500/30 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-black text-white mb-2">Important Note</h3>
                <p className="text-gray-300">
                  Import regulations vary by country and change frequently. Always verify current requirements 
                  with local authorities before importing. We can provide guidance but cannot guarantee 
                  import approval.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-3xl font-black text-white mb-4">
              Ready to Import to <span className="gradient-text">{country.name}?</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Browse our inventory or contact us for assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/inventory" className="btn-primary inline-flex items-center gap-2">
                  Browse Vehicles
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
                  Contact Us
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
