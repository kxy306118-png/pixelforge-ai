"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Zap, History, CreditCard, Settings, BarChart3, ArrowRight } from "lucide-react";

interface DashboardData {
  user: { name: string; email: string; plan: string; role: string };
  credits: { used: number; limit: number; remaining: number };
  recentUsages: { id: string; toolName: string; status: string; createdAt: string }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      fetch("/api/user/usage")
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-center text-[#8888a0]">Loading...</div>;
  }

  if (!session || !data) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-center text-[#8888a0]">Please sign in.</div>;
  }

  const planNames: Record<string, string> = { free: "Free", starter: "Starter", pro: "Pro", unlimited: "Unlimited" };
  const pct = data.credits.limit > 0 ? Math.round((data.credits.used / data.credits.limit) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#e8e8f0]">Welcome, {data.user.name}!</h1>
          <p className="text-[#8888a0] mt-1">{data.user.email}</p>
        </div>
        <div className="flex gap-2">
          {data.user.role === "admin" && (
            <Link href="/admin" className="btn-secondary text-sm">⚙️ Admin Panel</Link>
          )}
          <Link href="/pricing" className="btn-primary text-sm">Upgrade Plan</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Zap className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-[#8888a0]">Credits Used</p>
              <p className="text-2xl font-black text-[#e8e8f0]">{data.credits.used} <span className="text-sm font-normal text-[#8888a0]">/ {data.credits.limit === 9999 ? "∞" : data.credits.limit}</span></p>
            </div>
          </div>
          <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <p className="text-xs text-[#8888a0] mt-2">{data.credits.remaining === 9999 ? "Unlimited" : `${data.credits.remaining} remaining today`}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-[#8888a0]">Current Plan</p>
              <p className="text-xl font-black text-[#e8e8f0]">{planNames[data.user.plan] || "Free"}</p>
            </div>
          </div>
          <Link href="/pricing" className="text-xs text-violet-400 hover:text-violet-300 font-medium">Change plan →</Link>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[#8888a0]">Recent Tasks</p>
              <p className="text-xl font-black text-[#e8e8f0]">{data.recentUsages.length}</p>
            </div>
          </div>
          <Link href="/tools" className="text-xs text-violet-400 hover:text-violet-300 font-medium">Use tools →</Link>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#e8e8f0] mb-4">Quick Access</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[
            { name: "Remove BG", href: "/tools/remove-bg", emoji: "✂️" },
            { name: "Upscale", href: "/tools/upscale", emoji: "🔍" },
            { name: "AI Generate", href: "/tools/ai-image-gen", emoji: "🎨" },
            { name: "Speech to Text", href: "/tools/speech-to-text", emoji: "🎤" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="card flex items-center gap-3 hover:border-violet-500/30 text-sm py-3">
              <span className="text-lg">{t.emoji}</span>
              <span className="font-medium text-[#e8e8f0]">{t.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h2 className="text-lg font-bold text-[#e8e8f0] mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-[#8888a0]" /> Recent Activity
        </h2>
        {data.recentUsages.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-[#8888a0]">No activity yet.</p>
            <Link href="/tools" className="btn-primary mt-4 inline-flex text-sm">Start Using Tools <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a45] bg-[#0e0e1a]">
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Tool</th>
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Status</th>
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsages.map((u) => (
                  <tr key={u.id} className="border-b border-[#1e1e30]">
                    <td className="p-3 text-[#e8e8f0] font-medium">{u.toolName}</td>
                    <td className="p-3"><span className={u.status === "success" ? "text-emerald-400" : "text-red-400"}>{u.status}</span></td>
                    <td className="p-3 text-[#8888a0]">{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
