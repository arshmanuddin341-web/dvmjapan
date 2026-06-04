"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { blogPosts as fallbackPosts } from "@/data/blog";
import BlogList from "@/components/blog/BlogList";
import ScrollReveal from "@/components/animations/ScrollReveal";
import PageHero from "@/components/layout/PageHero";

type Post = { id: string; slug: string; title: string; excerpt: string; image: string; author: string; publishedAt: string; category: string };

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/blog")
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data;
        setPosts(Array.isArray(data) ? data : fallbackPosts);
      })
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, []);

  const blogCards = posts.map((post) => ({
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


  return (
    <div className="min-h-screen bg-white pb-16">
      <PageHero title="DVM JAPAN Stories & Guides" subtitle="Practical advice on auctions, imports, and owning a Japanese vehicle." />
      <div className="container-custom pt-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : (
        <ScrollReveal delay={0.2}>
          <BlogList posts={blogCards} columns={3} />
        </ScrollReveal>
        )}
        <motion.section
          className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold heading-section-mdk mb-2">Stay Updated</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for the latest guides, tips, and vehicle updates.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button type="button" className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
