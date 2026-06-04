"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

const defaultHero: HeroContent = {
  eyebrow: "Premium Japanese Imports",
  title: "Drive Your Dream Car Home",
  subtitle: "From Japan's finest auctions to your driveway. Quality-checked, hassle-free.",
  ctaPrimary: "Browse Inventory",
  ctaSecondary: "How It Works",
};

export default function PageContentPage() {
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api<{ data: HeroContent }>("/api/content/hero")
      .then((res) => {
        const r = res as { data?: HeroContent };
        const data = r.data ?? (res as unknown as HeroContent);
        if (typeof data === "object" && data && "title" in data) setHero(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/hero", {
        method: "PUT",
        body: JSON.stringify({ value: hero }),
      });
      setMessage({ type: "success", text: "Content saved!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Page Content</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-teal-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Homepage Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow Text</label>
            <input type="text" value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
            <input type="text" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
              <input type="text" value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
              <input type="text" value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
