import type { Metadata } from "next";

function titleize(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = params.slug || "";
  const pretty = titleize(slug);

  return {
    title: pretty,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}

