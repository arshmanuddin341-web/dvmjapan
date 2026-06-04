"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useAuthContext } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setSubmitting(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
    });
    setSubmitting(false);
    if (!res.success) {
      let msg = res.error || "Registration failed";
      if (msg.toLowerCase().includes("server") || msg.toLowerCase().includes("not responding") || msg.toLowerCase().includes("port 5000")) {
        msg += " Run: npm run dev:all (to start backend + frontend together)";
      }
      setError(msg);
      return;
    }
    if (res.requiresVerification) {
      setError("");
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      router.push("/login?verified=check-email");
      router.refresh();
      return;
    }
    router.push(routes.dashboard);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white py-16 pt-24 flex items-center">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={routes.home} className="inline-block mb-4">
              <Image
                src="/DVM JAPAN-groups-logo-transparent.png"
                alt="DVM JAPAN"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-navy text-white mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold heading-section-mdk mb-2">Register</h1>
            <p className="text-slate-600">Sign up to start importing your dream vehicle</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                    className="w-4 h-4 mt-1 rounded border-white/20 bg-white/5 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-400">
                    I agree to the{" "}
                    <Link href={routes.terms} className="text-teal-500 hover:text-red-400">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href={routes.privacy} className="text-teal-600 hover:text-teal-700">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !acceptTerms}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating account…" : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>

          {/* Sign In Link */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link href={routes.login} className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
