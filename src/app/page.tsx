"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { tools, categoryInfo, type ToolCategory } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Sparkles } from "lucide-react";

const categoryLabels: Record<ToolCategory, { en: string; zh: string }> = {
  image: { en: "Image Tools", zh: "图像工具" },
  video: { en: "Video Tools", zh: "视频工具" },
  audio: { en: "Audio Tools", zh: "音频工具" },
  text: { en: "Text Tools", zh: "文本工具" },
};

export default function HomePage() {
  const { data: session } = useSession();
  const { lang, t } = useI18n();
  const getStartedHref = session ? "/tools" : "/signup";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-14">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">{t("hero.badge")}</span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#e8e8f0] leading-tight">
          {t("hero.title1")} <span className="gradient-text">{t("hero.title2")}</span>
        </h1>
        <p className="mt-4 text-[#8888a0] text-lg max-w-2xl mx-auto">{t("hero.desc")}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href={getStartedHref} className="btn-primary text-base px-6 py-3">
            {t("hero.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="btn-secondary text-base px-6 py-3">{t("hero.cta2")}</Link>
        </div>
      </div>

      {(Object.keys(categoryInfo) as ToolCategory[]).map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        return (
          <div key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-[#e8e8f0] mb-4">
              {lang === "zh" ? categoryLabels[cat].zh : categoryLabels[cat].en}
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {catTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="card hover:border-violet-500/30 py-4 px-5">
                  <div className="flex items-center gap-2 mb-2">
                    {tool.ai && <Sparkles className="h-3.5 w-3.5 text-violet-400" />}
                    <h3 className="font-bold text-[#e8e8f0] text-sm">{tool.name}</h3>
                  </div>
                  <p className="text-xs text-[#8888a0] leading-relaxed">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
