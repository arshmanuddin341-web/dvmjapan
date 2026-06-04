import type { Metadata } from "next";
import { Inter, Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ModernHeader from "@/components/layout/ModernHeader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const poppins = Poppins({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
import Footer from "@/components/layout/Footer";
import FloatingWidgets from "@/components/layout/FloatingWidgets";
import PageTransition from "@/components/animations/PageTransition";
import GSAPButtonHoverInit from "@/components/animations/GSAPButtonHoverInit";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketProvider";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CompareProvider } from "@/context/CompareContext";
import { siteConfig } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dvmjapan.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Used Japanese Cars for Sale - Buy Directly from Japan | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`
  },
  description: "Browse 50,000+ high-quality Japanese used cars direct from Tokyo auctions. Worldwide export to 50+ countries. Best FOB prices, trusted inspections, and secure shipping. Find your next car today.",
  keywords: ["Used Japanese cars", "Japan car auction", "buy cars from Japan", "Japanese vehicle export", "Toyota used cars Japan", "Honda used cars Japan", "DVM JAPAN", "cheap cars from Japan"],
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `Used Japanese Cars for Sale - Direct from Japan | ${siteConfig.name}`,
    description: "Exporting premium Japanese used cars worldwide. Access 150+ auction houses. Secure payment and worldwide delivery.",
    images: [
      {
        url: "/DVM JAPAN-groups-logo-transparent.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Used Japanese Cars for Sale | ${siteConfig.name}`,
    description: "Browse 50,000+ high-quality Japanese used cars direct from Tokyo auctions.",
    images: ["/DVM JAPAN-groups-logo-transparent.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/dvm-favicon.png", type: "image/png" },
    ],
    apple: "/dvm-favicon.png",
    shortcut: "/dvm-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: siteConfig.name,
    alternateName: "DVM JAPAN Group",
    url: siteUrl,
    logo: `${siteUrl}/DVM JAPAN-groups-logo-transparent.png`,
    image: `${siteUrl}/DVM JAPAN-groups-logo-transparent.png`,
    description: "Japan's leading used car exporter. Direct access to 150+ auction houses. 50,000+ quality Japanese vehicles shipped to 50+ countries worldwide.",
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yokohama",
      addressRegion: "Kanagawa",
      addressCountry: "JP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "35.4437",
      longitude: "139.6380",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$1,000 - $100,000",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: "0", longitude: "0" },
      geoRadius: "20000 km",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "sales",
        email: siteConfig.contact.email,
        availableLanguage: ["English", "Japanese", "Urdu"],
      },
    ],
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/inventory?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${plusJakarta.variable}`}>
      <body className="bg-[var(--bg-cinematic)] text-[var(--text-primary)] antialiased font-body min-h-dvh min-w-[320px]">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <SiteConfigProvider>
                <CurrencyProvider>
                  <CompareProvider>
                    <GSAPButtonHoverInit />
                    <ModernHeader />
                    <main className="min-h-screen w-full min-w-0 overflow-x-hidden pt-16 md:pt-24 section">
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </main>
                    <Footer />
                    <FloatingWidgets />
                  </CompareProvider>
                </CurrencyProvider>
              </SiteConfigProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

