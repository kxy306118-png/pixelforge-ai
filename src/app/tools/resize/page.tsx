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
  { label: "Thumbnail", w: 300, h: 300 },
];
const fitModes = [
  { value: "cover", label: "Cover (fill)" },
  { value: "contain", label: "Contain (fit)" },
  { value: "inside", label: "Inside (no crop)" },
  { value: "outside", label: "Outside" },
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
      const blob = await res.blob(); setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setIsProcessing(false); }
  }, [width, height, fit]);

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div>
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600"><Move className="h-7 w-7" /></div>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Resize Image</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">Resize images to any dimension with smart cropping.</p>
          </div>

          <div className="mt-6 sm:mt-8 space-y-6">
            {/* Preset sizes */}
            <div className="animate-fade-in-up">
              <p className="text-xs text-muted-foreground text-center mb-2">Quick presets</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }}
                    className={`rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      width === p.w && height === p.h ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Custom size inputs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">W:</label>
                <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} disabled={isProcessing}
                  className="w-24 rounded-xl border border-border bg-white px-3 py-2 text-sm text-center focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>
              <span className="text-muted-foreground text-sm">×</span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">H:</label>
                <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} disabled={isProcessing}
                  className="w-24 rounded-xl border border-border bg-white px-3 py-2 text-sm text-center focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>
            </div>

            {/* Fit mode */}
            <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-in-up">
              <span className="text-xs text-muted-foreground">Mode:</span>
              {fitModes.map((m) => (
                <button key={m.value} onClick={() => setFit(m.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    fit === m.value ? "bg-violet-100 text-violet-700" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>{m.label}</button>
              ))}
            </div>

            {!resultUrl && !isProcessing && <div className="animate-scale-in"><ImageUpload onImageSelected={handleImageSelected} isProcessing={false} /></div>}
            <ProcessingIndicator isProcessing={isProcessing} message="Resizing..." />
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-scale-in">
                <p className="font-semibold">Resize failed</p><p className="mt-1 text-xs">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-semibold text-red-600 underline">Try again</button>
              </div>
            )}
            {resultUrl && (
              <div className="animate-fade-in-up space-y-4">
                <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename={`resized-${width}x${height}.webp`} />
                <div className="text-center"><button onClick={handleReset} className="text-sm text-violet-600 underline font-medium">Resize another</button></div>
              </div>
            )}
          </div>

          <div className="mt-8 lg:hidden"><div className="ad-container ad-container-banner rounded-2xl"><p className="text-xs text-muted-foreground/40 py-6">Advertisement</p></div></div>
        </div>

        <aside className="hidden lg:block"><div className="sticky top-24 space-y-6">
          <div className="ad-container ad-container-sidebar rounded-2xl"><p className="text-xs text-muted-foreground/40 py-20">Advertisement</p></div>
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-sm font-semibold">Common Sizes</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><strong>Instagram Post</strong> — 1080 × 1080</li>
              <li><strong>Instagram Story</strong> — 1080 × 1920</li>
              <li><strong>Facebook Cover</strong> — 820 × 312</li>
              <li><strong>Twitter Header</strong> — 1500 × 500</li>
              <li><strong>YouTube Thumb</strong> — 1280 × 720</li>
            </ul>
          </div>
        </div></aside>
      </div>
    </div>
  );
}
