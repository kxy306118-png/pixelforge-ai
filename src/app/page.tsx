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

export default function HomePage() {
  const popularTools = tools.filter((t) => t.popular);
  const otherTools = tools.filter((t) => !t.popular);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700">
              <Sparkles className="h-4 w-4" />
              100% Free — No Signup Required
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI-Powered Image Tools,{" "}
              <span className="gradient-text">Right in Your Browser</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Remove backgrounds, upscale photos, compress images, and more — all powered by AI.
              Fast, private, and completely free to start.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools/remove-bg"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all"
              >
                Try Remove Background
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-semibold hover:bg-muted transition-colors"
              >
                View All Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Most Popular Tools</h2>
          <p className="mt-3 text-muted-foreground">Try our most-used image tools for free</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all"
            >
              {tool.badge && (
                <span className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tool.badge === "AI" ? "bg-violet-100 text-violet-700" : "bg-green-100 text-green-700"
                }`}>
                  {tool.badge}
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
                {iconMap[tool.icon]}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
                Try now <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other Tools */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">More Tools</h2>
          <p className="mt-3 text-muted-foreground">Additional tools to cover all your image needs</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all"
            >
              {tool.badge && (
                <span className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tool.badge === "AI" ? "bg-violet-100 text-violet-700" : "bg-green-100 text-green-700"
                }`}>
                  {tool.badge}
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                {iconMap[tool.icon]}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                Try now <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to enhance your images?</h2>
          <p className="mt-3 text-violet-100">Start for free — no account needed. Process your first image in seconds.</p>
          <Link
            href="/tools/remove-bg"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-violet-600 hover:bg-violet-50 transition-colors"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
