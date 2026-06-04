"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Accordion from "@/components/ui/Accordion";
import { buyerQuestions } from "@/data/buyerQuestions";
import { sectionHeaderReveal, staggerRevealDramatic } from "@/lib/animations";
import { useCurrency } from "@/context/CurrencyContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const accordionItems = buyerQuestions.map((q) => ({
  id: q.id,
  title: q.question,
  content: <span className="text-slate-600 text-sm leading-relaxed">{q.answer}</span>,
}));

const faqImage = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80";

export default function BuyerQuestionsSection() {
  const { t } = useCurrency();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        sectionHeaderReveal(headerRef.current, { y: 28 });
      }
      if (listRef.current) {
        staggerRevealDramatic(listRef.current, "> div > div", { stagger: 0.12, y: 32 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-white" aria-labelledby="buyer-questions-heading">
      <div className="container-custom">
        <div ref={headerRef} className="text-center mb-5 px-1">
          <p className="eyebrow-mdk mb-1 text-[10px] tracking-[0.3em] font-bold">{t('faq_eyebrow')}</p>
          <h2 id="buyer-questions-heading" className="text-lg sm:text-xl md:text-2xl font-bold heading-section-mdk mb-2">
            {t('faq_title')}
          </h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xl mx-auto">
            {t('faq_subtitle')}
          </p>
        </div>
        {/* DVM JAPAN Group: questions left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div ref={listRef} className="min-w-0">
            <Accordion items={accordionItems} allowMultiple variant="light" />
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 hidden lg:block">
            <Image
              src={faqImage}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 0vw, 50vw"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
