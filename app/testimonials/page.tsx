"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/data/testimonials";
import { Star, Quote, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { scrollReveal, slideUp, fadeIn } from "@/lib/animations";
import ScrollReveal from "@/components/animations/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";
import { routes } from "@/config/routes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TestimonialsPage() {
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (testimonialsRef.current) {
      scrollReveal(testimonialsRef.current, slideUp, { delay: 0.3 });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16 pt-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <HeroSection
            title={
              <>
                What Our <span className="gradient-text">Customers Say</span>
              </>
            }
            description="Real experiences from satisfied customers worldwide"
            badge="Customer Reviews"
            badgeIcon={<Sparkles className="h-8 w-8" />}
          />

          {/* Testimonials Grid */}
          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="card p-8 relative group"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Quote className="h-10 w-10 text-gold-400/50 mb-4" />
                </motion.div>

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.15 + i * 0.1, type: "spring" }}
                    >
                      <Star className="h-6 w-6 fill-gold-400 text-gold-400" />
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  className="text-gray-300 mb-8 leading-relaxed text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                >
                  "{testimonial.comment}"
                </motion.p>

                <div className="border-t border-dark-800 pt-6">
                  <div className="font-black text-white text-lg mb-1">{testimonial.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{testimonial.location}</div>
                  <div className="text-sm font-semibold gradient-text">{testimonial.vehicle}</div>
                  <div className="text-xs text-gray-500 mt-2">{testimonial.date}</div>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:from-gold-500/10 group-hover:to-gold-500/5 transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { value: "98%", label: "Satisfaction Rate", color: "from-gold-500 to-gold-600" },
              { value: "5,000+", label: "Happy Customers", color: "from-blue-500 to-cyan-500" },
              { value: "4.9/5", label: "Average Rating", color: "from-green-500 to-emerald-500" },
              { value: "90%", label: "Repeat Customers", color: "from-purple-500 to-pink-500" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="card p-6 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <CTASection
            title="Join Our Satisfied Customers"
            description="Start your vehicle import journey with DVM JAPAN today"
            primaryAction={{
              label: "Browse Vehicles",
              href: routes.inventory,
            }}
            secondaryAction={{
              label: "Contact Us",
              href: routes.contact,
            }}
            variant="gradient"
          />
        </div>
      </div>
    </div>
  );
}
