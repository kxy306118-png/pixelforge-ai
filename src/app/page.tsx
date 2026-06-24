"use client";
import Link from "next/link";
import { Sparkles, Shield, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const featuredTools = [
  { href: "/tools/ai-image-gen", emoji: "🎨", key: "imggen" },
  { href: "/tools/upscale", emoji: "🔍", key: "upscale" },
  { href: "/tools/remove-bg", emoji: "✂️", key: "removebg" },
  { href: "/tools/speech-to-text", emoji: "🎤", key: "stt" },
  { href: "/tools/compress", emoji: "📦", key: "compress" },
  { href: "/tools/ai-writer", emoji: "✍️", key: "writer" },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-20 pb-16 text-center">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">{t("hero.badge")}</span>
        <h1 className="text-4xl sm:text-6xl font-black leading-tight">
          <span className="gradient-text">{t("hero.title1")}</span> <span className="text-[#e8e8f0]">{t("hero.title2")}</span>
        </h1>
        <p className="mt-5 text-lg text-[#8888a0] max-w-2xl mx-auto">{t("hero.desc")}</p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link href="/tools" className="btn-primary text-base px-8 py-3"><Sparkles className="h-5 w-5" /> {t("hero.cta")}</Link>
          <Link href="/pricing" className="btn-secondary text-base px-8 py-3">{t("hero.cta2")}</Link>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {featuredTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="card text-center py-6 hover:border-violet-500/40 transition-all group">
              <span className="text-3xl block mb-2">{tool.emoji}</span>
              <span className="text-sm font-bold text-[#e8e8f0] group-hover:text-violet-300 transition-colors">{t(`${tool.key}.title`)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          <div className="card text-center">
            <Shield className="h-8 w-8 text-violet-400 mx-auto mb-3" />
            <h3 className="font-bold text-[#e8e8f0]">{t("hero.badge")}</h3>
            <p className="mt-1 text-sm text-[#8888a0]">{t("hero.desc")}</p>
          </div>
          <div className="card text-center">
            <Zap className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold text-[#e8e8f0]">{t("benefit.2")}</h3>
            <p className="mt-1 text-sm text-[#8888a0]">{t("benefit.4")}</p>
          </div>
          <div className="card text-center">
            <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-[#e8e8f0]">{t("benefit.3")}</h3>
            <p className="mt-1 text-sm text-[#8888a0]">{t("hero.desc")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
