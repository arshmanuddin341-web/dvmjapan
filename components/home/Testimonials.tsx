"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { testimonials } from "@/data/testimonials";
import { Star, Quote } from "lucide-react";
import { routes } from "@/config/routes";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          setVisible((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    const refs = cardRefs.current;
    for (let i = 0; i < testimonials.length && i < 6; i++) {
      const el = refs[i];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section testimonials-section border-t border-slate-200/80 relative"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-5 md:mb-7 px-1">
          <p className="eyebrow-mdk mb-1 text-[10px] tracking-[0.3em]">Real Reviews</p>
          <h2
            id="testimonials-heading"
            className="text-lg sm:text-xl md:text-2xl font-bold heading-section-mdk mb-2 text-slate-900"
          >
            What Our Customers Say
          </h2>
          <p className="text-slate-600 leading-relaxed text-xs md:text-sm">
            Discover how our customers around the world experience DVM JAPAN&apos;s quality, service, &amp; reliability.
            Their feedback reflects the trust and satisfaction we strive to deliver every day.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 2xl:gap-6"
          role="list"
        >
          {testimonials.slice(0, 6).map((t, index) => (
            <article
              key={t.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              data-index={index}
              className={`testimonial-card testimonial-card-reveal p-5 md:p-6 ${visible[index] ? "is-visible" : ""}`}
              style={{
                transitionDelay: visible[index] ? `${index * 80}ms` : "0ms",
              }}
              role="listitem"
            >
              <div className="flex gap-0.5 mb-3" role="img" aria-label={`${t.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${i < t.rating ? "fill-teal-500 text-teal-500" : "text-slate-200"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500/25 mb-2 shrink-0" aria-hidden="true" />
              <blockquote className="text-slate-600 leading-relaxed mb-3 text-xs md:text-sm break-words">
                &quot;{t.comment}&quot;
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 min-w-0">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-500/15 to-teal-600/10 flex items-center justify-center text-teal-600 font-semibold text-sm shrink-0 border border-teal-500/20"
                  aria-hidden="true"
                >
                  {t.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 text-sm truncate">{t.name}</div>
                  <div className="text-xs text-slate-700 truncate">{t.location}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={routes.testimonials}
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 rounded-lg px-4 py-2"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
