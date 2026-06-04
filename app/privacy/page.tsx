"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Sparkles, Lock, Eye, Globe, FileCheck, AlertCircle } from "lucide-react";
import { scrollReveal, slideUp, fadeIn } from "@/lib/animations";
import ScrollReveal from "@/components/animations/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = [
  {
    title: "Information We Collect",
    icon: Eye,
    content: "We collect information you provide when contacting us, placing orders, or using our services, including name, email, phone number, shipping address, and payment information.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "How We Use Your Information",
    icon: Globe,
    content: "We use your information to process orders, provide customer service, send updates about your shipment, and improve our services. We do not sell your personal information to third parties.",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Data Security",
    icon: Lock,
    content: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Cookies",
    icon: FileCheck,
    content: "We use cookies to improve your experience on our website. You can disable cookies in your browser settings, though this may affect website functionality.",
    color: "from-orange-500 to-teal-500",
  },
  {
    title: "Third-Party Services",
    icon: Globe,
    content: "We may use third-party services for payment processing, shipping, and analytics. These services have their own privacy policies.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Your Rights",
    icon: Shield,
    content: "You have the right to access, update, or delete your personal information. Contact us to exercise these rights.",
    color: "from-gold-500 to-gold-600",
  },
];

export default function PrivacyPage() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionsRef.current) {
      scrollReveal(sectionsRef.current, slideUp, { delay: 0.3 });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16 pt-20">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <HeroSection
            title={
              <>
                Privacy <span className="gradient-text">Policy</span>
              </>
            }
            description="How we collect, use, and protect your personal information"
            badge="Privacy"
            badgeIcon={<Shield className="h-8 w-8" />}
          />

          <div ref={sectionsRef} className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  className="card p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -5 }}
                >
                  <div className="flex items-start gap-6">
                    <motion.div
                      className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex-shrink-0`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed text-lg">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-12 card p-6 bg-dark-800/50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gold-400 flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-400">
                Last updated: January 2024
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
