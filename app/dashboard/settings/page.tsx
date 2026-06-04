"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Globe, DollarSign, Moon, Sun, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    language: "en",
    currency: "USD",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings save logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 py-16 pt-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href={routes.dashboard}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Customize your account preferences</p>
          </motion.div>

          {/* Settings Form */}
          <motion.div
            className="card p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Appearance */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="h-5 w-5 text-cyan-500" />
                  <h2 className="text-xl font-black text-white">Appearance</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={settings.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="dark" className="bg-dark-900">Dark</option>
                    <option value="light" className="bg-dark-900">Light</option>
                    <option value="system" className="bg-dark-900">System</option>
                  </select>
                </div>
              </div>

              {/* Localization */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-cyan-500" />
                  <h2 className="text-xl font-black text-white">Localization</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                      Language
                    </label>
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="en" className="bg-dark-900">English</option>
                      <option value="es" className="bg-dark-900">Spanish</option>
                      <option value="fr" className="bg-dark-900">French</option>
                      <option value="de" className="bg-dark-900">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                      Currency
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <select
                        name="currency"
                        value={settings.currency}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="USD" className="bg-dark-900">USD</option>
                        <option value="EUR" className="bg-dark-900">EUR</option>
                        <option value="GBP" className="bg-dark-900">GBP</option>
                        <option value="JPY" className="bg-dark-900">JPY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-5 w-5 text-cyan-500" />
                  <h2 className="text-xl font-black text-white">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-white font-semibold mb-1">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive updates via email</div>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-white font-semibold mb-1">SMS Notifications</div>
                      <div className="text-sm text-gray-400">Receive updates via SMS</div>
                    </div>
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={settings.smsNotifications}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-white font-semibold mb-1">Push Notifications</div>
                      <div className="text-sm text-gray-400">Receive browser push notifications</div>
                    </div>
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={settings.pushNotifications}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary w-full inline-flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
