"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Award, TrendingUp, Users, Globe } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

const values = [
    {
        icon: ShieldCheck,
        title: "Unmatched Integrity",
        desc: "We provide honest translations of auction sheets. If a car has hidden issues, we tell you before you bid.",
    },
    {
        icon: Globe,
        title: "Global Logistics Network",
        desc: "With partners in 50+ countries, we handle the complex paperwork so your car arrives safely and legally.",
    },
    {
        icon: Award,
        title: "Premium Quality Only",
        desc: "We specialize in Grade 4 and above. Our focus is on long-term reliability for our customers.",
    },
    {
        icon: TrendingUp,
        title: "Direct Auction Prices",
        desc: "Skip the middleman. Buy directly from the source with transparent service fees and no hidden markups.",
    },
];

export default function WhyChooseUsPage() {
    return (
        <div className="min-h-screen bg-white pb-20 pt-2">
            <PageHero
                title="Why DVM JAPAN Group?"
                subtitle="Built on trust, transparency, and a commitment to delivering the best Japanese vehicles & machinery."
                variant="navy"
            />

            <div className="container-custom py-10">
                <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "Why Choose Us" }]} />

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <v.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{v.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-12 md:p-20 rounded-[3rem] bg-brand-navy text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter leading-none">
                                Experience the <br /> <span className="text-teal-400">DVM Difference</span>
                            </h2>
                            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                                We believe that buying a car from Japan should be a premium, worry-free experience. From our head office in Japan to our regional support teams, we are here for you.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-4xl font-black text-white mb-1">15+</p>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Years Experience</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white mb-1">50+</p>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Countries Served</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                "100% Verified Auction Documentation",
                                "Licensed Exporter from all major Japanese ports",
                                "Dedicated Account Managers for every client",
                                "Secure Multi-currency Payment options"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <CheckCircle2 className="h-6 w-6 text-teal-400" />
                                    <span className="font-bold text-slate-200">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
