"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors",
            leftIcon ? "pl-12" : "pl-4",
            rightIcon ? "pr-12" : "pr-4",
            "py-3",
            error ? "border-teal-500/50" : "border-white/10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-teal-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
