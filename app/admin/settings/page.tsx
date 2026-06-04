"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface SiteConfig {
  name: string;
  description: string;
  contact: {
    phone: string;
    phoneUK: string;
    emails: string[];
    email: string;
    address: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  stats: {
    vehicles: string;
    customers: string;
    countries: string;
  };
}

const defaultConfig: SiteConfig = {
  name: "DVM JAPAN",
  description: "World's #1 Japanese Car Import Marketplace",
  contact: {
    phone: "+81 76-682-7377",
    phoneUK: "+44 7426 109211",
    emails: ["csd@dvmjapan.com"],
    email: "csd@dvmjapan.com",
    address: "Yokohama, Japan",
    whatsapp: "+447426109211",
  },
  social: {
    facebook: "https://facebook.com/DVM JAPAN",
    instagram: "https://instagram.com/DVM JAPAN",
    twitter: "https://twitter.com/DVM JAPAN",
    linkedin: "https://linkedin.com/company/DVM JAPAN",
  },
  stats: { vehicles: "50,000+", customers: "10,000+", countries: "50+" },
};

export default function SiteSettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadConfig = () => {
    setLoading(true);
    api<{ data: SiteConfig }>("/api/content/site_config")
      .then((res) => {
        const data = (res as { data?: SiteConfig }).data ?? (res as unknown as SiteConfig);
        setConfig(typeof data === "object" && "name" in data ? data : defaultConfig);
      })
      .catch(() => setConfig(defaultConfig))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSeed = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/seed", { method: "POST" });
      setMessage({ type: "success", text: "Defaults seeded. Reloading..." });
      loadConfig();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Seed failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api("/api/content/site_config", {
        method: "PUT",
        body: JSON.stringify({ value: config }),
      });
      setMessage({ type: "success", text: "Settings saved! Changes will reflect on the website." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save" });
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <div className="flex gap-2">
          <button onClick={handleSeed} disabled={saving} className="btn-secondary inline-flex items-center gap-2" title="Load default values if empty">
            Seed Defaults
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-teal-50 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={config.contact.phone}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
              <input
                type="email"
                value={config.contact.email}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UK Phone</label>
              <input
                type="text"
                value={config.contact.phoneUK}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, phoneUK: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emails (comma separated)</label>
              <input
                type="text"
                value={config.contact.emails.join(", ")}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: {
                      ...config.contact,
                      emails: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={config.contact.address}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, address: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={config.contact.whatsapp}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, whatsapp: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(["facebook", "instagram", "twitter", "linkedin"] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input
                  type="url"
                  value={config.social[key]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      social: { ...config.social, [key]: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats (Homepage)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicles</label>
              <input
                type="text"
                value={config.stats.vehicles}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stats: { ...config.stats, vehicles: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="50,000+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customers</label>
              <input
                type="text"
                value={config.stats.customers}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stats: { ...config.stats, customers: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="10,000+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Countries</label>
              <input
                type="text"
                value={config.stats.countries}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stats: { ...config.stats, countries: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="50+"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
