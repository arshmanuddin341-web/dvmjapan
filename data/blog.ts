import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "how-to-buy-from-japan-auctions",
    title: "How to Buy Cars Directly from Japanese Auctions",
    excerpt: "A comprehensive guide on searching, bidding, and winning your dream car from Japan's largest auction houses.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    author: "DVM Japan Expert",
    publishedAt: "2024-05-15",
    category: "Guides",
    content: "Detailed content about auctions...",
    tags: ["Auction", "Import Guide"]
  },
  {
    id: "2",
    slug: "top-5-reliable-japanese-suvs",
    title: "Top 5 Most Reliable Japanese SUVs for Export",
    excerpt: "Looking for durability? Check out our top picks for SUVs that perform exceptionally well in all climates.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    author: "Sales Team",
    publishedAt: "2024-05-20",
    category: "Reviews",
    content: "Detailed content about SUVs...",
    tags: ["SUV", "Reliability"]
  }
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}
