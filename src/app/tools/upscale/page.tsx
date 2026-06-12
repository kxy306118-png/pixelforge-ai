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
      const blob = await res.blob(); setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [scale]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div>
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600"><Maximize className="h-7 w-7" /></div>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">AI Image Upscale</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Enlarge images up to 4× with AI — no pixelation, no blur.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3 animate-fade-in-up">
              <span className="text-sm text-muted-foreground">Scale:</span>
              {[2, 3, 4].map((s) => (
                <button key={s} onClick={() => setScale(s)} disabled={isProcessing}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    scale === s ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>{s}×</button>
              ))}
            </div>

            {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
            <ProcessingIndicator isProcessing={isProcessing} message={`Upscaling ${scale}× with AI...`} />
            {isProcessing && originalUrl && (
              <div className="flex justify-center animate-fade-in"><img src={originalUrl} alt="Processing" className="max-h-48 rounded-lg opacity-50" /></div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-scale-in">
                <p className="font-semibold">Upscaling failed</p><p className="mt-1 text-xs">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-semibold text-red-600 underline">Try again</button>
              </div>
            )}
            {resultUrl && (
              <div className="animate-fade-in-up space-y-4">
                <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename={`upscaled-${scale}x.png`} />
                <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-600 underline font-medium">Upscale another</button></div>
              </div>
            )}
          </div>

          <div className="mt-8 lg:hidden"><div className="ad-container ad-container-banner rounded-2xl"><p className="text-xs text-muted-foreground/40 py-6">Advertisement</p></div></div>

          <div className="mt-10 space-y-4 text-sm text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            {[
              { q: "What&apos;s the maximum upscale factor?", a: "We support 2×, 3×, and 4× upscaling. 2× is recommended for most use cases." },
              { q: "How does AI upscaling work?", a: "Our AI model analyzes your image and intelligently adds detail, avoiding the blur of traditional upscaling." },
            ].map((f, i) => (
              <details key={i} className="rounded-xl border border-border/60 p-4 hover:border-violet-200 transition-colors">
                <summary className="cursor-pointer font-medium text-foreground text-sm">{f.q}</summary>
                <p className="mt-2 text-xs leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block"><div className="sticky top-24 space-y-6">
          <div className="ad-container ad-container-sidebar rounded-2xl"><p className="text-xs text-muted-foreground/40 py-20">Advertisement</p></div>
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-sm font-semibold">Related Tools</h3>
            <div className="mt-3 space-y-2">
              {[{ n: "Remove Background", h: "/tools/remove-bg" }, { n: "Image Enhance", h: "/tools/enhance" }].map((t) => (
                <a key={t.h} href={t.h} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">{t.n}</a>
              ))}
            </div>
          </div>
        </div></aside>
      </div>
    </div>
  );
}
