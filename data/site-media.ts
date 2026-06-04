/**
 * Free stock images & videos for site (Unsplash, Pexels, Coverr – all free to use).
 * Use these URLs so the site looks rich without copyright issues.
 */

export const heroImages = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=92",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=92",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=92",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=92",
];

export const heroVideos = [
  "https://cdn.coverr.co/videos/coverr-various-cars-driving-on-a-highway-4173710/4173710_preview.mp4",
  "https://cdn.coverr.co/videos/coverr-sports-car-on-a-highway-4173704/4173704_preview.mp4",
];
export const heroVideoFallback = heroVideos[0];

/** Gallery / section images – cars, ports, inspection, Japan */
export const galleryImages = [
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=90", alt: "Luxury cars" },
  { src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=90", alt: "Premium vehicle" },
  { src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=90", alt: "Sports car" },
  { src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=90", alt: "Car exterior" },
  { src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=90", alt: "Vehicle detail" },
  { src: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=90", alt: "Auction style" },
  { src: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=90", alt: "Japanese car" },
  { src: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=90", alt: "Car import" },
  { src: "https://images.unsplash.com/photo-1566473062277-5b4fc463dff2?auto=format&fit=crop&w=800&q=90", alt: "Premium cars" },
  { src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=90", alt: "Vehicle lineup" },
  { src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=90", alt: "Sports car" },
  { src: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=90", alt: "Luxury vehicle" },
];

/** Trust / About section – one large image */
export const trustSectionImage = "/images/inspection.png";

/** How it works step images (optional) */
export const howItWorksImages = [
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=90",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=90",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=90",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=90",
];

/** Contact / CTA background */
export const contactBackgroundImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85";

/** Section backgrounds (low-opacity decorative) – cars, roads, ports */
export const sectionBackgroundImages = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=80",
];

/** Second video for home (e.g. mid-page video strip) – prefer sports/VIP car */
export const homePageVideos = [
  heroVideos[1], // Sports car on highway (primary for video strip)
  heroVideos[0],
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-cars-running-on-highway-3183752/3183752_preview.mp4",
];

/** Sports car / cars in motion – main video for home strip (use first that loads) */
export const sportsCarVideoUrls = [
  "https://cdn.coverr.co/videos/coverr-various-cars-driving-on-a-highway-4173710/4173710_preview.mp4",
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-cars-running-on-highway-3183752/3183752_preview.mp4",
  "https://cdn.coverr.co/videos/coverr-sports-car-on-a-highway-4173704/4173704_preview.mp4",
];
export const sportsCarVideoUrl = sportsCarVideoUrls[0];
