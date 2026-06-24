"use client";
import Link from "next/link";
import {
  FileDown, ArrowRightLeft, Maximize2, Wand2, Sparkles, PenLine,
  Mic, Volume2, Music, ScanText, Video, Film, Subtitles, Languages,
  ChevronRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const tools = [
  // Basic tools
  { key: "compress", href: "/tools/compress", icon: FileDown, category: "basic", free: true },
  { key: "convert", href: "/tools/convert", icon: ArrowRightLeft, category: "basic", free: true },
  { key: "resize", href: "/tools/resize", icon: Maximize2, category: "basic", free: true },
  // AI Image tools
  { key: "upscale", href: "/tools/upscale", icon: Wand2, category: "ai-image", free: false },
  { key: "removebg", href: "/tools/remove-bg", icon: ScanText, category: "ai-image", free: false },
  { key: "enhance", href: "/tools/enhance", icon: Sparkles, category: "ai-image", free: false },
  { key: "imggen", href: "/tools/ai-image-gen", icon: Sparkles, category: "ai-image", free: false },
  // AI Text/Audio tools
  { key: "writer", href: "/tools/ai-writer", icon: PenLine, category: "ai-text", free: false },
  { key: "stt", href: "/tools/speech-to-text", icon: Mic, category: "ai-text", free: false },
  { key: "tts", href: "/tools/text-to-speech", icon: Volume2, category: "ai-text", free: false },
  { key: "ae", href: "/tools/audio-enhance", icon: Music, category: "ai-text", free: false },
  { key: "itt", href: "/tools/image-to-text", icon: ScanText, category: "ai-text", free: false },
  // AI Video tools
  { key: "ttv", href: "/tools/text-to-video", icon: Video, category: "ai-video", free: false },
  { key: "itv", href: "/tools/image-to-video", icon: Film, category: "ai-video", free: false },
  { key: "vs", href: "/tools/video-subtitle", icon: Subtitles, category: "ai-video", free: false },
];

const categories = [
  { id: "basic", icon: FileDown, labelKey: "tools.cat_basic" },
  { id: "ai-image", icon: Sparkles, labelKey: "tools.cat_ai_image" },
  { id: "ai-text", icon: Languages, labelKey: "tools.cat_ai_text" },
  { id: "ai-video", icon: Film, labelKey: "tools.cat_ai_video" },
];

export default function ToolsPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">{t("tools.badge")}</span>
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("tools.title")}</span></h1>
        <p className="mt-3 text-[#8888a0] max-w-2xl mx-auto">{t("tools.subtitle")}</p>
      </div>

      {categories.map((cat) => {
        const catTools = tools.filter((tool) => tool.category === cat.id);
        if (catTools.length === 0) return null;
        return (
          <div key={cat.id} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <cat.icon className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-bold text-[#e8e8f0]">{t(cat.labelKey)}</h2>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.map((tool) => (
                <Link key={tool.key} href={tool.href} className="card flex items-center gap-4 hover:border-violet-500/40 transition-all group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                    <tool.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#e8e8f0] group-hover:text-violet-300 transition-colors">{t(`${tool.key}.title`)}</h3>
                      {tool.free && (
                        <span className="inline-block rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">FREE</span>
                      )}
                    </div>
                    <p className="text-xs text-[#8888a0] mt-0.5 line-clamp-2">{t(`${tool.key}.desc`)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#555570] shrink-0 group-hover:text-violet-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
