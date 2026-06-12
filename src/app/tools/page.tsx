import Link from "next/link";
import { tools } from "@/lib/config";
import { Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Eraser: <Eraser className="h-6 w-6" />, Maximize: <Maximize className="h-6 w-6" />,
  FileDown: <FileDown className="h-6 w-6" />, RefreshCw: <RefreshCw className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />, Move: <Move className="h-6 w-6" />,
};

const colors: Record<string, string> = {
  "remove-bg": "from-violet-500 to-purple-600", upscale: "from-blue-500 to-cyan-500",
  compress: "from-emerald-500 to-green-500", convert: "from-amber-500 to-orange-500",
  enhance: "from-pink-500 to-rose-500", resize: "from-indigo-500 to-violet-500",
};
const glows: Record<string, string> = {
  "remove-bg": "shadow-[0_0_15px_rgba(139,92,246,0.25)]", upscale: "shadow-[0_0_15px_rgba(59,130,246,0.25)]",
  compress: "shadow-[0_0_15px_rgba(16,185,129,0.25)]", convert: "shadow-[0_0_15px_rgba(245,158,11,0.25)]",
  enhance: "shadow-[0_0_15px_rgba(236,72,153,0.25)]", resize: "shadow-[0_0_15px_rgba(99,102,241,0.25)]",
};

export default function ToolsPage() {
  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(139,92,246,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl font-black">All <span className="gradient-text">Image Tools</span></h1>
          <p className="mt-4 text-zinc-500 max-w-lg mx-auto text-sm sm:text-base">
            Free, fast, and private AI-powered image processing. Choose a tool to get started.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.href} className="glass-card p-5 sm:p-6 animate-fade-in-up group">
              {tool.badge && (
                <span className={`absolute top-4 right-4 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  tool.badge === "AI" ? "bg-violet-500/15 text-violet-400" : "bg-emerald-500/15 text-emerald-400"
                }`}>{tool.badge}</span>
              )}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors[tool.id] || "from-violet-500 to-blue-500"} text-white ${glows[tool.id] || ""}`}>
                {iconMap[tool.icon]}
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-zinc-100">{tool.name}</h3>
              <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{tool.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
                Try now <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 ad-slot h-[90px] rounded-2xl"><span>Advertisement</span></div>
      </div>
    </div>
  );
}
