import { tools } from "@/lib/config";
import { ArrowRight, Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move } from "lucide-react";
import Link from "next/link";

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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">All Image Tools</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Free AI-powered tools to process, enhance, and convert your images
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all"
          >
            {tool.badge && (
              <span
                className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tool.badge === "AI"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {tool.badge}
              </span>
            )}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
              {iconMap[tool.icon]}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{tool.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {tool.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
              Use Tool <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
