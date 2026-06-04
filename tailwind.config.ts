import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* DVM JAPAN Group: white, red, navy */
        cinematic: {
          base: "#ffffff",
          elevated: "#f8fafc",
          charcoal: "#f1f5f9",
        },
        brand: {
          teal: "#00D1C1",
          "teal-dark": "#00B4A6",
          navy: "#1A1F3C",
          "navy-dark": "#0F1225",
        },
        neon: {
          cyan: "#06b6d4",
          "cyan-soft": "rgba(6, 182, 212, 0.15)",
        },
        primary: {
          50: "#fcfcfc",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        gold: {
          50: "#fffaf0",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d9ae5d", // More sophisticated gold
          600: "#c29547",
          700: "#a67c37",
          800: "#8a642a",
          900: "#705021",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#050505", // Deeper black
        },
        accent: {
          gold: "#d9ae5d",
          silver: "#e2e8f0",
          bronze: "#a87f43",
        },
        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#00C5E6",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#0084FF",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#8020C4",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-body)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-display)", "system-ui", "sans-serif"],
        hero: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-up-lg': 'slide-up-lg 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'scale-in': 'scale-in 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'scale-in-bounce': 'scale-in-bounce 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-up': 'float-up 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'float-subtle': 'float-subtle 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-up-lg': {
          '0%': { transform: 'translateY(48px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.88)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-in-bounce': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.02)' },
        },
        'glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -4px rgba(6, 182, 212, 0.35)' },
          '50%': { boxShadow: '0 0 32px -4px rgba(6, 182, 212, 0.5)' },
        },
        'gradient-shift': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'shimmer': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.92', filter: 'brightness(1.08)' },
        },
        'bounce-in': {
          '0%': { transform: 'translateY(40px) scale(0.9)', opacity: '0' },
          '60%': { transform: 'translateY(-6px) scale(1.02)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.95' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-32px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(32px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'float-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 32px -8px rgba(0, 209, 193, 0.25)',
        'cyan-glow-lg': '0 0 48px -12px rgba(0, 209, 193, 0.35)',
        'mdk-card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 24px -4px rgba(0,0,0,0.08)',
        'mdk-card-hover': '0 8px 28px -6px rgba(0,0,0,0.12), 0 0 0 1px rgba(0, 209, 193, 0.1)',
      },
      borderRadius: {
        'mdk-sm': 'var(--radius-sm, 0.375rem)',
        'mdk': 'var(--radius-lg, 0.75rem)',
        'mdk-lg': 'var(--radius-xl, 1rem)',
        'mdk-xl': 'var(--radius-2xl, 1.25rem)',
      },
      transitionTimingFunction: {
        'mdk': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'mdk-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      transitionDuration: {
        'mdk-fast': '150ms',
        'mdk': '250ms',
        'mdk-slow': '350ms',
        'mdk-slower': '500ms',
      },
      spacing: {
        'mdk-1': 'var(--space-1)',
        'mdk-2': 'var(--space-2)',
        'mdk-3': 'var(--space-3)',
        'mdk-4': 'var(--space-4)',
        'mdk-6': 'var(--space-6)',
        'mdk-8': 'var(--space-8)',
        'mdk-10': 'var(--space-10)',
        'mdk-12': 'var(--space-12)',
      },
    },
  },
  plugins: [],
};
export default config;

