"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: "dark" | "light";
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  variant = "light",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isLight = variant === "light";
  const cardClass = isLight ? "rounded-xl border border-slate-200 bg-white overflow-hidden" : "rounded-xl border border-white/10 bg-white/5 overflow-hidden";
  const buttonClass = isLight ? "w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors" : "w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors";
  const titleClass = isLight ? "font-semibold text-slate-900" : "font-semibold text-white";
  const iconClass = isLight ? "h-5 w-5 text-slate-500 transition-transform" : "h-5 w-5 text-gray-400 transition-transform";

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id} className={cardClass}>
            <button
              onClick={() => toggleItem(item.id)}
              className={buttonClass}
            >
              <span className={titleClass}>{item.title}</span>
              <ChevronDown
                className={cn(iconClass, isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className={cn("p-4 pt-0", isLight ? "text-slate-600" : "text-gray-300")}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
