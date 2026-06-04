"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { routes } from "@/config/routes";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  category?: string;
  readingTime?: number;
  featured?: boolean;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  image,
  author,
  publishedAt,
  category,
  readingTime,
  featured = false,
}: BlogCardProps) {
  return (
    <motion.article
      className="card card-cinematic p-0 overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-dark-800">
        <Image
          src={image}
          alt={`${title} - Blog article featured image`}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <Badge variant="info">Featured</Badge>
          </div>
        )}
        {category && (
          <div className="absolute top-4 right-4">
            <Badge variant="default">{category}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
          {readingTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors leading-snug">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-500 text-xs mb-3 line-clamp-3">{excerpt}</p>

        {/* Link */}
        <Link
          href={routes.blogPost(slug)}
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          Read More
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
