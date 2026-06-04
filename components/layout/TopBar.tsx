"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Facebook, Instagram, Linkedin,
    ChevronDown, Globe, DollarSign,
    User, LogIn, UserPlus
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
    const {
        selectedCurrency, setCurrency, currencies,
        selectedLanguage, setLanguage, languages, t
    } = useCurrency();
    const config = useSiteConfig();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <div className="bg-[#1A1F3C] text-white py-1.5 text-[11px] font-medium hidden md:block">
            <div className="container-custom flex justify-between items-center">

                {/* Left: Socials */}
                <div className="flex items-center gap-3">
                    <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
                        <Facebook className="h-3.5 w-3.5" />
                    </a>
                    <a href={config.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
                        <svg className="h-3 w-3 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
                        <Instagram className="h-3.5 w-3.5" />
                    </a>
                    <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
                        <Linkedin className="h-3.5 w-3.5" />
                    </a>

                    <div className="h-3 w-[1px] bg-white/20 ml-1 mr-1" />

                    {/* Region/Country - Static for now based on image */}
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded transition-colors mr-2">
                        <span>🇯🇵</span>
                        <span>Japan</span>
                        <ChevronDown className="h-3 w-3 opacity-60" />
                    </div>

                    <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        <span className="opacity-90">{t('live_rates')}: {selectedCurrency.code}</span>
                    </div>
                </div>

                {/* Middle: Selection group */}
                <div className="flex items-center gap-4" ref={dropdownRef}>

                    {/* Language Selector */}
                    <div className="relative group">
                        <button
                            onClick={() => toggleDropdown('lang')}
                            className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
                        >
                            <Globe className="h-3 w-3" />
                            <span>{t('top_bar_lang')}</span>
                            <span className="opacity-60">{selectedLanguage.flag}</span>
                            <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === 'lang' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openDropdown === 'lang' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg z-[100] py-1 border border-slate-200"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang.code); setOpenDropdown(null); }}
                                            className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 ${selectedLanguage.code === lang.code ? 'bg-slate-50 font-bold text-teal-600' : ''}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                {lang.name}
                                            </span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Currency Selector */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('curr')}
                            className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
                        >
                            <DollarSign className="h-3 w-3" />
                            <span>{selectedCurrency.code}</span>
                            <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === 'curr' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openDropdown === 'curr' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg z-[100] py-1 border border-slate-200"
                                >
                                    {currencies.map((curr) => (
                                        <button
                                            key={curr.code}
                                            onClick={() => { setCurrency(curr.code); setOpenDropdown(null); }}
                                            className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 ${selectedCurrency.code === curr.code ? 'bg-slate-50 font-bold text-teal-600' : ''}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 text-center">{curr.symbol}</span>
                                                {curr.code}
                                            </span>
                                            <span className="text-[9px] opacity-60">{curr.flag}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Auth */}
                <div className="flex items-center gap-4">
                    <Link href="/register" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>{t('register')}</span>
                    </Link>
                    <Link href="/login" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                        <LogIn className="h-3.5 w-3.5" />
                        <span>{t('login')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
