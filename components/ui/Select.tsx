"use client";

import { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  options: Array<{ value: string; label: string }>;
}

export default function Select({
  label,
  error,
  helperText,
  leftIcon,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
            {leftIcon}
          </div>
        )}
        <select
          className={cn(
            "w-full rounded-xl border bg-white/5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer",
            leftIcon ? "pl-12" : "pl-4",
            "pr-12 py-3",
            error ? "border-teal-500/50" : "border-white/10",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white text-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
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
