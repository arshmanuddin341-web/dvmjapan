"use client";

import { HTMLAttributes, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const motionDivConflictKeys = [
  "onAnimationStart", "onAnimationEnd", "onAnimationIteration", "onTransitionEnd",
  "onDragStart", "onDragEnd", "onDrag",
] as const;

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, (typeof motionDivConflictKeys)[number]> {
  variant?: "default" | "elevated" | "outlined" | "gradient";
  hover?: boolean;
  children: ReactNode;
}

export default function Card({
  variant = "default",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "bg-white/5 border border-white/10 backdrop-blur-xl",
    elevated: "bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl",
    outlined: "bg-transparent border-2 border-white/20",
    gradient: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30",
  };

  const hoverStyles = hover
    ? "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-xl"
    : "";

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...(props as HTMLMotionProps<"div">)}
    >
      {children}
    </motion.div>
  );
}
