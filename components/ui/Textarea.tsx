"use client";

import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({
  label,
  error,
  helperText,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none",
          "px-4 py-3",
          error ? "border-teal-500/50" : "border-white/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-teal-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
