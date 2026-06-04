import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DVM JAPAN Group privacy policy explaining how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

