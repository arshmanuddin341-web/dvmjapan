"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface SeoPage {
  path: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
}

interface SeoData {
  pages: SeoPage[];
}

const defaultSeo: SeoData = {
  pages: [
    { path: "/", title: "Home", metaTitle: "DVM JAPAN - Premium Japanese Car Import Marketplace", metaDesc: "Import high-quality used Japanese vehicles." },
    { path: "/inventory", title: "Inventory", metaTitle: "Vehicle Inventory - Browse Japanese Cars", metaDesc: "Browse our extensive inventory." },
    { path: "/about", title: "About", metaTitle: "About Us - DVM JAPAN", metaDesc: "Your trusted partner for Japanese vehicle imports." },
  ],
};

export default function SEOPage() {
  const [data, setData] = useState<SeoData>(defaultSeo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api<{ data: SeoData }>("/api/content/seo")
      .then((res) => {
        const d = (res as { data?: SeoData }).data;
        if (d && Array.isArray(d.pages)) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/seo", { method: "PUT", body: JSON.stringify({ value: data }) });
      setMessage({ type: "success", text: "SEO settings saved!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (index: number, field: keyof SeoPage, value: string) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
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
        <h1 className="text-3xl font-bold text-gray-900">SEO Meta Management</h1>
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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Page</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Meta Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Meta Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.pages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.title}</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={page.metaTitle}
                      onChange={(e) => updatePage(index, "metaTitle", e.target.value)}
                      className="w-full max-w-md px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={page.metaDesc}
                      onChange={(e) => updatePage(index, "metaDesc", e.target.value)}
                      className="w-full max-w-md px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
