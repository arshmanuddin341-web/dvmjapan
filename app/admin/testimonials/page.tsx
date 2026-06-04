"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api<{ data: Testimonial[] }>("/api/content/testimonials")
      .then((res) => {
        const r = res as { data?: Testimonial[] };
        const data = r.data ?? (res as unknown as Testimonial[]);
        if (Array.isArray(data)) setItems(data);
        else setItems([]);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/testimonials", { method: "PUT", body: JSON.stringify({ value: items }) });
      setMessage({ type: "success", text: "Testimonials saved!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => setItems([...items, { name: "", role: "", text: "", rating: 5 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Testimonial, val: string | number) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    setItems(next);
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
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
        <div className="flex gap-2">
          <button onClick={addItem} className="btn-secondary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-teal-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="card p-6 flex gap-4">
            <div className="flex-1 grid md:grid-cols-2 gap-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder="Name"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={item.role}
                onChange={(e) => updateItem(i, "role", e.target.value)}
                placeholder="Role / Title"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={item.text}
                onChange={(e) => updateItem(i, "text", e.target.value)}
                placeholder="Testimonial text"
                rows={2}
                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                min={1}
                max={5}
                value={item.rating}
                onChange={(e) => updateItem(i, "rating", parseInt(e.target.value, 10) || 5)}
                placeholder="Rating 1-5"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button onClick={() => removeItem(i)} className="p-2 text-teal-600 hover:bg-teal-50 rounded self-start">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
