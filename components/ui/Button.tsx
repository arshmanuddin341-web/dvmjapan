"use client";

import { ButtonHTMLAttributes, ReactNode, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { buttonHover, magneticButton } from "@/lib/animations";

// GSAP is registered globally in animations.ts

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
  magnetic?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  magnetic = false,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-mdk focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-brand-red text-white hover:bg-brand-red-dark focus:ring-teal-500 focus:ring-offset-white",
    secondary: "bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-teal-500 focus:ring-offset-white",
    outline: "bg-transparent text-slate-700 border-2 border-teal-500 hover:bg-teal-500/10 focus:ring-teal-500 focus:ring-offset-white",
    ghost: "bg-transparent text-slate-600 hover:text-brand-navy hover:bg-slate-100 focus:ring-teal-500 focus:ring-offset-white",
    danger: "bg-brand-red text-white hover:bg-brand-red-dark focus:ring-teal-500 focus:ring-offset-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  useEffect(() => {
    if (!buttonRef.current || disabled || isLoading) return;

    // Add GSAP hover micro-interactions
    const cleanupHover = buttonHover(buttonRef.current);
    
    // Add magnetic effect if enabled
    let cleanupMagnetic: (() => void) | undefined;
    if (magnetic) {
      cleanupMagnetic = magneticButton(buttonRef.current, 0.3);
    }

    return () => {
      cleanupHover?.();
      cleanupMagnetic?.();
    };
  }, [disabled, isLoading, magnetic]);

  return (
    <button
      ref={buttonRef}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
