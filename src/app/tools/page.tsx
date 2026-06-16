"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { tools, categoryInfo, type ToolCategory } from "@/lib/config";
import { Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move, Video, Film, Subtitles, Mic, Volume2, Headphones, PenTool, Wand2, Type, Search } from "lucide-react";
import { Suspense } from "react";

const iconMap: Record<string, React.ElementType> = { Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move, Video, Film, Subtitles, Mic, Volume2, Headphones, PenTool, Wand2, Type, ImageIcon: Eraser, ScanText: Type };

const categoryColors: Record<ToolCategory, string> = { image: "violet", video: "blue", audio: "emerald", text: "amber" };

function ToolsContent() {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat") as ToolCategory | null;
  const filteredTools = activeCat ? tools.filter((t) => t.category === activeCat) : tools;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black">All Tools</h1>
        <p className="mt-3 text-[#8888a0]">16 AI-powered tools for image, video, audio, and text processing.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Link href="/tools" className={`btn-option text-sm ${!activeCat ? "bg-violet-600 text-white border-violet-600" : ""}`}>
          All ({tools.length})
        </Link>
        {(["image", "video", "audio", "text"] as ToolCategory[]).map((cat) => {
          const count = tools.filter((t) => t.category === cat).length;
          return (
            <Link key={cat} href={`/tools?cat=${cat}`} className={`btn-option text-sm ${activeCat === cat ? `bg-${categoryColors[cat]}-600 text-white border-${categoryColors[cat]}-600` : ""}`}>
              {categoryInfo[cat].label} ({count})
            </Link>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const Icon = iconMap[tool.icon] || Eraser;
          const color = categoryColors[tool.category];
          return (
            <Link key={tool.id} href={tool.href} className="card group hover:border-violet-500/30 transition-all">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 mb-3`}>
                <Icon className={`h-5 w-5 text-${color}-400`} />
              </div>
              <h3 className="font-bold text-[#e8e8f0] group-hover:text-violet-400 transition-colors">{tool.name}</h3>
              <p className="mt-1 text-xs text-[#8888a0]">{tool.description}</p>
              <div className="flex gap-2 mt-3">
                {tool.ai ? (
                  <span className={`rounded-full bg-${color}-500/10 px-2 py-0.5 text-[10px] font-bold text-${color}-400`}>AI</span>
                ) : (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">FREE</span>
                )}
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[#555570] capitalize">{tool.category}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#8888a0]">Loading...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
