"use client";

import { motion } from "framer-motion";
import { routes } from "@/config/routes";

export default function CarLogo() {
  return (
    <a href={routes.home} aria-label="DVM JAPAN home" className="flex items-center group cursor-pointer shrink-0 min-w-0">
      <motion.div
        className="relative flex items-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <div className="flex flex-col">
          <div className="flex items-baseline gap-0.5 leading-none">
            <span className="text-[1.3rem] font-bold tracking-tighter text-[#1A1F3C]">DVM</span>
            <span className="text-[1.3rem] font-bold tracking-tighter text-teal-500">JAPAN</span>
          </div>
          <span className="text-[8px] font-bold tracking-[0.2em] text-slate-400 uppercase leading-none mt-0.5">
            Japan Export
          </span>
        </div>
      </motion.div>
    </a>
  );
}
