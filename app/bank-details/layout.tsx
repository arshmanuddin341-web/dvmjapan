import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Details",
  description: "Official DVM JAPAN Group bank details for payments related to Japanese vehicle imports and services.",
  alternates: { canonical: "/bank-details" },
};

export default function BankDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

