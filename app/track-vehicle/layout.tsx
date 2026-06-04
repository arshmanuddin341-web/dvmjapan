import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Vehicle",
  description:
    "Track your vehicle shipment with DVM JAPAN Group. Create an account and request access from our admin team to view your vehicle tracking updates in the dashboard.",
  alternates: { canonical: "/track-vehicle" },
};

export default function TrackVehicleLayout({ children }: { children: React.ReactNode }) {
  return children;
}

