"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface FAQItem {
  question: string;
  answer: string;
}

export default function AdminFAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api<{ data: FAQItem[] }>("/api/content/faq")
      .then((res) => {
        const r = res as { data?: FAQItem[] };
        const data = r.data ?? (res as unknown as FAQItem[]);
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/faq", { method: "PUT", body: JSON.stringify({ value: items }) });
      setMessage({ type: "success", text: "FAQ saved!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => setItems([...items, { question: "", answer: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof FAQItem, val: string) => {
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
        <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
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
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateItem(i, "question", e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(i, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="button" onClick={() => removeItem(i)} className="p-2 text-teal-600 hover:bg-teal-50 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
