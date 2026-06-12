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
      setResultUrl(URL.createObjectURL(await res.blob()));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, []);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(236,72,153,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <Sparkles className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl sm:text-4xl font-black">AI <span className="gradient-text">Enhance</span></h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">Auto-fix colors, brightness, and sharpness with AI.</p>
            </div>
            <div className="mt-8 space-y-6">
              {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
              <ProcessingIndicator isProcessing={isProcessing} message="Enhancing with AI..." />
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
                  <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename="enhanced.png" />
                  <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-400 underline font-medium">Enhance another</button></div>
                </div>
              )}
            </div>
            <div className="mt-8 lg:hidden ad-slot h-[90px] rounded-2xl"><span>Ad</span></div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-24 space-y-5">
            <div className="ad-slot h-[250px] rounded-2xl"><span>Ad</span></div>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
