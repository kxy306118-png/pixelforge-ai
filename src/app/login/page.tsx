"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight } from "lucide-react";

function LoginPageInner() {
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
      } else {
        router.replace(callbackUrl);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-[#e8e8f0]">Welcome back</h1>
        <p className="mt-2 text-sm text-[#8888a0]">Sign in to your PixelForge account</p>
      </div>
      <div className="card">
        {error && <div className="mb-4 rounded-lg border-2 border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8888a0] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-base icon-left" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm text-[#8888a0]">Password</label>
              <Link href="/forgot-password" className="text-xs text-violet-400 cursor-pointer hover:text-violet-300">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className="input-base icon-left" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Signing in..." : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2a2a45]" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#12121e] px-2 text-[#555570]">or</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setError("Google OAuth requires server setup. Use email/password for now.")} className="btn-secondary text-sm justify-center">🔵 Google</button>
          <button onClick={() => setError("GitHub OAuth requires server setup. Use email/password for now.")} className="btn-secondary text-sm justify-center">⚫ GitHub</button>
        </div>
        <p className="mt-6 text-center text-sm text-[#8888a0]">
          Don&apos;t have an account? <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium">Sign up free</Link>
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
