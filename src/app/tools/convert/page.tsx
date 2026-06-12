"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { RefreshCw } from "lucide-react";

const formats = [{ v: "png", l: "PNG" }, { v: "jpeg", l: "JPEG" }, { v: "webp", l: "WebP" }, { v: "avif", l: "AVIF" }];

export default function ConvertPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fmt, setFmt] = useState("png");

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setResultUrl(null);
    try {
      const fd = new FormData(); fd.append("image", file); fd.append("format", fmt);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setResultUrl(URL.createObjectURL(await res.blob()));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [fmt]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(245,158,11,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <RefreshCw className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl sm:text-4xl font-black">Convert <span className="gradient-text">Format</span></h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto">Convert between PNG, JPEG, WebP, and AVIF instantly.</p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-in-up">
                <span className="text-sm text-zinc-500">Convert to:</span>
                {formats.map((f) => (
                  <button key={f.v} onClick={() => setFmt(f.v)} disabled={isProcessing}
                    className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                      fmt === f.v ? "neon-btn" : "ghost-btn"
                    }`}><span>{f.l}</span></button>
                ))}
              </div>
              {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
              <ProcessingIndicator isProcessing={isProcessing} message="Converting..." />
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center animate-scale-in">
                  <p className="text-sm font-semibold text-red-400">Failed</p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                  <button onClick={handleReset} className="mt-3 text-xs font-semibold text-red-400 underline">Try again</button>
                </div>
              )}
              {resultUrl && (
                <div className="animate-fade-in-up space-y-4">
                  <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename={`converted.${fmt}`} />
                  <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-400 underline font-medium">Convert another</button></div>
                </div>
              )}
            </div>
            <div className="mt-8 lg:hidden ad-slot h-[90px] rounded-2xl"><span>Ad</span></div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-24 space-y-5">
            <div className="ad-slot h-[250px] rounded-2xl"><span>Ad</span></div>
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Formats</h3>
              <ul className="mt-3 space-y-2 text-xs text-zinc-500">
                <li><strong className="text-zinc-300">PNG</strong> — Lossless, transparent</li>
                <li><strong className="text-zinc-300">JPEG</strong> — Photos, small</li>
                <li><strong className="text-zinc-300">WebP</strong> — Modern, great quality</li>
                <li><strong className="text-zinc-300">AVIF</strong> — Best compression</li>
              </ul>
            </div>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
