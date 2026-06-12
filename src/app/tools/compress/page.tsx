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
      const fd = new FormData();
      fd.append("image", file); fd.append("quality", quality.toString());
      const res = await fetch("/api/compress", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      const blob = await res.blob(); setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setIsProcessing(false); }
  }, [quality]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div>
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600">
              <FileDown className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Compress Image</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Reduce file size by up to 90% without visible quality loss.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 space-y-6">
            {/* Quality slider */}
            <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Quality:</span>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} disabled={isProcessing} className="w-full sm:w-48 accent-violet-600" />
              <span className="min-w-[3rem] text-sm font-bold tabular-nums">{quality}%</span>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">Recommended: 75-85% for photos, 60-70% for thumbnails</p>

            {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
            <ProcessingIndicator isProcessing={isProcessing} message="Compressing your image..." />
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-scale-in">
                <p className="font-semibold">Compression failed</p><p className="mt-1 text-xs">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-semibold text-red-600 underline">Try again</button>
              </div>
            )}
            {resultUrl && (
              <div className="animate-fade-in-up space-y-4">
                <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} originalSize={originalSize} resultSize={resultSize} downloadFilename="compressed.webp" />
                <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-600 hover:text-violet-700 underline font-medium">Compress another</button></div>
              </div>
            )}
          </div>

          {/* Mobile ad */}
          <div className="mt-8 lg:hidden"><div className="ad-container ad-container-banner rounded-2xl"><p className="text-xs text-muted-foreground/40 py-6">Advertisement</p></div></div>

          {/* FAQ */}
          <div className="mt-10 space-y-4 text-sm text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            {[
              { q: "Why WebP output?", a: "WebP provides the best compression while maintaining quality. Supported by all modern browsers." },
              { q: "File size limit?", a: "Maximum upload is 10MB. Pro plan supports up to 50MB." },
            ].map((f, i) => (
              <details key={i} className="group rounded-xl border border-border/60 p-4 hover:border-violet-200 transition-colors">
                <summary className="cursor-pointer font-medium text-foreground text-sm">{f.q}</summary>
                <p className="mt-2 text-xs leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="ad-container ad-container-sidebar rounded-2xl"><p className="text-xs text-muted-foreground/40 py-20">Advertisement</p></div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold">Related Tools</h3>
              <div className="mt-3 space-y-2">
                {[{ n: "Convert Format", h: "/tools/convert" }, { n: "Resize Image", h: "/tools/resize" }].map((t) => (
                  <a key={t.h} href={t.h} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">{t.n}</a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
