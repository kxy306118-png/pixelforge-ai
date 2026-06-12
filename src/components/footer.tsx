import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#06060a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Pixel<span className="gradient-text">Forge</span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI-powered image tools. Fast, private, and free to start.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
              </span>
            </div>
          </div>
          {[
            { t: "Tools", links: [{ h: "/tools/remove-bg", l: "Remove BG" }, { h: "/tools/upscale", l: "Upscale" }, { h: "/tools/compress", l: "Compress" }, { h: "/tools/convert", l: "Convert" }] },
            { t: "Product", links: [{ h: "/tools", l: "All Tools" }, { h: "/pricing", l: "Pricing" }] },
            { t: "Legal", links: [{ h: "/privacy", l: "Privacy" }, { h: "/terms", l: "Terms" }] },
          ].map((s) => (
            <div key={s.t}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{s.t}</h3>
              <ul className="mt-3 space-y-2">
                {s.links.map((l) => (
                  <li key={l.l}><Link href={l.h} className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">{l.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.04] pt-8">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} PixelForge AI. All rights reserved.</p>
          <p className="text-xs text-zinc-600">Built for creators worldwide</p>
        </div>
      </div>
    </footer>
  );
}
