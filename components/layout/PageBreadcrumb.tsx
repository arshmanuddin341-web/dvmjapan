"use client";

import Link from "next/link";
import { routes } from "@/config/routes";

type Crumb = { label: string; href?: string };

export default function PageBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
      <Link href={routes.home} className="hover:text-teal-600 transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-teal-600 transition-colors duration-mdk">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
