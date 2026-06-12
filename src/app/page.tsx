import Link from "next/link";
import { tools } from "@/lib/config";
import { Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move, ArrowRight, Zap, Shield, Globe } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Eraser: <Eraser className="h-6 w-6" />,
  Maximize: <Maximize className="h-6 w-6" />,
  FileDown: <FileDown className="h-6 w-6" />,
  RefreshCw: <RefreshCw className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Move: <Move className="h-6 w-6" />,
};

const toolColors: Record<string, string> = {
  "remove-bg": "from-violet-500 to-purple-600",
  upscale: "from-blue-500 to-cyan-500",
  compress: "from-emerald-500 to-green-500",
  convert: "from-amber-500 to-orange-500",
  enhance: "from-pink-500 to-rose-500",
  resize: "from-indigo-500 to-violet-500",
};

const toolGlow: Record<string, string> = {
  "remove-bg": "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
  upscale: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  compress: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  convert: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  enhance: "shadow-[0_0_15px_rgba(236,72,153,0.3)]",
  resize: "shadow-[0_0_15px_rgba(99,102,241,0.3)]",
};

export default function HomePage() {
  const popular = tools.filter((t) => t.popular);
  const other = tools.filter((t) => !t.popular);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        {/* Radial gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(56,189,248,0.08),transparent)]" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 h-32 w-32 rounded-full bg-cyan-400/5 blur-[60px] animate-float" style={{ animationDelay: "4s" }} />

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
               style={{ animation: "scan-line 8s linear infinite" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Powered by AI — 100% Free
            </div>

            {/* Title */}
            <h1 className="hero-title text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up leading-[1.05]" style={{ animationDelay: "0.1s" }}>
              Transform Your Images
              <br />
              <span className="gradient-text">with the Power of AI</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Remove backgrounds, upscale to 4K, compress without quality loss, and more —
              all in your browser. No signup. No watermarks. Just results.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link href="/tools/remove-bg" className="neon-btn px-8 py-4 text-base w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" /> Start Processing — Free
                </span>
              </Link>
              <Link href="/tools" className="ghost-btn px-8 py-4 text-sm w-full sm:w-auto text-center">
                Explore All Tools →
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" /> Privacy First</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> &lt; 5s Average</span>
              <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-blue-500" /> All Devices</span>
              <span className="flex items-center gap-1.5">🚀 No Watermark</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative border-y border-white/[0.04] bg-[#0a0a10]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger">
            {[
              { v: "50K+", l: "Users", c: "text-violet-400" },
              { v: "1M+", l: "Images Processed", c: "text-blue-400" },
              { v: "4.9★", l: "User Rating", c: "text-amber-400" },
              { v: "120+", l: "Countries", c: "text-emerald-400" },
            ].map((s, i) => (
              <div key={i} className="text-center animate-fade-in-up">
                <p className={`text-2xl sm:text-3xl font-black ${s.c}`}>{s.v}</p>
                <p className="mt-1 text-xs text-zinc-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR TOOLS ===== */}
      <section className="relative py-16 sm:py-24 grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.06),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400">
              Most Popular
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-black">
              One Tool for Every <span className="gradient-text">Image Task</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">
              Choose a tool below. Upload an image. Get results in seconds.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {popular.map((tool) => (
              <Link key={tool.id} href={tool.href} className="glass-card p-5 sm:p-6 animate-fade-in-up group">
                {tool.badge && (
                  <span className={`absolute top-4 right-4 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    tool.badge === "AI" ? "bg-violet-500/15 text-violet-400" : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    {tool.badge}
                  </span>
                )}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${toolColors[tool.id] || "from-violet-500 to-blue-500"} text-white ${toolGlow[tool.id] || ""}`}>
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
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-2xl sm:text-4xl font-black">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-3 text-zinc-500">Three steps. No signup. Just results.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 stagger">
            {[
              { icon: "📤", step: "01", title: "Upload", desc: "Drag & drop, paste from clipboard, or paste a URL. We support PNG, JPG, WebP." },
              { icon: "⚡", step: "02", title: "AI Processing", desc: "Our AI models process your image in seconds. Background removal, upscaling, compression." },
              { icon: "📥", step: "03", title: "Download", desc: "Compare before & after, then download your processed image. That's it." },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 sm:p-8 text-center animate-fade-in-up relative">
                <div className="absolute top-4 right-4 text-xs font-mono text-zinc-700">{item.step}</div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MORE TOOLS ===== */}
      <section className="relative py-16 sm:py-20 grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_80%,rgba(56,189,248,0.05),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-black">More Tools</h2>
            <p className="mt-3 text-zinc-500">Everything else you need for your images</p>
          </div>
          <div className="mt-10 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {other.map((tool) => (
              <Link key={tool.id} href={tool.href} className="glass-card p-5 sm:p-6 animate-fade-in-up group">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${toolColors[tool.id] || "from-violet-500 to-blue-500"} text-white ${toolGlow[tool.id] || ""}`}>
                  {iconMap[tool.icon]}
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-bold text-zinc-100">{tool.name}</h3>
                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                  Try now <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(139,92,246,0.08),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glow-border">
            <div className="relative rounded-2xl bg-gradient-to-br from-violet-600/20 via-[#111116] to-blue-600/20 border border-violet-500/10 p-8 sm:p-14 text-center animate-pulse-glow">
              <h2 className="text-2xl sm:text-4xl font-black">
                Ready to Transform Your Images?
              </h2>
              <p className="mt-4 text-zinc-400 max-w-md mx-auto">
                Start for free. No account needed. Process your first image in under 5 seconds.
              </p>
              <Link href="/tools/remove-bg" className="neon-btn mt-8 inline-flex px-10 py-4 text-base">
                <span className="flex items-center gap-2">Get Started Free <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AD BANNER ===== */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="ad-slot h-[90px] rounded-2xl">
          <span>Advertisement</span>
        </div>
      </div>
    </>
  );
}
