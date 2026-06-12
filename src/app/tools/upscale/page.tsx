"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Maximize } from "lucide-react";

export default function UpscalePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(2);

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setResultUrl(null);
    try {
      const fd = new FormData(); fd.append("image", file); fd.append("scale", scale.toString());
      const res = await fetch("/api/upscale", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setResultUrl(URL.createObjectURL(await res.blob()));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [scale]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(59,130,246,0.1),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Maximize className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl sm:text-4xl font-black">AI <span className="gradient-text">Upscale</span></h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">Enlarge images up to 4× with AI — no pixelation, no blur.</p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-center gap-3 animate-fade-in-up">
                <span className="text-sm text-zinc-500">Scale:</span>
                {[2, 3, 4].map((s) => (
                  <button key={s} onClick={() => setScale(s)} disabled={isProcessing}
                    className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 ${
                      scale === s ? "neon-btn" : "ghost-btn"
                    }`}><span>{s}×</span></button>
                ))}
              </div>
              {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
              <ProcessingIndicator isProcessing={isProcessing} message={`Upscaling ${scale}× with AI...`} />
              {isProcessing && originalUrl && <div className="flex justify-center animate-fade-in"><img src={originalUrl} alt="Processing" className="max-h-48 rounded-xl opacity-40" /></div>}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center animate-scale-in">
                  <p className="text-sm font-semibold text-red-400">Failed</p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                  <button onClick={handleReset} className="mt-3 text-xs font-semibold text-red-400 underline">Try again</button>
                </div>
              )}
              {resultUrl && (
                <div className="animate-fade-in-up space-y-4">
                  <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename={`upscaled-${scale}x.png`} />
                  <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-400 underline font-medium">Upscale another</button></div>
                </div>
              )}
            </div>
            <div className="mt-8 lg:hidden ad-slot h-[90px] rounded-2xl"><span>Ad</span></div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-24 space-y-5">
            <div className="ad-slot h-[250px] rounded-2xl"><span>Ad</span></div>
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Related</h3>
              <div className="mt-3 space-y-1">
                {[{ n: "Remove BG", h: "/tools/remove-bg" }, { n: "Enhance", h: "/tools/enhance" }].map((t) => (
                  <a key={t.h} href={t.h} className="block rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-violet-400 hover:bg-white/[0.03] transition-colors">{t.n}</a>
                ))}
              </div>
            </div>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
