import Link from "next/link";
import { tools } from "@/lib/config";
import { Eraser, Maximize, FileDown, RefreshCw, Sparkles, Move, ArrowRight, Zap, Shield, Globe, Star, Users, Image } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Eraser: <Eraser className="h-6 w-6" />,
  Maximize: <Maximize className="h-6 w-6" />,
  FileDown: <FileDown className="h-6 w-6" />,
  RefreshCw: <RefreshCw className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Move: <Move className="h-6 w-6" />,
};

const stats = [
  { icon: <Users className="h-5 w-5" />, value: "50K+", label: "Users" },
  { icon: <Image className="h-5 w-5" />, value: "1M+", label: "Images Processed" },
  { icon: <Star className="h-5 w-5" />, value: "4.9", label: "User Rating" },
  { icon: <Globe className="h-5 w-5" />, value: "120+", label: "Countries" },
];

export default function HomePage() {
  const popularTools = tools.filter((t) => t.popular);
  const otherTools = tools.filter((t) => !t.popular);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              100% Free — No Signup Required
            </div>

            {/* Title */}
            <h1 className="hero-title text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              AI-Powered Image Tools,{" "}
              <span className="gradient-text">Right in Your Browser</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base text-muted-foreground sm:text-lg lg:text-xl animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
              Remove backgrounds, upscale photos, compress images, and more — all powered by AI.
              Fast, private, and completely free to start.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/tools/remove-bg"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-300/30 hover:shadow-xl hover:shadow-violet-400/40 hover:from-violet-700 hover:to-blue-600 transition-all duration-300 btn-press"
              >
                Try Remove Background
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold hover:bg-white hover:shadow-md transition-all duration-300 btn-press"
              >
                View All Tools
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Instant processing</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-500" /> Privacy first</span>
              <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-blue-500" /> Works on all devices</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="border-y border-border/40 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Popular Tools ===== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center animate-fade-in-up">
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 uppercase tracking-wider">
            Most Popular
          </span>
          <h2 className="section-title mt-3 text-2xl font-bold sm:text-3xl">
            Powerful Image Tools, One Click Away
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Try our most-used image tools for free. No account needed.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {popularTools.map((tool) => (
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
      </section>

      {/* ===== Banner Ad ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="ad-container ad-container-banner rounded-2xl">
          <div className="text-center py-6 px-4 text-muted-foreground/40">
            <p className="text-xs font-medium uppercase tracking-wider">Advertisement</p>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="bg-muted/40 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h2 className="section-title text-2xl font-bold sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">Three simple steps, no signup needed</p>
          </div>

          <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
            {[
              { step: "01", title: "Upload Your Image", desc: "Drag & drop, paste from clipboard, or browse your files. Supports PNG, JPG, and WebP.", icon: "📤" },
              { step: "02", title: "AI Processes It", desc: "Our AI models handle the heavy lifting. Background removal, upscaling, compression — done in seconds.", icon: "⚡" },
              { step: "03", title: "Download Result", desc: "Compare before & after with our slider tool, then download your processed image instantly.", icon: "📥" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-border/60 bg-card p-6 sm:p-8 text-center card-hover animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/30">{item.step}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Other Tools ===== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center animate-fade-in-up">
          <h2 className="section-title text-2xl font-bold sm:text-3xl">
            More Tools
          </h2>
          <p className="mt-3 text-muted-foreground">Additional tools to cover all your image needs</p>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {otherTools.map((tool) => (
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors duration-300">
                {iconMap[tool.icon]}
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-semibold">{tool.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all duration-300">
                Try now <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-violet-500 to-blue-500 p-8 sm:p-12 lg:p-16 text-center text-white animate-pulse-glow">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Ready to enhance your images?
            </h2>
            <p className="mt-3 text-violet-100 max-w-lg mx-auto text-sm sm:text-base">
              Start for free — no account needed. Process your first image in seconds.
            </p>
            <Link
              href="/tools/remove-bg"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-violet-600 hover:bg-violet-50 transition-all duration-200 shadow-lg btn-press"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
