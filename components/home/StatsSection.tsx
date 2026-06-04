"use client";

import { useRef, useEffect, useState } from "react";
import { Car, Users, Award, Building2 } from "lucide-react";

const stats = [
  { value: 5000, suffix: "+", label: "Vehicle in Stock Cars", icon: Car },
  { value: 10, suffix: "k+", label: "Satisfied Customer", icon: Users },
  { value: 15, suffix: "+", label: "Award Achievement", icon: Award },
  { value: 20, suffix: "+", label: "Total Showroom", icon: Building2 },
];

function useCountUp(end: number, suffix: string, durationMs: number, start: boolean, delayMs: number) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start || end === 0) {
      setCount(end);
      return;
    }
    const timeoutId = setTimeout(() => {
      startTimeRef.current = null;
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / durationMs, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(easeOutQuart * end);
        setCount(current);
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delayMs);
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafRef.current);
    };
  }, [end, durationMs, start, delayMs]);

  return count;
}

function AnimatedStat({
  value,
  suffix,
  label,
  icon: Icon,
  isInView,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isInView: boolean;
  index: number;
}) {
  const count = useCountUp(value, suffix, 1600, isInView, index * 120);

  return (
    <div
      className={`group text-center relative ${isInView ? "animate-stats-fade-up" : "opacity-0 translate-y-3"}`}
      style={isInView ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 mb-3 group-hover:bg-teal-500/15 group-hover:scale-110 transition-all duration-300 animate-float-slow" style={{ animationDelay: `${index * 0.5}s` }}>
        <Icon className="h-6 w-6 md:h-7 md:w-7" />
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums text-slate-900 tracking-tight">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-slate-900 py-10 md:py-14 overflow-hidden" aria-labelledby="stats-heading">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 id="stats-heading" className="text-xl md:text-2xl font-bold text-white mb-1.5 uppercase tracking-tight">
            Global Automotive Excellence
          </h2>
          <h3 className="text-lg md:text-xl font-semibold text-teal-400 mb-3">
            Trusted by thousands of importers worldwide
          </h3>
          <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
            DVM JAPAN is a leading automotive exporter providing direct access to premium Japanese car auctions. We ensure transparency, quality, and smooth logistics for every vehicle delivered.
          </p>
        </div>
        <div className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-sm p-6 md:p-8 shadow-xl border border-white/20 shadow-slate-900/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((item, index) => (
              <AnimatedStat
                key={item.label}
                value={item.value}
                suffix={item.suffix}
                label={item.label}
                icon={item.icon}
                isInView={isInView}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
