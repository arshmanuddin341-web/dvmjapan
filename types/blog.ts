/**
 * BLOG TYPE DEFINITIONS
 * TypeScript types for blog-related data structures
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  featuredImage: string;
  images?: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  seo?: BlogSEO;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export interface BlogFilter {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  featured?: boolean;
}

export interface BlogSortOption {
  field: 'publishedAt' | 'views' | 'likes' | 'title';
  direction: 'asc' | 'desc';
}

export interface BlogSearchParams {
  query?: string;
  filters?: BlogFilter;
  sort?: BlogSortOption;
  page?: number;
  pageSize?: number;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: BlogCategory[];
  tags: BlogTag[];
}
