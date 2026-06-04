"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function VIPLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-12 h-12">
          {/* VIP Badge Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-lg transform rotate-12 shadow-lg shadow-gold-500/50" />
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-300/50 to-transparent rounded-lg" />
          
          {/* Sparkle Effects */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="h-4 w-4 text-gold-300" />
          </motion.div>
          
          {/* T Letter */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <span className="text-2xl font-black text-dark-950">T</span>
          </div>
        </div>
      </motion.div>
      
      <div className="flex flex-col">
        <motion.span
          className="text-2xl font-black gradient-text tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          DVM JAPAN
        </motion.span>
        <motion.span
          className="text-xs font-semibold text-gold-400/80 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Premium Exports
        </motion.span>
      </div>
    </motion.div>
  );
}
