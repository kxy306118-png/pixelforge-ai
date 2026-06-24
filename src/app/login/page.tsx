"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function LoginPageInner() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  // Security: only allow relative URLs to prevent open redirect attacks
  const callbackUrl = rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//") ? rawCallbackUrl : "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else if (result?.ok) {
        // Session set successfully — do a full page redirect
        window.location.href = callbackUrl;
      } else {
        // Unexpected state — try full redirect as fallback
        window.location.href = callbackUrl;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-[#e8e8f0]">{t("auth.signin_title")}</h1>
        <p className="mt-2 text-sm text-[#8888a0]">{t("auth.signin_subtitle")}</p>
      </div>
      <div className="card">
        {error && <div className="mb-4 rounded-lg border-2 border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8888a0] mb-1.5">{t("auth.email_label")}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-base icon-left" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm text-[#8888a0]">{t("auth.password_label").replace(" (min 8 characters)", "")}</label>
              <Link href="/forgot-password" className="text-xs text-violet-400 cursor-pointer hover:text-violet-300">{t("auth.forgot")}</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="input-base icon-left" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? t("auth.signing_in") : <>{t("auth.signin_btn")} <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2a2a45]" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#12121e] px-2 text-[#555570]">or</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-secondary text-sm justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })} className="btn-secondary text-sm justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-[#8888a0]">
          {t("auth.no_account")} <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium">{t("auth.signup_btn")}</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-5 py-20 text-center text-[#8888a0]">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
