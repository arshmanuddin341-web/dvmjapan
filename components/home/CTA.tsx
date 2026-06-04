"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone, Mail, Award, Globe, Car } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { routes } from "@/config/routes";
import { sectionRevealPremium, staggerRevealPremium } from "@/lib/animations";
import { contactBackgroundImage, homePageVideos } from "@/data/site-media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const badges = [
  { icon: Award, text: "15+ Years" },
  { icon: Globe, text: "50+ Countries" },
  { icon: Car, text: "10,000+ Vehicles" },
];

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        sectionRevealPremium(headerRef.current, { delay: 0 });
      }

      // Cards stagger
      if (cardsRef.current) {
        staggerRevealPremium(cardsRef.current, "> *", {
          stagger: 0.12,
          delay: 0.1,
        });
      }

      // Badges reveal
      if (badgesRef.current) {
        gsap.fromTo(
          badgesRef.current.querySelectorAll("div"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: badgesRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-transparent relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none z-0" aria-hidden>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" poster={contactBackgroundImage}>
          <source src={homePageVideos[1]} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.22] pointer-events-none z-0" style={{ backgroundImage: `url(${contactBackgroundImage})` }} aria-hidden />
      <div className="absolute inset-0 bg-slate-900/85 pointer-events-none z-0" aria-hidden />
      <div className="container-custom relative z-10">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-6 md:mb-8 px-1">
          <span className="eyebrow mb-2 block">Ready to Begin</span>
          <h2 id="cta-heading" className="heading-section-mdk text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 tracking-tight leading-tight">
            Start Your <span className="text-red-400">Import Journey</span> Today
          </h2>
          <p className="text-slate-300 mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-base break-words">
            Join over 10,000 satisfied customers worldwide who have trusted DVM JAPAN for their Japanese vehicle imports. Whether you're seeking a luxury sedan, rugged SUV, commercial van, or specialty vehicle, we provide access to Japan's finest automotive inventory with professional service, transparent pricing, and reliable delivery. Our expert team is ready to guide you through every step of the process, from vehicle selection to final delivery at your destination port. Experience the difference that 15 years of industry expertise makes.
          </p>

          <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed mb-5 max-w-2xl mx-auto">
            Auctions are wholesale marketplaces. Vehicles are sold as-is based on grades and auction sheets. Pricing varies by market. Professional guidance and documentation replace retail guarantees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto mb-5 md:mb-6 text-left">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4">
              <p className="text-[10px] sm:text-[11px] font-semibold text-red-400/90 uppercase tracking-wider mb-2">This is for</p>
              <ul className="space-y-1 text-[11px] sm:text-xs text-slate-300 list-none">
                <li className="flex items-start gap-1.5"><span className="text-teal-500/80 mt-0.5 shrink-0" aria-hidden="true">✔</span> Buyers importing vehicles</li>
                <li className="flex items-start gap-1.5"><span className="text-teal-500/80 mt-0.5 shrink-0" aria-hidden="true">✔</span> Dealers, exporters, and serious individual buyers</li>
                <li className="flex items-start gap-1.5"><span className="text-teal-500/80 mt-0.5 shrink-0" aria-hidden="true">✔</span> Those comfortable with auction-based purchases</li>
                <li className="flex items-start gap-1.5"><span className="text-teal-500/80 mt-0.5 shrink-0" aria-hidden="true">✔</span> Buyers ready for deposits and documentation</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4">
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Not for</p>
              <ul className="space-y-1 text-[11px] sm:text-xs text-slate-400 list-none">
                <li className="flex items-start gap-1.5"><span className="text-zinc-600 mt-0.5 shrink-0" aria-hidden="true">✖</span> Local retail buyers</li>
                <li className="flex items-start gap-1.5"><span className="text-zinc-600 mt-0.5 shrink-0" aria-hidden="true">✖</span> Test drives or showroom visits</li>
                <li className="flex items-start gap-1.5"><span className="text-zinc-600 mt-0.5 shrink-0" aria-hidden="true">✖</span> Immediate delivery or fixed-price retail</li>
                <li className="flex items-start gap-1.5"><span className="text-zinc-600 mt-0.5 shrink-0" aria-hidden="true">✖</span> Casual browsing without intent to buy</li>
              </ul>
            </div>
          </div>

          <p className="text-red-400/90 text-xs sm:text-sm mb-2 font-medium">
            Real-time bidding via licensed Japan auction access.
          </p>
          <p className="text-slate-400 text-[11px] sm:text-xs mb-2">Verification required · Export-only · Deposit to bid</p>
          <p className="text-slate-400 text-[11px] sm:text-xs mb-3 max-w-xl mx-auto">
            How long the process usually takes: most buyers receive an initial response within 24–48 hours; auction cycles and export timelines vary by destination and vehicle.
          </p>
          <p className="text-slate-400 text-[11px] sm:text-xs mb-3 max-w-lg mx-auto">
            Every bid is placed only after buyer confirmation and deposit.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center flex-wrap">
            <motion.div
              className="inline-flex justify-center"
              whileInView={{ scale: [0.98, 1.02, 1], y: [6, -2, 0] }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link href={routes.contact} className="btn-primary btn-glow-pulse inline-flex items-center gap-1.5 cursor-pointer shrink-0 min-w-[200px] justify-center sm:min-w-0 transition-all duration-mdk" aria-label="Talk to a Japan auction expert" data-gsap-button>
                Talk to a Japan Auction Expert <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </motion.div>
            <Link href={routes.inventory} className="btn-secondary inline-flex items-center gap-1.5 cursor-pointer shrink-0 border-white/30 text-white hover:bg-white/10 hover:border-white/40" aria-label="Browse our vehicle collection">
              Browse Collection
            </Link>
          </div>
          <p className="text-slate-400 text-[11px] sm:text-xs mt-3 max-w-lg mx-auto">
            For auction access, inspection reports, or shipping quotes. Export-only; deposit required to secure.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto mb-6 md:mb-8"
        >
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="card p-3 sm:p-4 md:p-5 flex items-center gap-2.5 sm:gap-3 hover:border-teal-500/20 transition-colors cursor-pointer min-w-0"
          >
            <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-teal-500/20 bg-teal-500/5 flex items-center justify-center">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[8px] sm:text-[9px] font-semibold text-teal-500/90 uppercase tracking-wider">Direct Line</div>
              <div className="font-semibold text-white text-xs sm:text-sm break-all">{siteConfig.contact.phone}</div>
            </div>
          </a>
          {siteConfig.contact.emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="card p-3 sm:p-4 md:p-5 flex items-center gap-2.5 sm:gap-3 hover:border-teal-500/30 transition-colors cursor-pointer min-w-0 bg-white/5 border-white/10"
            >
              <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-teal-500/30 bg-teal-500/10 flex items-center justify-center">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[8px] sm:text-[9px] font-semibold text-teal-500/90 uppercase tracking-wider">Email</div>
                <div className="font-semibold text-white text-xs sm:text-sm truncate break-all">{email}</div>
              </div>
            </a>
          ))}
        </div>

        <div ref={badgesRef} className="flex flex-wrap justify-center gap-3 sm:gap-4 text-slate-400 text-[11px] sm:text-xs" role="list">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.text} className="flex items-center gap-1.5" role="listitem">
                <Icon className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                <span>{b.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
