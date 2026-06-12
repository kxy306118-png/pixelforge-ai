"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Eraser, Zap, Shield, Clock } from "lucide-react";

export default function RemoveBgPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setResultUrl(null);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res = await fetch("/api/remove-bg", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setResultUrl(URL.createObjectURL(await res.blob()));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setIsProcessing(false); }
  }, []);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(139,92,246,0.1),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          {/* Main */}
          <div>
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Eraser className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl sm:text-4xl font-black">
                Remove <span className="gradient-text">Background</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">
                AI-powered background removal. Get clean, transparent PNGs in seconds.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-600">
              <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> ~5 sec</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500" /> Auto-deleted 1hr</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-blue-500" /> No signup</span>
            </div>

            <div className="mt-8 space-y-6">
              {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
              <ProcessingIndicator isProcessing={isProcessing} message="Removing background with AI..." />
              {isProcessing && originalUrl && <div className="flex justify-center animate-fade-in"><img src={originalUrl} alt="Processing" className="max-h-48 rounded-xl opacity-40" /></div>}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center animate-scale-in">
                  <p className="text-sm font-semibold text-red-400">Processing failed</p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                  <button onClick={handleReset} className="mt-3 text-xs font-semibold text-red-400 underline hover:text-red-300">Try again</button>
                </div>
              )}
              {resultUrl && (
                <div className="animate-fade-in-up space-y-4">
                  <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename="removed-bg.png" />
                  <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-400 hover:text-violet-300 underline font-medium">Process another image</button></div>
                </div>
              )}
            </div>

            {/* Mobile ad */}
            <div className="mt-8 lg:hidden ad-slot h-[90px] rounded-2xl"><span>Ad</span></div>

            {/* FAQ */}
            <div className="mt-14 space-y-3">
              <h2 className="text-lg font-bold text-zinc-200">FAQ</h2>
              {[
                { q: "Is this background remover free?", a: "Yes! Remove up to 3 images per day for free, no account needed." },
                { q: "What formats are supported?", a: "PNG, JPEG, and WebP. Output is always transparent PNG." },
                { q: "Are my images stored?", a: "No. Images are processed and auto-deleted within 1 hour." },
              ].map((f, i) => (
                <details key={i} className="group rounded-xl border border-white/[0.04] hover:border-violet-500/20 transition-colors">
                  <summary className="cursor-pointer p-4 text-sm font-medium text-zinc-300">{f.q}</summary>
                  <p className="px-4 pb-4 text-sm text-zinc-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="ad-slot h-[250px] rounded-2xl"><span>Ad</span></div>
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Related Tools</h3>
                <div className="mt-3 space-y-1">
                  {[{ n: "AI Upscale", h: "/tools/upscale" }, { n: "Enhance", h: "/tools/enhance" }, { n: "Convert", h: "/tools/convert" }].map((t) => (
                    <a key={t.h} href={t.h} className="block rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-violet-400 hover:bg-white/[0.03] transition-colors">{t.n}</a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
