/**
 * NAVIGATION – DVM JAPAN Group.
 */

import { routes } from "./routes";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  description?: string;
  icon?: string;
}

export const headerNavigation: NavItem[] = [
  { label: "Home", href: routes.home },
  {
    label: "About Us",
    href: routes.about,
    children: [
      { label: "Bank Details", href: routes.bankDetails, description: "Reliable bank details for hassle free payments with DVM JAPAN." },
      { label: "About Us", href: routes.about, description: "Excellence in Japanese vehicles & machinery." },
      { label: "CEO Message", href: routes.ceoMessage, description: "Excellence in Japanese vehicles & machinery." },
      { label: "History", href: routes.history, description: "Global leaders in Japanese vehicle exports." },
      { label: "Gallery", href: routes.gallery, description: "Browse premium Japanese vehicles & machinery." },
      { label: "Global Presence", href: routes.globalPresence, description: "Trusted vehicles & machinery, delivered globally." },
      { label: "Our 30 Sec Series", href: routes.thirtySecSeries, description: "Fast, informative updates in 30 seconds." },
      { label: "Partners", href: routes.partners, description: "Our trusted shipping, quality & payment partners." },
    ],
  },
  { label: "Used Cars", href: routes.inventory },
  {
    label: "Services",
    href: routes.howItWorks,
    children: [
      { label: "Japan Auctions", href: routes.auction, description: "Direct access to 150+ Japanese auction houses." },
      { label: "How to Buy", href: routes.howItWorks, description: "Our simple 4-step import process." },
      { label: "Shipping Info", href: routes.shipping, description: "Global logistics, ports, and transit times." },
      { label: "Import Process", href: routes.importProcess, description: "Detailed guide on importing to your country." },
      { label: "Pricing & Costs", href: routes.pricing, description: "Transparent breakdown of FOB and CIF costs." },
      { label: "Track Shipment", href: routes.trackVehicle, description: "Track your vehicle's journey in real-time." },
    ],
  },
  { label: "Blogs", href: routes.blog },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
];

export const footerNavigation = {
  legal: [
    { label: "Privacy Policy", href: routes.privacy },
    { label: "Terms & Conditions", href: routes.terms },
  ],
};

export const mobileNavigation: NavItem[] = [
  ...headerNavigation,
  { label: "Login", href: routes.login },
  { label: "Register", href: routes.register },
];

export function getNavItemByHref(href: string): NavItem | undefined {
  function findInItems(items: NavItem[]): NavItem | undefined {
    for (const item of items) {
      if (item.href === href) return item;
      if (item.children) {
        const found = findInItems(item.children);
        if (found) return found;
      }
    }
    return undefined;
  }
  return findInItems(headerNavigation);
}

export function isNavItemActive(currentPath: string, item: NavItem): boolean {
  if (item.href === "/") return currentPath === "/";
  if (currentPath.startsWith(item.href)) return true;
  if (item.children) return item.children.some((child) => isNavItemActive(currentPath, child));
  return false;
}
