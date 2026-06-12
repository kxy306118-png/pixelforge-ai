"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

interface ResultPreviewProps {
  originalUrl: string | null;
  resultUrl: string | null;
  originalSize?: number;
  resultSize?: number;
  downloadFilename?: string;
}

function fmt(bytes: number) {
  return bytes >= 1048576 ? (bytes / 1048576).toFixed(2) + " MB" : (bytes / 1024).toFixed(1) + " KB";
}

export function ResultPreview({ originalUrl, resultUrl, originalSize, resultSize, downloadFilename = "result.png" }: ResultPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<"slider" | "side">("slider");

  const reduction = originalSize && resultSize ? ((1 - resultSize / originalSize) * 100).toFixed(1) : null;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSliderPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => handleMove(e.clientX);
    const tm = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const c = containerRef.current;
    if (!c) return;
    c.addEventListener("mousemove", mm);
    c.addEventListener("touchmove", tm);
    return () => { c.removeEventListener("mousemove", mm); c.removeEventListener("touchmove", tm); };
  }, [handleMove]);

  if (!resultUrl) return null;

  return (
    <div className="w-full space-y-5">
      {/* Stats */}
      {(originalSize || resultSize) && (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm">
          {originalSize && <div><span className="text-zinc-500">Original: </span><span className="font-semibold text-zinc-200">{fmt(originalSize)}</span></div>}
          {resultSize && <div><span className="text-zinc-500">Result: </span><span className="font-semibold text-zinc-200">{fmt(resultSize)}</span></div>}
          {reduction && parseFloat(reduction) > 0 && <div><span className="text-zinc-500">Saved: </span><span className="font-semibold text-emerald-400">{reduction}%</span></div>}
          {reduction && parseFloat(reduction) < 0 && <div><span className="text-zinc-500">Size: </span><span className="font-semibold text-amber-400">+{Math.abs(parseFloat(reduction))}%</span></div>}
        </div>
      )}

      {/* View toggle */}
      <div className="flex justify-center gap-2">
        {(["slider", "side"] as const).map((m) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
              viewMode === m ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "border border-white/[0.06] text-zinc-500 hover:text-zinc-300"
            }`}>
            {m === "slider" ? "Before / After" : "Side by Side"}
          </button>
        ))}
      </div>

      {/* Comparison */}
      {viewMode === "slider" && originalUrl ? (
        <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-white/[0.06] cursor-ew-resize select-none">
          <img src={resultUrl} alt="Result" className="w-full block" draggable={false} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
            <img src={originalUrl} alt="Original" className="block" style={{ width: containerRef.current?.offsetWidth || "100%" }} draggable={false} />
          </div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ left: `${sliderPos}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <ChevronLeft className="h-3 w-3 text-zinc-600" /><ChevronRight className="h-3 w-3 text-zinc-600" />
            </div>
          </div>
          <span className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">Before</span>
          <span className="absolute top-3 right-3 rounded-lg bg-violet-500/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">After</span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {originalUrl && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Before</p>
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"><img src={originalUrl} alt="Original" className="w-full object-contain" /></div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">After</p>
            <div className="overflow-hidden rounded-xl border border-violet-500/20 bg-white/[0.02] shadow-[0_0_20px_rgba(139,92,246,0.1)]"><img src={resultUrl} alt="Result" className="w-full object-contain" /></div>
          </div>
        </div>
      )}

      {/* Download */}
      <div className="flex justify-center pt-2">
        <a href={resultUrl} download={downloadFilename}
          className="neon-btn px-8 py-3.5 text-sm">
          <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Download Result</span>
        </a>
      </div>
    </div>
  );
}
