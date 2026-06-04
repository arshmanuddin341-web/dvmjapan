"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { siteConfig as defaultConfig } from "@/lib/site-config";
import { api } from "@/lib/api-client";

export interface SiteConfig {
  name: string;
  description: string;
  contact: {
    phone: string;
    phoneUK?: string;
    phoneJapan?: string;
    emails: string[];
    email: string;
    address: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  stats: {
    vehicles: string;
    customers: string;
    countries: string;
  };
}

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  // Automatic live data: site config har 60 sec uthao, website pe lagate raho
  useEffect(() => {
    let cancelled = false;
    const fetchConfig = () => {
      fetch("/api/content/public/config", { cache: "no-store" })
        .then((res) => res.json())
        .then((res) => {
          if (cancelled) return;
          const data = (res as { data?: SiteConfig }).data ?? (res as unknown as SiteConfig);
          if (data && typeof data === "object" && "name" in data) {
            setConfig(data as SiteConfig);
          }
        })
        .catch(() => { });
    };
    fetchConfig();
    const interval = setInterval(fetchConfig, 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  const ctx = useContext(SiteConfigContext);
  return ctx ?? defaultConfig;
}
