"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setToken } from "@/lib/api-client";
import { routes } from "@/config/routes";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    if (error) {
      router.replace(`/login?error=${error}`);
      return;
    }
    if (token) {
      setToken(token);
      router.replace(routes.dashboard);
      router.refresh();
    } else {
      router.replace(routes.login);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-950 to-dark-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mx-auto mb-4" />
        <p className="text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-950 to-dark-900">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
