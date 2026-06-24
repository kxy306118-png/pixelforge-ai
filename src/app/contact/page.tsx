"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Send, Check, Clock, Shield, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [form, setForm] = useState({ name: session?.user?.name || "", email: session?.user?.email || "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ ok: false, message: "Server error" }));
      if (res.ok && data.ok !== false) {
        setResult({ ok: true, message: data.message || "Message sent successfully!" });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setResult({ ok: false, message: data.error || data.message || "Failed to send message." });
      }
    } catch {
      setResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">{t("contact.badge")}</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">{t("contact.title1")} <span className="gradient-text">{t("contact.title2")}</span>?</h1>
        <p className="mt-3 text-[#8888a0]">{t("contact.subtitle")}</p>
      </div>

      {/* Contact Methods */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-10">
        <div className="card text-center py-6">
          <Mail className="h-8 w-8 text-violet-400 mx-auto mb-3" />
          <h3 className="font-bold text-[#e8e8f0]">{t("contact.email_label")}</h3>
          <p className="text-sm text-[#8888a0] mt-1">1162093529@qq.com</p>
        </div>
        <div className="card text-center py-6">
          <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <h3 className="font-bold text-[#e8e8f0]">{t("contact.response_label")}</h3>
          <p className="text-sm text-[#8888a0] mt-1">{t("contact.response_value")}</p>
        </div>
        <div className="card text-center py-6">
          <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-bold text-[#e8e8f0]">{t("contact.security_label")}</h3>
          <p className="text-sm text-[#8888a0] mt-1">{t("contact.security_value")}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-lg font-bold text-[#e8e8f0] mb-6 flex items-center gap-2">
            <Headphones className="h-5 w-5 text-violet-400" /> {t("contact.form_title")}
          </h2>

          {result && (
            <div className={`mb-6 rounded-xl border-2 px-4 py-3 text-sm ${result.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
              {result.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#8888a0] mb-1.5">{t("contact.name_label")}</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8888a0] mb-1.5">{t("contact.email_field")}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" className="input-base" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8888a0] mb-1.5">{t("contact.subject_label")}</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-base">
                <option value="">{t("contact.subject_placeholder")}</option>
                <option value="billing">{t("contact.subject_billing")}</option>
                <option value="technical">{t("contact.subject_technical")}</option>
                <option value="feature">{t("contact.subject_feature")}</option>
                <option value="enterprise">{t("contact.subject_enterprise")}</option>
                <option value="other">{t("contact.subject_other")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8888a0] mb-1.5">{t("contact.message_label")}</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} placeholder={t("contact.message_placeholder")} className="input-base resize-y min-h-[120px]" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3">
              {loading ? t("contact.sending") : <><Send className="h-4 w-4" /> {t("contact.send")}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
