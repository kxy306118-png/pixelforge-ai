"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Zap, History, CreditCard, Settings, BarChart3, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface DashboardData {
  user: { name: string; email: string; plan: string; role: string };
  credits: { used: number; limit: number; remaining: number };
  recentUsages: { id: string; toolName: string; status: string; createdAt: string }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login?callbackUrl=/dashboard"); return; }
    if (status === "authenticated") {
      fetch("/api/user/usage")
        .then((r) => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
        .then((d) => setData(d))
        .catch(() => {
          setData({
            user: { name: session?.user?.name || "User", email: session?.user?.email || "", plan: (session?.user as any)?.plan || "free", role: (session?.user as any)?.role || "user" },
            credits: { used: 0, limit: 10, remaining: 10 },
            recentUsages: [],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-center text-[#8888a0]">{t("dashboard.loading")}</div>;
  }

  if (!session || !data) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-center text-[#8888a0]">{t("dashboard.sign_in")}</div>;
  }

  const planNames: Record<string, string> = { free: "Free", starter: "Starter", pro: "Pro", unlimited: "Unlimited" };
  const pct = data.credits.limit > 0 ? Math.round((data.credits.used / data.credits.limit) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#e8e8f0]">{t("dashboard.welcome")}{data.user.name}!</h1>
          <p className="text-[#8888a0] mt-1">{data.user.email}</p>
        </div>
        <div className="flex gap-2">
          {data.user.role === "admin" && (
            <Link href="/admin" className="btn-secondary text-sm">⚙️ Admin Panel</Link>
          )}
          <Link href="/pricing" className="btn-primary text-sm">{t("dashboard.upgrade")}</Link>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Zap className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-[#8888a0]">{t("dashboard.credits_used")}</p>
              <p className="text-2xl font-black text-[#e8e8f0]">{data.credits.used} <span className="text-sm font-normal text-[#8888a0]">/ {data.credits.limit === 9999 ? "∞" : data.credits.limit}</span></p>
            </div>
          </div>
          <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <p className="text-xs text-[#8888a0] mt-2">{data.credits.remaining === 9999 ? "Unlimited" : t("dashboard.remaining_today").replace("{n}", String(data.credits.remaining))}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-[#8888a0]">{t("dashboard.current_plan")}</p>
              <p className="text-xl font-black text-[#e8e8f0]">{planNames[data.user.plan] || "Free"}</p>
            </div>
          </div>
          <Link href="/pricing" className="text-xs text-violet-400 hover:text-violet-300 font-medium">{t("dashboard.change_plan")}</Link>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[#8888a0]">{t("dashboard.recent_tasks")}</p>
              <p className="text-xl font-black text-[#e8e8f0]">{data.recentUsages.length}</p>
            </div>
          </div>
          <Link href="/tools" className="text-xs text-violet-400 hover:text-violet-300 font-medium">{t("dashboard.use_tools")}</Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#e8e8f0] mb-4">{t("dashboard.quick_access")}</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[
            { name: "Remove BG", href: "/tools/remove-bg", emoji: "✂️" },
            { name: "Upscale", href: "/tools/upscale", emoji: "🔍" },
            { name: "AI Generate", href: "/tools/ai-image-gen", emoji: "🎨" },
            { name: "Speech to Text", href: "/tools/speech-to-text", emoji: "🎤" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="card flex items-center gap-3 hover:border-violet-500/30 text-sm py-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="font-medium text-[#e8e8f0]">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#e8e8f0] mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-[#8888a0]" /> {t("dashboard.recent_activity")}
        </h2>
        {data.recentUsages.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-[#8888a0]">{t("dashboard.no_activity")}</p>
            <Link href="/tools" className="btn-primary mt-4 inline-flex text-sm">{t("dashboard.start_using")} <ArrowRight className="h-4 w-4 ml-1" /></Link>
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
