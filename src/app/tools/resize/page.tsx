"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Move } from "lucide-react";

const presets = [
  { label: "HD 1080p", w: 1920, h: 1080 },
  { label: "720p", w: 1280, h: 720 },
  { label: "Square", w: 1080, h: 1080 },
  { label: "Thumb", w: 300, h: 300 },
];

export default function ResizePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [fit, setFit] = useState("cover");

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setResultUrl(null);
    try {
      const fd = new FormData();
      fd.append("image", file); fd.append("width", width.toString()); fd.append("height", height.toString()); fd.append("fit", fit);
      const res = await fetch("/api/resize", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setResultUrl(URL.createObjectURL(await res.blob()));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [width, height, fit]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(99,102,241,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Move className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl sm:text-4xl font-black">Resize <span className="gradient-text">Image</span></h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">Resize to any dimension with smart cropping.</p>
            </div>

            <div className="mt-8 space-y-5">
              {/* Presets */}
              <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-in-up">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      width === p.w && height === p.h ? "neon-btn" : "ghost-btn"
                    }`}><span>{p.label}</span></button>
                ))}
              </div>
              {/* Custom size */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-500">W</label>
                  <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} disabled={isProcessing}
                    className="w-24 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-center text-zinc-200 focus:border-violet-500/40 focus:outline-none" />
                </div>
                <span className="text-zinc-600">×</span>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-500">H</label>
                  <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} disabled={isProcessing}
                    className="w-24 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-center text-zinc-200 focus:border-violet-500/40 focus:outline-none" />
                </div>
              </div>
              {/* Fit mode */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[{ v: "cover", l: "Cover" }, { v: "contain", l: "Contain" }, { v: "inside", l: "Inside" }].map((m) => (
                  <button key={m.v} onClick={() => setFit(m.v)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      fit === m.v ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "border border-white/[0.06] text-zinc-500"
                    }`}>{m.l}</button>
                ))}
              </div>

              {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
              <ProcessingIndicator isProcessing={isProcessing} message="Resizing..." />
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center animate-scale-in">
                  <p className="text-sm font-semibold text-red-400">Failed</p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                  <button onClick={handleReset} className="mt-3 text-xs font-semibold text-red-400 underline">Try again</button>
                </div>
              )}
              {resultUrl && (
                <div className="animate-fade-in-up space-y-4">
                  <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename={`resized-${width}x${height}.webp`} />
                  <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-400 underline font-medium">Resize another</button></div>
                </div>
              )}
            </div>
            <div className="mt-8 lg:hidden ad-slot h-[90px] rounded-2xl"><span>Ad</span></div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-24 space-y-5">
            <div className="ad-slot h-[250px] rounded-2xl"><span>Ad</span></div>
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Common Sizes</h3>
              <ul className="mt-3 space-y-2 text-xs text-zinc-500">
                <li><strong className="text-zinc-300">Instagram</strong> — 1080×1080</li>
                <li><strong className="text-zinc-300">Story</strong> — 1080×1920</li>
                <li><strong className="text-zinc-300">FB Cover</strong> — 820×312</li>
                <li><strong className="text-zinc-300">Twitter</strong> — 1500×500</li>
                <li><strong className="text-zinc-300">YT Thumb</strong> — 1280×720</li>
              </ul>
            </div>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
