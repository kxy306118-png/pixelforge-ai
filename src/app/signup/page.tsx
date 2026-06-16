"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Check, Mail, Lock, User, ArrowRight } from "lucide-react";

const benefits = [
  "3 free AI tasks every day",
  "Unlimited basic tools (compress, convert, resize)",
  "No credit card required",
  "Access all 16 tools",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      // Auto sign in after registration
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: string) => {
    setError("OAuth login requires server configuration. For demo, please use email/password.");
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-6">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-[#e8e8f0]">Account Created!</h1>
        <p className="mt-3 text-[#8888a0]">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <h1 className="text-3xl font-black text-[#e8e8f0] leading-tight">
            Start creating with <span className="gradient-text">PixelForge AI</span>
          </h1>
          <p className="mt-4 text-[#8888a0] leading-relaxed">Join thousands of creators using AI-powered tools.</p>
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
          <h2 className="text-xl font-bold text-[#e8e8f0] mb-6">Create your account</h2>
          {error && <div className="mb-4 rounded-lg border-2 border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#8888a0] mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="input-base icon-left" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#8888a0] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-base icon-left" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#8888a0] mb-1.5">Password (min 8 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555570]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" className="input-base icon-left" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Creating account..." : <>Sign up free <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2a2a45]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[#12121e] px-2 text-[#555570]">or continue with</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleOAuth("google")} className="btn-secondary text-sm justify-center">🔵 Google</button>
            <button onClick={() => handleOAuth("github")} className="btn-secondary text-sm justify-center">⚫ GitHub</button>
          </div>
          <p className="mt-6 text-center text-sm text-[#8888a0]">
            Already have an account? <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
