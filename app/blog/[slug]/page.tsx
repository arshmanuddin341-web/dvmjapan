"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogPostBySlug } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowLeft, Tag, ArrowRight, Share2 } from "lucide-react";
import { sectionReveal } from "@/lib/animations";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { routes } from "@/config/routes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Post = { id: string; slug: string; title: string; excerpt: string; content: string; author: string; publishedAt: string; image: string; category: string; tags: string[] };

export default function BlogPostPage() {
  const params = useParams();
  const slug = String(params?.slug ?? "");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    fetch("/api/content/blog")
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data;
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p: Post) => p.slug === slug);
        setPost(found ?? getBlogPostBySlug(slug) ?? null);
      })
      .catch(() => setPost(getBlogPostBySlug(slug) ?? null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (typeof window === "undefined" || !post) return () => {};
    const ctx = gsap.context(() => {
      if (headerRef.current) sectionReveal(headerRef.current, { y: 20, delay: 0.2 });
      if (imageRef.current) sectionReveal(imageRef.current, { y: 20, delay: 0.3 });
      if (contentRef.current) sectionReveal(contentRef.current, { y: 30, delay: 0.4 });
    });
    return () => ctx.revert();
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <ScrollReveal delay={0.1}>
            <Link
              href={routes.blog}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-gold-400 mb-8 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </ScrollReveal>

          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <span className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-xs font-bold border border-gold-500/30">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              {post.title}
            </h1>
          </div>

          {/* Featured Image */}
          <div ref={imageRef} className="relative h-96 bg-dark-800 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={`${post.title} - Featured image`}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 80vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/50 to-transparent" />
          </div>

          {/* Content */}
          <article ref={contentRef} className="prose prose-lg max-w-none mb-12">
            <div 
              className="text-gray-300 leading-relaxed space-y-6 text-lg prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-cyan-400"
              dangerouslySetInnerHTML={{ 
                __html: post.content 
                  ? post.content.split('\n').map((para, i) => {
                      if (para.startsWith('# ')) {
                        return `<h1 class="text-3xl font-black text-white mb-4 mt-8">${para.substring(2)}</h1>`;
                      } else if (para.startsWith('## ')) {
                        return `<h2 class="text-2xl font-black text-white mb-3 mt-6">${para.substring(3)}</h2>`;
                      } else if (para.startsWith('### ')) {
                        return `<h3 class="text-xl font-bold text-white mb-2 mt-4">${para.substring(4)}</h3>`;
                      } else if (para.trim() === '') {
                        return '<br />';
                      } else {
                        return `<p class="mb-4">${para}</p>`;
                      }
                    }).join('')
                  : `<p class="text-xl text-gray-200 font-semibold mb-6">${post.excerpt}</p>`
              }}
            />
          </article>

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <ScrollReveal delay={0.5}>
              <div className="flex flex-wrap items-center gap-3 mb-12">
              <Tag className="h-5 w-5 text-gray-400" />
              {post.tags.map((tag) => (
                <motion.span
                  key={tag}
                  className="px-4 py-2 bg-dark-800 text-gray-300 rounded-full text-sm font-semibold"
                  whileHover={{ scale: 1.1, backgroundColor: "#fbbf24", color: "#020617" }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </ScrollReveal>
          )}

          {/* Share & CTA */}
          <motion.div
            className="card p-8 bg-gradient-to-r from-gold-500/10 to-blue-500/10 border-2 border-gold-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Found this helpful?</h3>
                <p className="text-gray-300">Share with others who might benefit</p>
              </div>
              <div className="flex gap-4">
                <motion.button
                  className="p-3 rounded-lg bg-dark-800 text-white hover:bg-gold-500 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={routes.contact} className="btn-primary inline-flex items-center gap-2">
                    Get Help
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
