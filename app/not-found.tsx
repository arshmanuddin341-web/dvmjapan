"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { gsap } from "gsap";
import { fadeIn, slideUp } from "@/lib/animations";
import { routes } from "@/config/routes";
import HeroSection from "@/components/sections/HeroSection";
import Button from "@/components/ui/Button";

if (typeof window !== "undefined") {
  const { ScrollTrigger } = require("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
}

export default function NotFound() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      fadeIn(contentRef.current, { delay: 0.2 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16 pt-20 flex items-center">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <HeroSection
            title={
              <>
                404 - Page <span className="gradient-text">Not Found</span>
              </>
            }
            description="The page you're looking for doesn't exist or has been moved."
            badge="Error"
            badgeIcon={<AlertTriangle className="h-8 w-8" />}
          />

          <div ref={contentRef} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={routes.home}>
              <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
                <Home className="h-5 w-5" />
                Go Home
              </Button>
            </Link>
            <Link href={routes.inventory}>
              <Button variant="secondary" size="lg" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Browse Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
