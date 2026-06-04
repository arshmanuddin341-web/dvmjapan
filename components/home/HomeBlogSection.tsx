"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { routes } from "@/config/routes";
import BlogCard from "@/components/blog/BlogCard";
import { useEffect, useRef } from "react";
import { staggerRevealPremium } from "@/lib/animations";

const posts = blogPosts.slice(0, 6).map((post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  image: post.image,
  author: post.author,
  publishedAt: post.publishedAt,
  category: post.category,
  readingTime: 5,
  featured: false,
}));

export default function HomeBlogSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      staggerRevealPremium(gridRef.current, '> div');
    }
  }, []);
  return (
    <section className="section bg-white" aria-labelledby="home-blog-heading">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <p className="eyebrow-mdk mb-1 text-[10px] tracking-[0.3em]">Car insights in one place</p>
            <h2 id="home-blog-heading" className="text-xl md:text-2xl font-bold heading-section-mdk">
              Our Blogs
            </h2>
          </div>
          <Link
            href={routes.blog}
            className="text-teal-600 font-semibold hover:text-teal-700 transition-colors shrink-0"
          >
            See All Blogs
          </Link>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
