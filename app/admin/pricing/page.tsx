"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface PricingRule {
  id: string;
  name: string;
  amount: string;
  type: string;
}

interface PricingData {
  rules: PricingRule[];
  notes: string;
}

const defaultPricing: PricingData = {
  rules: [
    { id: "1", name: "Base Shipping Cost - Africa", amount: "$2,700", type: "Shipping" },
    { id: "2", name: "Base Shipping Cost - Middle East", amount: "$2,200", type: "Shipping" },
    { id: "3", name: "Insurance Rate", amount: "2%", type: "Insurance" },
    { id: "4", name: "Documentation Fee", amount: "$300", type: "Service" },
  ],
  notes: "Vehicle prices are set individually based on auction purchase price, market value, and condition. Shipping costs vary by destination and vehicle size. Contact the team for custom pricing requests.",
};

export default function PricingPage() {
  const [data, setData] = useState<PricingData>(defaultPricing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api<{ data: PricingData }>("/api/content/pricing")
      .then((res) => {
        const d = (res as { data?: PricingData }).data;
        if (d && Array.isArray(d.rules)) setData({ rules: d.rules, notes: d.notes ?? defaultPricing.notes });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/pricing", { method: "PUT", body: JSON.stringify({ value: data }) });
      setMessage({ type: "success", text: "Pricing saved!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const updateRule = (index: number, field: keyof PricingRule, value: string) => {
    setData((prev) => ({
      ...prev,
      rules: prev.rules.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
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
        <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping & Service Fees</h2>
        <div className="space-y-4">
          {data.rules.map((rule, index) => (
            <div key={rule.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) => updateRule(index, "name", e.target.value)}
                  className="w-full font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={rule.type}
                  onChange={(e) => updateRule(index, "type", e.target.value)}
                  className="w-full text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 mt-1"
                />
              </div>
              <input
                type="text"
                value={rule.amount}
                onChange={(e) => updateRule(index, "amount", e.target.value)}
                className="text-lg font-bold text-gray-900 border border-gray-300 rounded px-2 py-1 w-32"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing Notes</h2>
        <textarea
          value={data.notes}
          onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
        />
      </div>
    </div>
  );
}
