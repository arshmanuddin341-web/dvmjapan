"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stat {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: "cyan" | "blue" | "gold" | "green" | "purple";
}

export interface StatsSectionProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function StatsSection({
  stats,
  columns = 4,
  className,
}: StatsSectionProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  const colors = {
    cyan: "text-cyan-500",
    blue: "text-blue-500",
    gold: "text-gold-400",
    green: "text-green-500",
    purple: "text-purple-500",
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container-custom">
        <div className={cn("grid gap-6", gridCols[columns])}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="card p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {stat.icon && (
                <stat.icon
                  className={cn(
                    "h-8 w-8 mx-auto mb-3",
                    colors[stat.color || "cyan"]
                  )}
                />
              )}
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
