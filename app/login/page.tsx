"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useAuthContext } from "@/context/AuthContext";
import CarLogo from "@/components/ui/CarLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Social login failed. Please try again.",
  google_not_configured: "Google sign-in is not set up yet. Use email and password below.",
  facebook_not_configured: "Facebook sign-in is not set up yet. Use email and password below.",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    const verified = searchParams.get("verified");
    if (verified === "check-email") {
      setSuccessMsg("Registration successful! Please check your email to verify your account.");
      setError("");
      setInfoMsg("");
    } else if (err) {
      const msg = ERROR_MESSAGES[err] || "Something went wrong. Please try again.";
      const isConfigNote = err === "google_not_configured" || err === "facebook_not_configured";
      if (isConfigNote) {
        setInfoMsg(msg);
        setError("");
      } else {
        setError(msg);
        setInfoMsg("");
      }
      setSuccessMsg("");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.success) {
      setError(res.error || "Login failed");
      return;
    }
    if (res.role === "admin") {
      router.push(routes.admin);
    } else {
      router.push(routes.dashboard);
    }
    router.refresh();
  };

  return (
    <div className="relative z-10 min-h-screen bg-white py-16 pt-24 flex items-center">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <CarLogo />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-navy text-white mb-4">
              <LogIn className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold heading-section-mdk mb-2">Login</h1>
            <p className="text-slate-600">Sign in to your account to continue</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {successMsg && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  {successMsg}
                </div>
              )}
              {infoMsg && (
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-red-400 text-sm">
                  {infoMsg}
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link href="/contact?inquiry=forgot-password" className="text-sm text-teal-500 hover:text-red-400 transition-colors cursor-pointer">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing in…" : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Google/Facebook hidden until OAuth is set up in Google Console (see docs/GOOGLE_OAUTH_SETUP.md) */}
            {process.env.NEXT_PUBLIC_SHOW_GOOGLE_LOGIN === "true" && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`${API_URL}/api/auth/google`}
                    className="px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-sm font-semibold cursor-pointer text-center"
                  >
                    Google
                  </a>
                  <a
                    href={`${API_URL}/api/auth/facebook`}
                    className="px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-sm font-semibold cursor-pointer text-center"
                  >
                    Facebook
                  </a>
                </div>
              </>
            )}
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href={routes.register} className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-slate-500">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
