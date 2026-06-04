"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { BlogCardProps } from "./BlogCard";

export interface BlogListProps {
  posts: BlogCardProps[];
  columns?: 2 | 3;
  showPagination?: boolean;
}

export default function BlogList({
  posts,
  columns = 3,
  showPagination = false,
}: BlogListProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div>
      <div className={gridCols[columns] + " gap-6 mb-8"}>
        {posts.map((post, index) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>

      {showPagination && (
        <div className="flex items-center justify-center gap-2">
          {/* Pagination would go here */}
        </div>
      )}
    </div>
  );
}
