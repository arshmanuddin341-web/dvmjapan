"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, Sparkles, AlertCircle } from "lucide-react";
import { scrollReveal, slideUp, fadeIn } from "@/lib/animations";
import ScrollReveal from "@/components/animations/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import Accordion from "@/components/ui/Accordion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = [
  {
    title: "General Terms",
    content: "These terms and conditions govern the purchase and export of vehicles through DVM JAPAN. By placing an order, you agree to these terms in full.",
  },
  {
    title: "Vehicle Sales",
    content: "All vehicles are sold on an 'as-is' basis based on their condition at auction. We provide detailed auction sheets and inspection reports, but vehicles are sold based on their documented condition.",
  },
  {
    title: "Pricing",
    content: "Prices are quoted in USD and are subject to change. FOB prices are valid at the time of quotation. Shipping costs and insurance are additional unless stated as CIF price.",
  },
  {
    title: "Payment Terms",
    content: "A deposit of 50-100% is required to secure the vehicle. Final balance must be paid within one week after ship departure. Failure to pay may result in deposit forfeiture.",
  },
  {
    title: "Shipping",
    content: "Shipping times are estimates and may vary. We are not responsible for delays due to weather, customs, or other factors beyond our control. Insurance is recommended for all shipments.",
  },
  {
    title: "Import Requirements",
    content: "Buyers are responsible for ensuring vehicles meet their country's import requirements. We provide export documentation but cannot guarantee import approval.",
  },
  {
    title: "Cancellation",
    content: "Cancellations may incur fees. If a vehicle has been purchased at auction, cancellation fees may apply based on resale value.",
  },
  {
    title: "Limitation of Liability",
    content: "Our liability is limited to the purchase price of the vehicle. We are not responsible for customs duties, taxes, or local registration fees in the buyer's country.",
  },
];

export default function TermsPage() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionsRef.current) {
      scrollReveal(sectionsRef.current, slideUp, { delay: 0.3 });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const accordionItems = sections.map((section) => ({
    id: section.title.toLowerCase().replace(/\s+/g, "-"),
    title: section.title,
    content: <p className="text-gray-300 leading-relaxed">{section.content}</p>,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16 pt-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <HeroSection
            title={
              <>
                Terms & <span className="gradient-text">Conditions</span>
              </>
            }
            description="Please read these terms carefully before using our services"
            badge="Legal"
            badgeIcon={<FileText className="h-8 w-8" />}
          />

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="card p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.01, y: -5 }}
              >
                <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-gold-400" />
                  {index + 1}. {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 card p-6 bg-dark-800/50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gold-400 flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-400">
                Last updated: January 2024. For questions about these terms, please contact us.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
