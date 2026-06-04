/**
 * ROUTE CONFIGURATION
 * DVM JAPAN Group – routes and branding.
 */

export const routes = {
  home: "/",
  inventory: "/inventory",
  vehicleDetail: (id: string) => `/vehicles/${id}`,
  destinations: "/destinations",
  countryDetail: (country: string) => `/destinations/${country}`,
  about: "/about",
  auction: "/auction",
  bankDetails: "/bank-details",
  ceoMessage: "/about/ceo-message",
  globalPresence: "/about/global-presence",
  history: "/about/history",
  gallery: "/about/gallery",
  thirtySecSeries: "/about/30-sec-series",
  partners: "/about/partners",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  contact: "/contact",
  howItWorks: "/how-it-works",
  shipping: "/shipping",
  pricing: "/pricing",
  importProcess: "/import-process",
  whyChooseUs: "/why-choose-us",
  trackVehicle: "/track-vehicle",
  terms: "/terms",
  privacy: "/privacy",
  testimonials: "/testimonials",
  faq: "/faq",
  notFound: "/not-found",

  login: "/login",
  register: "/register",

  dashboard: "/dashboard",
  dashboardPending: "/dashboard/pending",
  dashboardTracking: "/dashboard/tracking",
  dashboardPayments: "/dashboard/payments",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",

  admin: "/admin",
  adminUsers: "/admin/users",
  adminVehicles: "/admin/vehicles",
  adminListings: "/admin/listings",
  adminPricing: "/admin/pricing",
  adminBlog: "/admin/blog",
  adminSEO: "/admin/seo",
  adminInquiries: "/admin/inquiries",
  adminJapanAuctions: "/admin/japan-auctions",
  adminVehiclesAdd: "/admin/vehicles/add",
  adminVehiclesEdit: (id: string) => `/admin/vehicles/edit/${id}`,
  adminBlogEdit: (id: string) => `/admin/blog/edit/${id}`,
  adminAuctions: "/admin/auctions",
  adminAuctionsCreate: "/admin/auctions/create",
  adminSettings: "/admin/settings",
  adminContent: "/admin/content",
  adminFaq: "/admin/faq",
  adminTestimonials: "/admin/testimonials",
} as const;

export type RouteKey = keyof typeof routes;

export function getRoute(key: RouteKey, ...params: string[]): string {
  const route = routes[key];
  if (typeof route === "function") {
    return (route as (...args: string[]) => string)(...params);
  }
  return route as string;
}

export function isActiveRoute(currentPath: string, route: string): boolean {
  if (route === "/") return currentPath === "/";
  return currentPath.startsWith(route);
}
