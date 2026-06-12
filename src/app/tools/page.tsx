import Link from "next/link";
import { tools } from "@/lib/config";
import { Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Eraser: <Eraser className="h-6 w-6" />,
  Maximize: <Maximize className="h-6 w-6" />,
  FileDown: <FileDown className="h-6 w-6" />,
  RefreshCw: <RefreshCw className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Move: <Move className="h-6 w-6" />,
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold sm:text-4xl">All Image Tools</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Free, fast, and private AI-powered image processing. Choose a tool below to get started.
        </p>
      </div>

      {/* Tools grid */}
      <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group relative rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm card-hover animate-fade-in-up"
          >
            {tool.badge && (
              <span className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                tool.badge === "AI" ? "bg-violet-100 text-violet-700" : "bg-green-100 text-green-700"
              }`}>
                {tool.badge}
              </span>
            )}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 text-violet-600 group-hover:from-violet-100 group-hover:to-blue-100 transition-colors duration-300">
              {iconMap[tool.icon]}
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-semibold">{tool.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all duration-300">
              Try now <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Banner ad */}
      <div className="mt-12">
        <div className="ad-container ad-container-banner rounded-2xl">
          <p className="text-xs text-muted-foreground/40 py-6">Advertisement</p>
        </div>
      </div>
    </div>
  );
}
