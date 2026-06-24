"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Users, BarChart3, MessageSquare, DollarSign, TrendingUp, AlertCircle, Mail, Shield } from "lucide-react";

interface ContactMsg { id: string; name: string; email: string; subject: string; message: string; reply: string | null; repliedAt: string | null; status: string; createdAt: string }

interface AdminData {
  stats: { totalUsers: number; totalUsages: number; openContacts: number };
  planDistribution: { plan: string; _count: number }[];
  toolUsage: { toolName: string; _count: number }[];
  recentUsers: { id: string; name: string; email: string; plan: string; createdAt: string }[];
  recentContacts: ContactMsg[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "users" | "contacts">("overview");
  const [selectedMsg, setSelectedMsg] = useState<ContactMsg | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login?callbackUrl=/admin"); return; }
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") { router.push("/dashboard"); return; }
      fetch("/api/admin/stats")
        .then((r) => { if (!r.ok) throw new Error("Forbidden"); return r.json(); })
        .then((d) => setData(d))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  if (loading) return <div className="mx-auto max-w-6xl px-5 py-20 text-center text-[#8888a0]">Loading admin panel...</div>;
  if (!data) return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h1 className="text-xl font-black text-[#e8e8f0] mb-2">Access Denied</h1>
      <p className="text-[#8888a0] mb-4">You need admin privileges to access this page.</p>
      <p className="text-sm text-[#555570]">To set up admin access, register an account and set <code className="text-violet-400">role=&quot;admin&quot;</code> in the database for your user.</p>
    </div>
  );

  const planPrices: Record<string, number> = { starter: 4.99, pro: 9.99, unlimited: 19.99 };
  let mrr = 0;
  data.planDistribution.forEach((p) => { mrr += (planPrices[p.plan] || 0) * p._count; });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#e8e8f0]">Admin Panel</h1>
          <p className="text-[#8888a0] mt-1">Manage your PixelForge platform · <span className="text-violet-400">/admin</span></p>
        </div>
        <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-400">ADMIN</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-[#2a2a45]">
        {(["overview", "users", "contacts"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setSelectedMsg(null); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? "text-violet-400 border-violet-400" : "text-[#8888a0] border-transparent hover:text-[#e8e8f0]"}`}>
            {t === "overview" ? "📊 Overview" : t === "users" ? "👥 Users" : "💬 Messages"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="card">
              <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-violet-400" /><span className="text-xs text-[#8888a0]">Total Users</span></div>
              <p className="text-3xl font-black text-[#e8e8f0]">{data.stats.totalUsers}</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-2"><BarChart3 className="h-4 w-4 text-blue-400" /><span className="text-xs text-[#8888a0]">Total AI Tasks</span></div>
              <p className="text-3xl font-black text-[#e8e8f0]">{data.stats.totalUsages}</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-emerald-400" /><span className="text-xs text-[#8888a0]">Est. Monthly Revenue</span></div>
              <p className="text-3xl font-black text-emerald-400">${mrr.toFixed(2)}</p>
              <p className="text-xs text-[#555570] mt-1">Based on {data.planDistribution.reduce((a, p) => a + p._count, 0)} paid users</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-4 w-4 text-orange-400" /><span className="text-xs text-[#8888a0]">Unread Messages</span></div>
              <p className="text-3xl font-black text-orange-400">{data.stats.openContacts}</p>
              <button onClick={() => setTab("contacts")} className="text-xs text-violet-400 hover:text-violet-300 mt-1">View all →</button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-8">
            <div className="card">
              <h3 className="text-sm font-bold text-[#e8e8f0] mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-violet-400" /> Plan Distribution</h3>
              <div className="space-y-3">
                {data.planDistribution.map((p) => {
                  const pct = data.stats.totalUsers > 0 ? Math.round((p._count / data.stats.totalUsers) * 100) : 0;
                  return (
                    <div key={p.plan}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#8888a0] capitalize">{p.plan}</span>
                        <span className="text-[#e8e8f0] font-medium">{p._count} users ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {data.planDistribution.length === 0 && <p className="text-sm text-[#555570]">No users yet</p>}
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-bold text-[#e8e8f0] mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-400" /> Tool Usage (Top 8)</h3>
              <div className="space-y-2">
                {data.toolUsage.slice(0, 8).map((t, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#8888a0]">{t.toolName}</span>
                    <span className="text-[#e8e8f0] font-medium">{t._count} uses</span>
                  </div>
                ))}
                {data.toolUsage.length === 0 && <p className="text-sm text-[#555570]">No usage data yet</p>}
              </div>
            </div>
          </div>

          {/* Recent Messages Preview */}
          {data.recentContacts.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[#e8e8f0] flex items-center gap-2"><Mail className="h-4 w-4 text-orange-400" /> Recent Messages</h3>
                <button onClick={() => setTab("contacts")} className="text-xs text-violet-400 hover:text-violet-300">View all →</button>
              </div>
              <div className="space-y-2">
                {data.recentContacts.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.status === "open" ? "bg-orange-400" : "bg-emerald-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e8e8f0] font-medium truncate">{c.subject}</p>
                      <p className="text-xs text-[#8888a0]">{c.name} · {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-[#2a2a45] flex justify-between items-center">
            <h3 className="font-bold text-[#e8e8f0]">All Users ({data.stats.totalUsers})</h3>
            <span className="text-xs text-[#8888a0]">Showing recent 10</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a45] bg-[#0e0e1a]">
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Name</th>
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Email</th>
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Plan</th>
                  <th className="text-left p-3 text-[#8888a0] font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#1e1e30] hover:bg-white/[0.02]">
                    <td className="p-3 text-[#e8e8f0] font-medium">{u.name}</td>
                    <td className="p-3 text-[#8888a0]">{u.email}</td>
                    <td className="p-3"><span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-bold text-violet-400 capitalize">{u.plan}</span></td>
                    <td className="p-3 text-[#8888a0]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {data.recentUsers.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-[#555570]">No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {tab === "contacts" && (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Message List */}
          <div className="card p-0 overflow-hidden lg:col-span-1">
            <div className="p-3 border-b border-[#2a2a45]">
              <h3 className="font-bold text-[#e8e8f0] text-sm">Inbox ({data.recentContacts.length})</h3>
              <p className="text-xs text-[#8888a0]">{data.stats.openContacts} unread</p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {data.recentContacts.map((c) => (
                <button key={c.id} onClick={() => setSelectedMsg(c)} className={`w-full text-left p-3 border-b border-[#1e1e30] hover:bg-white/5 transition-colors ${selectedMsg?.id === c.id ? "bg-violet-500/10 border-l-2 border-l-violet-500" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.status === "open" ? "bg-orange-400" : "bg-emerald-400"}`} />
                    <span className="text-sm text-[#e8e8f0] font-medium truncate">{c.name}</span>
                  </div>
                  <p className="text-xs text-[#e8e8f0] font-medium truncate">{c.subject}</p>
                  <p className="text-xs text-[#555570] mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                </button>
              ))}
              {data.recentContacts.length === 0 && (
                <p className="p-6 text-center text-[#555570] text-sm">No messages yet</p>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="card lg:col-span-2">
            {selectedMsg ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#e8e8f0]">{selectedMsg.subject}</h3>
                    <p className="text-sm text-[#8888a0]">From: {selectedMsg.name} ({selectedMsg.email})</p>
                    <p className="text-xs text-[#555570]">{new Date(selectedMsg.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedMsg.status === "open" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                    {selectedMsg.status === "open" ? "Unread" : selectedMsg.status === "replied" ? "Replied" : "Read"}
                  </span>
                </div>
                <div className="border-t border-[#2a2a45] pt-4">
                  <p className="text-sm text-[#c8c8d8] leading-relaxed whitespace-pre-line">{selectedMsg.message}</p>
                </div>

                {/* Show existing reply if any */}
                {selectedMsg.reply && (
                  <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <p className="text-xs font-bold text-emerald-400 mb-2">✅ Your Reply {selectedMsg.repliedAt ? `· ${new Date(selectedMsg.repliedAt).toLocaleString()}` : ""}</p>
                    <p className="text-sm text-[#c8c8d8] leading-relaxed whitespace-pre-line">{selectedMsg.reply}</p>
                  </div>
                )}

                <div className="mt-6">
                  {/* Reply Form */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#8888a0] mb-2">Reply to {selectedMsg.name}</label>
                    <textarea
                      id="replyText"
                      rows={4}
                      className="input-base resize-y min-h-[100px] mb-3"
                      placeholder="Type your reply here..."
                    />
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={async () => {
                          const textarea = document.getElementById("replyText") as HTMLTextAreaElement;
                          const replyMessage = textarea?.value?.trim();
                          if (!replyMessage) return alert("Please enter a reply message.");
                          try {
                            const res = await fetch("/api/admin/reply", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ contactId: selectedMsg.id, replyMessage }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              alert(data.warning || data.message || "Reply sent!");
                              textarea.value = "";
                              // Update status visually
                              selectedMsg.status = "replied";
                              setSelectedMsg({ ...selectedMsg });
                            } else {
                              alert(data.error || "Failed to send reply.");
                            }
                          } catch {
                            alert("Network error. Please try again.");
                          }
                        }}
                        className="btn-primary text-sm"
                      >
                        <Mail className="h-4 w-4" /> Send Reply
                      </button>
                      <a
                        href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                        className="btn-secondary text-sm"
                      >
                        Open in Email Client
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-[#555570]">
                <MessageSquare className="h-12 w-12 mb-3" />
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
