"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Globe, HeadphonesIcon, Clock } from "lucide-react";
import { routes } from "@/config/routes";
import { useCurrency } from "@/context/CurrencyContext";
import { imageParallax } from "@/lib/animations";

const carImage = "/images/hero/luxury_car.png";

export default function GlobalHubSection() {
  const { t } = useCurrency();
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current.querySelector('img');
      if (img) imageParallax(img, 0.3);
    }
  }, []);
  const points = [
    { icon: Shield, label: t('quality_assured') },
    { icon: Globe, label: t('global_reach') },
    { icon: HeadphonesIcon, label: t('trusted_service') },
    { icon: Clock, label: t('support_247') },
  ];
  return (
    <section className="section bg-white" aria-labelledby="global-hub-heading">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* DVM JAPAN Group: image on left */}
          <div ref={imageRef} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 order-2 lg:order-1">
            <Image
              src={carImage}
              alt=""
              fill
              className="object-cover object-center scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow-mdk mb-1 text-[10px] tracking-[0.3em] uppercase font-bold">{t('global_hub_eyebrow')}</p>
            <h2 id="global-hub-heading" className="text-xl md:text-2xl font-bold heading-section-mdk mb-3">
              {t('global_hub_title')}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-2 text-sm">
              {t('global_hub_desc1')}
            </p>
            <p className="text-slate-600 leading-relaxed mb-5 text-sm">
              {t('global_hub_desc2')}
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {points.map(({ icon: Icon, label }, idx) => (
                <div key={label} className="flex items-center gap-2 group">
                  <div
                    className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 animate-float-slow group-hover:scale-110 transition-transform"
                    style={{ animationDelay: `${idx * 0.4}s` }}
                  >
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{label}</span>
                </div>
              ))}
            </div>
            <Link
              href={routes.about}
              className="btn-primary inline-flex items-center gap-2"
            >
              {t('discover_more')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
