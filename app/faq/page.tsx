"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, MessageCircle, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

const faqs = [
  {
    category: "General Information",
    questions: [
      {
        q: "What types of vehicles do you export?",
        a: "We export all types of Japanese vehicles, including sedans, SUVs, trucks, vans, and commercial vehicles. We source directly from over 150 auction houses across Japan.",
      },
      {
        q: "Which countries do you ship to?",
        a: "We ship to over 50 countries worldwide, including major hubs in Africa, the Middle East, Asia Pacific, and the Americas. Contact us to confirm shipping to your specific port.",
      },
      {
        q: "How long does the process take?",
        a: "The typical timeline is 1-2 weeks for selection and payment, 30-45 days for shipping, and 1-2 weeks for documentation and customs. Total time is usually 2-3 months.",
      },
    ],
  },
  {
    category: "Pricing & Payments",
    questions: [
      {
        q: "What is the difference between FOB and CIF?",
        a: "FOB (Free On Board) is the price of the car at the Japanese port. CIF (Cost, Insurance, and Freight) includes the car price plus shipping and marine insurance to your destination port.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We primarily accept bank transfers (Telegraphic Transfer/SWIFT). We also accept secure online payments for deposits.",
      },
      {
        q: "Are there any hidden charges?",
        a: "No. Our quotes are transparent. We break down the vehicle price, auction fees, storage, and shipping so you see exactly what you are paying for.",
      },
    ],
  },
  {
    category: "Auction & Condition",
    questions: [
      {
        q: "What do auction grades mean?",
        a: "Auction grades range from 1 to 6. Grade 4.5 and 5 are excellent/near-new condition. Grade 4 is good. Grade 3.5 is fair. Grade R indicates the vehicle has had repairs.",
      },
      {
        q: "Can I get a translation of the auction sheet?",
        a: "Yes. Our team provides professional English translations of the auction inspector's notes so you understand the true condition before bidding.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>("General Information");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const toggleQuestion = (questionKey: string) => {
    setOpenQuestion(openQuestion === questionKey ? null : questionKey);
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-2">
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about importing from Japan."
        variant="navy"
      />

      <div className="container-custom py-10">
        <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "FAQ" }]} />

        <div className="max-w-4xl mx-auto mt-12">
          <div className="space-y-6">
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{category.category}</h2>
                  </div>
                  <motion.div
                    animate={{ rotate: openCategory === category.category ? 180 : 0 }}
                  >
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openCategory === category.category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100"
                    >
                      {category.questions.map((faq, qIndex) => {
                        const questionKey = `${catIndex}-${qIndex}`;
                        const isOpen = openQuestion === questionKey;
                        return (
                          <div key={qIndex} className="border-b border-slate-50 last:border-0">
                            <button
                              onClick={() => toggleQuestion(questionKey)}
                              className="w-full p-5 flex items-start justify-between text-left hover:bg-slate-50/50 transition-colors"
                            >
                              <span className={`font-semibold text-sm sm:text-base mr-4 ${isOpen ? "text-teal-600" : "text-slate-800"}`}>
                                {faq.q}
                              </span>
                              <ChevronDown className={`h-4 w-4 mt-1 shrink-0 transition-transform ${isOpen ? "rotate-180 text-teal-600" : "text-slate-400"}`} />
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed"
                                >
                                  {faq.a}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-brand-navy text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                Our team in Japan is ready to help you with vehicle selection, auction bidding, and shipping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={routes.contact} className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all inline-flex items-center justify-center gap-2">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="px-8 py-3.5 rounded-xl border border-slate-600 hover:bg-white/5 text-white font-bold transition-all">
                  View Auction Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
