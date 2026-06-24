"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Check, Zap, Shield } from "lucide-react";
import { plans } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

const faqs = [
  { q: "What counts as an AI task?", a: "AI tasks include: Background Removal, Image Upscale, Photo Enhance, and Image Generation. Basic tools (Compress, Convert, Resize) are always free and don't count as AI tasks." },
  { q: "Is my data safe?", a: "All files are processed in real-time and deleted immediately after. We never store, share, or train on your data." },
  { q: "What formats are supported?", a: "Images: PNG, JPG, WebP, AVIF. Maximum file size varies by plan (10MB for Free, 25MB for Starter, 50MB for Pro)." },
  { q: "Can I cancel anytime?", a: "Yes! Cancel anytime via CREEM's customer portal. You keep access until the end of your billing period." },
  { q: "How do I contact support?", a: "Go to our Contact page or email 1162093529@qq.com. We typically respond within 24 hours. Pro users get priority support." },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const { t } = useI18n();

  const getSubscribeHref = (planId: string) => {
    if (planId === "free") return "/signup";
    if (session) return `/billing?plan=${planId}`;
    return `/signup?plan=${planId}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="text-center mb-12">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">{t("pricing.badge")}</span>
        <h1 className="text-3xl sm:text-4xl font-black">
          {t("pricing.title1")} <span className="gradient-text">{t("pricing.title2")}</span>
        </h1>
        <p className="mt-3 text-[#8888a0]">{t("pricing.subtitle")}</p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-3 mb-16 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className={`card relative flex flex-col ${plan.popular ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-[#12121e] shadow-[0_0_30px_rgba(124,58,237,0.15)]" : ""}`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-1 text-xs font-bold text-white whitespace-nowrap">
                {t("pricing.popular")}
              </span>
            )}
            <h3 className="text-lg font-bold text-[#e8e8f0]">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-3xl font-black text-[#e8e8f0]">{plan.price}</span>
              <span className="text-sm text-[#8888a0]">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#8888a0]">
                  <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href={getSubscribeHref(plan.id)} className={plan.popular ? "btn-primary mt-6 w-full justify-center text-sm" : "btn-secondary mt-6 w-full justify-center text-sm"}>
              {plan.id === "free" ? t("pricing.free_cta") : `${t("pricing.subscribe")} ${plan.name}`}
            </Link>
          </div>
        ))}
      </div>

      {/* Compare */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-black text-center mb-8">{t("pricing.compare_title")}</h2>
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a45] bg-[#0e0e1a]">
                  <th className="text-left p-4 text-[#8888a0] font-semibold whitespace-nowrap">Feature</th>
                  <th className="text-center p-4 text-[#8888a0] font-semibold whitespace-nowrap">remove.bg</th>
                  <th className="text-center p-4 text-[#8888a0] font-semibold whitespace-nowrap">TinyPNG</th>
                  <th className="text-center p-4 text-violet-400 font-bold whitespace-nowrap">PixelForge</th>
                </tr>
              </thead>
              <tbody className="text-[#8888a0]">
                {[
                  ["AI Background Removal", "✅ $0.20/img", "❌", "✅ Included"],
                  ["AI Image Upscale", "❌", "❌", "✅ Included"],
                  ["Compress / Convert / Resize", "❌", "✅ Limited", "✅ Free & Unlimited"],
                  ["All-in-One Toolkit", "❌ BG only", "❌ Compress only", "✅ 5+ tools"],
                  ["Pro Plan Price", "$9.99/mo", "$25/yr", "$9.99/mo (all tools)"],
                ].map(([feature, col1, col2, col3], i) => (
                  <tr key={i} className="border-b border-[#1e1e30]">
                    <td className="p-4 whitespace-nowrap">{feature}</td>
                    <td className="text-center p-4">{col1}</td>
                    <td className="text-center p-4">{col2}</td>
                    <td className="text-center p-4 text-emerald-400 font-semibold whitespace-nowrap">{col3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-8">{t("pricing.faq_title")}</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="card">
              <h4 className="font-bold text-[#e8e8f0]">{faq.q}</h4>
              <p className="mt-2 text-sm text-[#8888a0] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Trust Badge */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <div className="card py-6 px-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Shield className="h-8 w-8 text-emerald-400 shrink-0" />
          <div className="text-left">
            <p className="text-sm font-bold text-[#e8e8f0]">{t("pricing.payments")}</p>
            <p className="text-xs text-[#8888a0]">{t("pricing.payments_desc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
