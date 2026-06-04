"use client";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  /** DVM JAPAN Group style: navy strip by default */
  variant?: "navy" | "white";
  className?: string;
};

export default function PageHero({ title, subtitle, variant = "navy", className = "" }: PageHeroProps) {
  if (variant === "white") {
    return (
      <section className={`border-b border-slate-200 bg-white py-10 md:py-12 ${className}`}>
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-brand-navy text-white py-10 md:py-14 ${className}`}>
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-blue-100/90 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
