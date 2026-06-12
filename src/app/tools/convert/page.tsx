"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { RefreshCw } from "lucide-react";

const formats = [{ value: "png", label: "PNG" }, { value: "jpeg", label: "JPEG" }, { value: "webp", label: "WebP" }, { value: "avif", label: "AVIF" }];

export default function ConvertPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState("png");

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    setOriginalUrl(URL.createObjectURL(file)); setResultUrl(null);
    try {
      const fd = new FormData(); fd.append("image", file); fd.append("format", targetFormat);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      const blob = await res.blob(); setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [targetFormat]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div>
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"><RefreshCw className="h-7 w-7" /></div>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Convert Image Format</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">Convert between PNG, JPEG, WebP, and AVIF instantly.</p>
          </div>

          <div className="mt-6 sm:mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 animate-fade-in-up">
              <span className="text-sm text-muted-foreground">Convert to:</span>
              {formats.map((f) => (
                <button key={f.value} onClick={() => setTargetFormat(f.value)} disabled={isProcessing}
                  className={`rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium transition-all duration-200 ${
                    targetFormat === f.value ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>{f.label}</button>
              ))}
            </div>

            {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
            <ProcessingIndicator isProcessing={isProcessing} message="Converting..." />
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-scale-in">
                <p className="font-semibold">Conversion failed</p><p className="mt-1 text-xs">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-semibold text-red-600 underline">Try again</button>
              </div>
            )}
            {resultUrl && (
              <div className="animate-fade-in-up space-y-4">
                <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename={`converted.${targetFormat}`} />
                <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-600 underline font-medium">Convert another</button></div>
              </div>
            )}
          </div>

          <div className="mt-8 lg:hidden"><div className="ad-container ad-container-banner rounded-2xl"><p className="text-xs text-muted-foreground/40 py-6">Advertisement</p></div></div>
        </div>

        <aside className="hidden lg:block"><div className="sticky top-24 space-y-6">
          <div className="ad-container ad-container-sidebar rounded-2xl"><p className="text-xs text-muted-foreground/40 py-20">Advertisement</p></div>
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-sm font-semibold">Supported Formats</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><strong>PNG</strong> — Lossless, transparent</li>
              <li><strong>JPEG</strong> — Photos, small size</li>
              <li><strong>WebP</strong> — Modern, great quality</li>
              <li><strong>AVIF</strong> — Best compression</li>
            </ul>
          </div>
        </div></aside>
      </div>
    </div>
  );
}
