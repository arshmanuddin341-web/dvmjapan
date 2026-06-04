"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-all duration-300 hover:scale-110 shadow-sm"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180, scale: [1, 1.2, 1] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-gold-400" />
        ) : (
          <Sun className="h-5 w-5 text-gold-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
