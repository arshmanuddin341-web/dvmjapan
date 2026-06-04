import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Customer testimonials and reviews about importing Japanese vehicles with DVM JAPAN Group.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

