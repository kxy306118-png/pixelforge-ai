"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { FileDown } from "lucide-react";

export default function CompressPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setOriginalSize(file.size); setResultUrl(null);
    try {
      const fd = new FormData(); fd.append("image", file); fd.append("quality", quality.toString());
      const res = await fetch("/api/compress", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      const blob = await res.blob(); setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [quality]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(16,185,129,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <FileDown className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl sm:text-4xl font-black">Compress <span className="gradient-text">Image</span></h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">Reduce file size by up to 90% without visible quality loss.</p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
                <span className="text-sm text-zinc-500">Quality:</span>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} disabled={isProcessing}
                  className="w-full sm:w-48 accent-violet-500 h-1.5 rounded-full" />
                <span className="min-w-[3rem] text-sm font-bold text-violet-400 tabular-nums">{quality}%</span>
              </div>
              {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
              <ProcessingIndicator isProcessing={isProcessing} message="Compressing..." />
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center animate-scale-in">
                  <p className="text-sm font-semibold text-red-400">Failed</p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                  <button onClick={handleReset} className="mt-3 text-xs font-semibold text-red-400 underline">Try again</button>
                </div>
              )}
              {resultUrl && (
                <div className="animate-fade-in-up space-y-4">
                  <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} originalSize={originalSize} resultSize={resultSize} downloadFilename="compressed.webp" />
                  <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-400 underline font-medium">Compress another</button></div>
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
