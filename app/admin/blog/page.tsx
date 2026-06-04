"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { blogPosts as defaultPosts } from "@/data/blog";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadBlog = () => {
    setLoading(true);
    api<{ data: BlogPost[] }>("/api/content/blog")
      .then((res) => {
        const d = (res as { data?: BlogPost[] }).data;
        setPosts(Array.isArray(d) ? d : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlog();
  }, []);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    setMessage(null);
    try {
      await api("/api/content/blog", {
        method: "PUT",
        body: JSON.stringify({ value: defaultPosts }),
      });
      setMessage({ type: "success", text: "Blog seeded from defaults." });
      loadBlog();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Seed failed" });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <div className="flex items-center gap-2">
          {posts.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="btn-secondary inline-flex items-center gap-2"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Seed from defaults
            </button>
          )}
          <Link href="/admin/blog/edit/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Post
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-teal-50 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No blog posts yet. Click &quot;Seed from defaults&quot; to load sample posts, or &quot;New Post&quot; to add one.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.publishedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="p-2 text-gray-600 hover:text-teal-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
