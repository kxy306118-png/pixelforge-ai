"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Sparkles } from "lucide-react";

export default function EnhancePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setResultUrl(null);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res = await fetch("/api/upscale", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      const blob = await res.blob(); setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, []);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div>
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600"><Sparkles className="h-7 w-7" /></div>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">AI Image Enhance</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Automatically fix colors, brightness, and sharpness with AI.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 space-y-6">
            {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
            <ProcessingIndicator isProcessing={isProcessing} message="Enhancing with AI..." />
            {isProcessing && originalUrl && (
              <div className="flex justify-center animate-fade-in"><img src={originalUrl} alt="Processing" className="max-h-48 rounded-lg opacity-50" /></div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-scale-in">
                <p className="font-semibold">Enhancement failed</p><p className="mt-1 text-xs">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-semibold text-red-600 underline">Try again</button>
              </div>
            )}
            {resultUrl && (
              <div className="animate-fade-in-up space-y-4">
                <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename="enhanced.png" />
                <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-600 underline font-medium">Enhance another</button></div>
              </div>
            )}
          </div>

          <div className="mt-8 lg:hidden"><div className="ad-container ad-container-banner rounded-2xl"><p className="text-xs text-muted-foreground/40 py-6">Advertisement</p></div></div>

          <div className="mt-10 space-y-4 text-sm text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            {[
              { q: "What does AI Enhance do?", a: "It automatically adjusts brightness, contrast, saturation, and sharpness to make your photos look their best." },
              { q: "Does it change the resolution?", a: "Enhance improves visual quality without changing dimensions. For resolution increase, use AI Upscale." },
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
        </div></aside>
      </div>
    </div>
  );
}
