"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/ui/Chatbot";
import RatesConverter from "@/components/ui/RatesConverter";
import CompareBar from "@/components/vehicles/CompareBar";

/** Hide floating widgets on auth pages so they don't block the form */
const HIDE_ON_PATHS = ["/login", "/register"];

export default function FloatingWidgets() {
  const pathname = usePathname();
  const hide = HIDE_ON_PATHS.some((p) => pathname?.startsWith(p));

  if (hide) return null;

  return (
    <>
      <Chatbot />
      <RatesConverter />
      <CompareBar />
    </>
  );
}
