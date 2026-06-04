"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

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

const emptyPost: BlogPost = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "DVM JAPAN",
  publishedAt: new Date().toISOString().slice(0, 10),
  image: "",
  category: "Blog",
  tags: [],
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? "");
  const isNew = id === "new";

  const [post, setPost] = useState<BlogPost>(emptyPost);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setPost({ ...emptyPost, publishedAt: new Date().toISOString().slice(0, 10) });
      setLoading(false);
      return;
    }
    api<{ data: BlogPost[] }>("/api/content/blog")
      .then((res) => {
        const data = (res as { data?: BlogPost[] }).data;
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p) => p.id === id);
        if (found) setPost(found);
        else setError("Post not found.");
      })
      .catch(() => setError("Failed to load blog."))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleChange = (field: keyof BlogPost, value: string | string[]) => {
    setPost((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && (isNew || !post.slug)) {
      setPost((prev) => ({ ...prev, slug: slugify(String(value)) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api<{ data: BlogPost[] }>("/api/content/blog");
      const data = (res as { data?: BlogPost[] }).data;
      let list = Array.isArray(data) ? [...data] : [];

      const toSave: BlogPost = {
        ...post,
        id: isNew ? String(Date.now()) : post.id,
        slug: post.slug || slugify(post.title),
        tags: Array.isArray(post.tags) ? post.tags : String(post.tags).split(",").map((t) => t.trim()).filter(Boolean),
      };

      const idx = list.findIndex((p) => p.id === toSave.id);
      if (idx >= 0) list[idx] = toSave;
      else list = [toSave, ...list];

      await api("/api/content/blog", { method: "PUT", body: JSON.stringify({ value: list }) });
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const tagsStr = Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags as unknown as string) || "";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!isNew && error && !post.id) {
    return (
      <div className="space-y-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600">
          <ArrowLeft className="h-5 w-5" />
          Back to Blog
        </Link>
        <div className="card p-6 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600">
        <ArrowLeft className="h-5 w-5" />
        Back to Blog
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            value={post.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            className="input w-full min-h-[80px]"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
          <textarea
            value={post.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="input w-full min-h-[200px] font-mono text-sm"
            rows={12}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              value={post.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Published date</label>
            <input
              type="date"
              value={post.publishedAt}
              onChange={(e) => handleChange("publishedAt", e.target.value)}
              className="input w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            value={post.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="input w-full"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            value={post.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => handleChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            className="input w-full"
            placeholder="e.g. Japan, SUV, 2024"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isNew ? "Create" : "Save"}
          </button>
          <Link href="/admin/blog" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
