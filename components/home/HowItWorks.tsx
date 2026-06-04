"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, FileCheck, Ship, CheckCircle, ArrowRight } from "lucide-react";
import { sectionHeaderReveal, staggerRevealDramatic } from "@/lib/animations";
import { sectionBackgroundImages } from "@/data/site-media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    number: "01",
    title: "Browse & Search",
    description: "Access our comprehensive inventory of over 50,000 vehicles sourced directly from Japan's largest auction network, including USS, TAA, CAA, and 120+ additional auction houses. Utilize our advanced search filters to narrow down by make, model, year, price range, body type, fuel type, transmission, mileage, and auction grade. Request custom vehicle searches if you don't find what you're looking for. Each listing includes high-resolution photographs, detailed specifications, auction sheets, and condition reports.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select & Inspect",
    description: "Review comprehensive vehicle information including detailed auction sheets with condition grades, mechanical inspection reports, interior and exterior assessments, and equipment lists. Our expert team in Yokohama provides additional verification services, can arrange for supplementary inspections, and offers professional advice on vehicle condition and value. Access original auction photographs, video inspections when available, and detailed condition descriptions. We ensure complete transparency so you can make informed purchasing decisions.",
    icon: FileCheck,
  },
  {
    number: "03",
    title: "Purchase & Ship",
    description: "Secure your vehicle with a deposit (typically 50-100% depending on payment terms). We accept secure bank transfers and offer flexible payment options with discounts for full upfront payment. Our team handles all export documentation including export certificates, commercial invoices, packing lists, and Bill of Lading. We coordinate shipping from major Japanese ports (Yokohama, Kobe, Osaka) through our established network of shipping partners. All vehicles are properly prepared for international transport with comprehensive insurance coverage.",
    icon: Ship,
  },
  {
    number: "04",
    title: "Receive & Enjoy",
    description: "Track your shipment in real-time with detailed logistics updates from departure to arrival at your destination port. Receive comprehensive shipping documentation including Bill of Lading, export certificates, and commercial invoices. Original vehicle documents including registration certificates, inspection reports, and auction sheets are shipped separately via DHL for security. Average shipping time is 28-45 days depending on destination. Upon arrival, complete local customs clearance and registration using the provided documentation. Our support team remains available to assist with any post-delivery questions.",
    icon: CheckCircle,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        sectionHeaderReveal(headerRef.current, { delay: 0, y: 36 });
      }

      // Steps stagger reveal – dramatic
      if (stepsRef.current) {
        staggerRevealDramatic(stepsRef.current, "> *", {
          stagger: 0.18,
          delay: 0.1,
          y: 48,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-transparent relative overflow-hidden" aria-labelledby="how-it-works-heading">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.2] pointer-events-none z-0" style={{ backgroundImage: `url(${sectionBackgroundImages[1]})` }} aria-hidden />
      <div className="absolute inset-0 bg-slate-50/90 pointer-events-none z-0" aria-hidden />
      <div className="container-custom relative z-10">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-6 md:mb-8 px-1">
          <span className="eyebrow-mdk mb-2 block">Our Process</span>
          <h2 id="how-it-works-heading" className="heading-section-mdk text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            How We <span className="text-teal-600">Deliver Excellence</span>
          </h2>
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base break-words">
            Our streamlined four-step process has been refined over 15 years of experience, designed to provide maximum transparency, efficiency, and peace of mind. From initial vehicle selection through final delivery, we handle every aspect of the import process with meticulous attention to detail. Our comprehensive approach ensures you receive accurate information, competitive pricing, proper documentation, and reliable shipping - all while maintaining clear communication at every stage.
          </p>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-3 2xl:gap-4"
          role="list"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="relative min-w-0"
                role="listitem"
              >
                <div className="card card-cinematic card-animate-hover p-3 sm:p-4 md:p-5 h-full min-w-0 transition-all duration-mdk-slower">
                  <div className="flex items-start justify-between mb-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 shrink-0 icon-glow-hover icon-pulse-hover animate-float-slow" aria-hidden="true">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-slate-200 shrink-0" aria-label={`Step ${step.number}`}>{step.number}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1 break-words">{step.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-words">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 text-slate-300" aria-hidden="true">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
