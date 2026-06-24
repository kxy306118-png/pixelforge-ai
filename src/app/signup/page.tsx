"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Check, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SignupPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const benefits = [t("benefit.1"), t("benefit.2"), t("benefit.3"), t("benefit.4")];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1: Register account
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Step 2: Wait for DB write to propagate
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Auto sign-in with full redirect (same as Google/GitHub flow)
      // This ensures the session cookie is properly set by the server
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 1200));
      signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-6">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-[#e8e8f0]">{t("auth.created")}</h1>
        <p className="mt-3 text-[#8888a0]">{t("auth.redirecting")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <h1 className="text-3xl font-black text-[#e8e8f0] leading-tight">
            {t("auth.signup_subtitle")} <span className="gradient-text">PixelForge AI</span>
          </h1>
          <p className="mt-4 text-[#8888a0] leading-relaxed">{t("auth.signup_desc")}</p>
          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20">
                  <Check className="h-3.5 w-3.5 text-violet-400" />
                </div>
                <span className="text-[#c8c8d8] text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-[#e8e8f0] mb-6">{t("auth.signup_title")}</h2>
          {error && <div className="mb-4 rounded-lg border-2 border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#8888a0] mb-1.5">{t("auth.name_label")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="input-base icon-left" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#8888a0] mb-1.5">{t("auth.email_label")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-base icon-left" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#8888a0] mb-1.5">{t("auth.password_label")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" className="input-base icon-left" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? t("auth.creating") : <>{t("auth.signup_btn")} <ArrowRight className="h-4 w-4" /></>}
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
            {t("auth.have_account")} <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">{t("nav.signin")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
