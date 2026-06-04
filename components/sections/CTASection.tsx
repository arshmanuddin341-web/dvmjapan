"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

export interface CTASectionProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  variant?: "default" | "gradient" | "minimal";
  className?: string;
}

export default function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
  className,
}: CTASectionProps) {
  const variants = {
    default: "card p-8 md:p-12",
    gradient: "card p-8 md:p-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30",
    minimal: "p-8 md:p-12",
  };

  const defaultPrimary = {
    label: "Get Started",
    href: routes.contact,
  };

  const defaultSecondary = {
    label: "Learn More",
    href: routes.about,
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container-custom">
        <motion.div
          className={cn("text-center max-w-3xl mx-auto", variants[variant])}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-300 mb-8">
              {description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryAction?.href || defaultPrimary.href}
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base cursor-pointer"
            >
              {primaryAction?.label || defaultPrimary.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="btn-secondary px-8 py-4 text-base cursor-pointer"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
