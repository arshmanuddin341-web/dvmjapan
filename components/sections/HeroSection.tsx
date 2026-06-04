"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  title: string | ReactNode;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  background?: "gradient" | "dark" | "image" | "transparent" | "light";
}

export default function HeroSection({
  title,
  subtitle,
  description,
  badge,
  badgeIcon,
  children,
  className,
  background = "gradient",
}: HeroSectionProps) {
  const backgrounds = {
    gradient: "bg-gradient-to-b from-dark-950 to-dark-900",
    dark: "bg-dark-950",
    image: "bg-gradient-to-b from-dark-950/95 to-dark-900/95",
    transparent: "bg-transparent",
    light: "bg-white border-b border-slate-200",
  };
  const isLight = background === "light";

  return (
    <section className={cn("relative py-16 pt-20 overflow-hidden", backgrounds[background], className)}>
      <div className="container-custom">
        <div className={cn("max-w-4xl mx-auto text-center", isLight && "text-slate-900")}>
          {badge && (
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {badgeIcon && <span className={isLight ? "text-teal-600" : "text-red-400"}>{badgeIcon}</span>}
              <span className={isLight ? "text-teal-600 font-semibold text-sm uppercase tracking-wider" : "text-red-400 font-semibold text-sm uppercase tracking-wider"}>
                {badge}
              </span>
            </motion.div>
          )}

          {subtitle && (
            <motion.h2
              className={cn("text-lg md:text-xl mb-4", isLight ? "text-slate-500" : "text-gray-400")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {subtitle}
            </motion.h2>
          )}

          <motion.h1
            className={cn("text-4xl md:text-5xl lg:text-6xl font-black mb-6", isLight ? "text-[var(--text-heading)]" : "text-white")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              className={cn("text-xl mb-8 max-w-2xl mx-auto", isLight ? "text-slate-600" : "text-gray-300")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
