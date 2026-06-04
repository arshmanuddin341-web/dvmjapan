/**
 * SEO CONFIGURATION
 * Centralized SEO metadata and structured data configuration
 */

import { siteConfig } from '@/lib/site-config';
import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Default SEO metadata
 */
export const defaultSEO: SEOConfig = {
  title: `${siteConfig.name} - World's Premium Japanese Car Marketplace`,
  description: siteConfig.description,
  keywords: [
    'Japanese cars',
    'car import',
    'auction cars',
    'used cars Japan',
    'car export',
    'Japanese vehicles',
    'right-hand drive',
    'car shipping',
    
  ],
  ogImage: '/images/og-image.jpg',
};

/**
 * Page-specific SEO configurations
 */
export const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: `${siteConfig.name} - World's Premium Japanese Car Marketplace`,
    description: 'Import premium Japanese vehicles directly from auctions. 50,000+ cars available. Trusted by 10,000+ customers worldwide.',
  },
  inventory: {
    title: 'Vehicle Inventory - Browse 50,000+ Japanese Cars',
    description: 'Browse our extensive inventory of Japanese vehicles. Filter by make, model, year, and more. Find your perfect car today.',
  },
  howItWorks: {
    title: 'How It Works - Japanese Car Import Process',
    description: 'Learn how to import Japanese cars with our step-by-step guide. From auction selection to delivery, we make it easy.',
  },
  pricing: {
    title: 'Pricing & Costs - Transparent Japanese Car Import Pricing',
    description: 'Understand the complete cost breakdown for importing Japanese vehicles. FOB, CIF, shipping, and all fees explained.',
  },
  costCalculator: {
    title: 'Cost Calculator - Calculate Your Import Costs',
    description: 'Use our cost calculator to estimate the total cost of importing your Japanese vehicle. Get instant pricing.',
  },
  shipping: {
    title: 'Shipping Information - Global Vehicle Shipping',
    description: 'Comprehensive shipping information for importing Japanese vehicles worldwide. Port details, transit times, and process.',
  },
  verification: {
    title: 'Vehicle Verification - Professional Inspection Services',
    description: 'Get your Japanese vehicle professionally verified before purchase. Comprehensive inspection reports and documentation.',
  },
  destinations: {
    title: 'Destinations - Countries We Ship To',
    description: 'We ship Japanese vehicles to 50+ countries worldwide. Check requirements and shipping information for your country.',
  },
  about: {
    title: 'About Us - Your Trusted Japanese Car Import Partner',
    description: 'Learn about DVM JAPAN, your trusted partner for importing Japanese vehicles. 10+ years of experience, 10,000+ satisfied customers.',
  },
  blog: {
    title: 'Blog - Japanese Car Import News & Guides',
    description: 'Stay updated with the latest news, guides, and tips about Japanese car imports. Expert insights and industry updates.',
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Contact DVM JAPAN for inquiries about Japanese car imports. We\'re here to help you find your perfect vehicle.',
  },
  faq: {
    title: 'FAQ - Frequently Asked Questions',
    description: 'Find answers to common questions about importing Japanese vehicles. Everything you need to know in one place.',
  },
};

/**
 * Generate metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const title = config.title || defaultSEO.title;
  const description = config.description || defaultSEO.description;

  return {
    title,
    description,
    keywords: config.keywords || defaultSEO.keywords,
    openGraph: {
      title,
      description,
      images: config.ogImage || defaultSEO.ogImage,
      type: 'website',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: config.ogImage || defaultSEO.ogImage,
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
    },
    alternates: {
      canonical: config.canonical,
    },
  };
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Product' | 'Article', data?: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: 'https://dvmjapan.com',
        logo: 'https://dvmjapan.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: siteConfig.contact.phone,
          contactType: 'Customer Service',
          email: siteConfig.contact.email,
        },
        sameAs: Object.values(siteConfig.social),
      };

    case 'WebSite':
      return {
        ...baseData,
        name: siteConfig.name,
        url: 'https://dvmjapan.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://dvmjapan.com/inventory?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Product':
      return {
        ...baseData,
        ...data,
      };

    case 'Article':
      return {
        ...baseData,
        ...data,
      };

    default:
      return baseData;
  }
}
