"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  FileText,
  Handshake,
  Cpu,
  Users,
  Heart,
  Lightbulb,
  Building2,
  Globe,
  Clock,
  ImageIcon,
  PlayCircle,
  Briefcase,
} from "lucide-react";
import { routes } from "@/config/routes";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageHero from "@/components/layout/PageHero";

const coreValues = [
  { icon: Shield, title: "Quality", desc: "Only quality inspected vehicles cleared for global export." },
  { icon: FileText, title: "Transparency", desc: "Clear pricing, inspected condition, and fully verified export documents." },
  { icon: Handshake, title: "Reliability", desc: "Reliable processes ensuring the same consistent results every time." },
  { icon: Cpu, title: "Technology", desc: "Advanced tools enhancing both accuracy and workflow speed." },
  { icon: Users, title: "Employees", desc: "Experienced teams accountable for every single project step." },
  { icon: Heart, title: "Customers", desc: "Customer success driven operations aligned with client goals." },
  { icon: Lightbulb, title: "Efficiency", desc: "Quick execution ensuring efficiency and fewer mistakes, always guaranteed." },
];

const whyChoose = [
  { icon: Shield, title: "Trusted Quality", desc: "High quality vehicles delivered worldwide you can trust." },
  { icon: FileText, title: "Full Transparency", desc: "Transparent pricing and expert guidance you can trust." },
  { icon: Globe, title: "Global Support", desc: "Global vehicle export support with local expertise." },
  { icon: Handshake, title: "True Integrity", desc: "We listen, we care, and we deliver with integrity." },
];

const aboutCards = [
  { title: "Message from our CEO", href: routes.ceoMessage, icon: Building2, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" },
  { title: "History", href: routes.history, icon: Clock, img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80" },
  { title: "Gallery", href: routes.gallery, icon: ImageIcon, img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80" },
  { title: "Global Presence", href: routes.globalPresence, icon: Globe, img: "https://images.unsplash.com/photo-1524660988542-c440de9c0fde?auto=format&fit=crop&w=600&q=80" },
  { title: "Our 30 Sec Series", href: routes.thirtySecSeries, icon: PlayCircle, img: "https://images.unsplash.com/photo-1493238507154-20b6d19a8602?auto=format&fit=crop&w=600&q=80" },
  { title: "Company Partners", href: routes.partners, icon: Briefcase, img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <PageHero title="About Us" subtitle="Your trusted partner for premium Japanese vehicle imports worldwide." />
      <div className="container-custom max-w-6xl pt-6">
        <PageBreadcrumb items={[{ label: "About Us" }]} />

        {/* About DVM JAPAN - hero block */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/team.png"
                  alt="DVM Japan Professional Team"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold text-lg">Trusted Used Car Dealers from Japan</p>
                    <p className="text-sm opacity-90">5,000,000+ Vehicles sold worldwide!</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow-mdk mb-1">About DVM JAPAN</p>
              <h2 className="text-xl sm:text-2xl font-bold heading-section-mdk mb-4">Trusted Used Car Dealers from Japan</h2>
              <div className="text-slate-600 space-y-4">
                <p>
                  DVM JAPAN is a global hub for quality Japanese cars, specializing in the export of reliable, affordable, and high-grade Japanese vehicles to customers worldwide. Based in Japan, we connect buyers with the best used and new Japanese cars, sourced directly from trusted auctions, dealers, and suppliers across the country.
                </p>
                <p>
                  We focus on delivering top-quality Japanese used vehicles, carefully selected to meet strict standards for performance, reliability, and value. Every vehicle is thoroughly inspected to ensure low mileage, excellent condition, and verified history, giving our customers complete confidence and peace of mind with every purchase.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link href={routes.ceoMessage} className="inline-flex items-center px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors">
                    Message from CEO
                  </Link>
                  <Link href={routes.history} className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                    History
                  </Link>
                  <Link href={routes.gallery} className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                    Gallery
                  </Link>
                  <Link href={routes.globalPresence} className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                    Global Presence
                  </Link>
                  <Link href={routes.thirtySecSeries} className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                    Our 30 Sec Series
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info cards grid - DVM JAPAN Group style */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-lg hover:border-teal-500/30 transition-all"
              >
                <div className="relative aspect-[4/3] bg-slate-200">
                  <Image src={card.img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="400px" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{card.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Our Core Values */}
        <section className="mb-16">
          <p className="text-teal-600 text-sm font-semibold mb-1">The principles that guide everything we do</p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">Our Core Values</h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{v.title}</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="mb-10">
          <p className="eyebrow-mdk mb-1">Why Choose DVM JAPAN</p>
          <h2 className="text-2xl md:text-3xl font-bold heading-section-mdk mb-4">Trusted Japanese Car Exporter Worldwide</h2>
          <p className="text-slate-600 max-w-2xl mb-3">
            With over 20 years of industry experience, DVM JAPAN is a trusted Japanese car exporter serving customers across Asia, Africa, the Middle East, Europe, and beyond. We provide complete Japanese car export services, including vehicle sourcing, inspection, auction support, documentation, customs clearance, and international shipping.
          </p>
          <p className="text-slate-600 max-w-2xl mb-5">
            Our mission is to make importing Japanese cars simple, reliable, and stress-free by delivering high-quality vehicles known for durability, fuel efficiency, and advanced Japanese automotive technology.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyChoose.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Icon className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="font-semibold text-slate-900">{w.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick links – DVM JAPAN Group style */}
        <section className="flex flex-wrap gap-4">
          <Link href={routes.bankDetails} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors">
            Bank Details
          </Link>
          <Link href={routes.contact} className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
