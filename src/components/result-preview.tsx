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

export function ResultPreview({
  originalUrl,
  resultUrl,
  originalSize,
  resultSize,
  downloadFilename = "result.png",
}: ResultPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<"slider" | "side">("slider");

  const reduction =
    originalSize && resultSize
      ? ((1 - resultSize / originalSize) * 100).toFixed(1)
      : null;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMove]);

  if (!resultUrl) return null;

  return (
    <div className="w-full space-y-4">
      {/* Stats bar */}
      {(originalSize || resultSize) && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-muted/50 p-4 text-sm">
          {originalSize && (
            <div>
              <span className="text-muted-foreground">Original: </span>
              <span className="font-semibold">
                {originalSize >= 1048576
                  ? (originalSize / 1048576).toFixed(2) + " MB"
                  : (originalSize / 1024).toFixed(1) + " KB"}
              </span>
            </div>
          )}
          {resultSize && (
            <div>
              <span className="text-muted-foreground">Result: </span>
              <span className="font-semibold">
                {resultSize >= 1048576
                  ? (resultSize / 1048576).toFixed(2) + " MB"
                  : (resultSize / 1024).toFixed(1) + " KB"}
              </span>
            </div>
          )}
          {reduction && parseFloat(reduction) > 0 && (
            <div>
              <span className="text-muted-foreground">Saved: </span>
              <span className="font-semibold text-green-600">{reduction}%</span>
            </div>
          )}
          {reduction && parseFloat(reduction) < 0 && (
            <div>
              <span className="text-muted-foreground">Size change: </span>
              <span className="font-semibold text-amber-600">+{Math.abs(parseFloat(reduction))}%</span>
            </div>
          )}
        </div>
      )}

      {/* View mode toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode("slider")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "slider"
              ? "bg-violet-600 text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Before / After Slider
        </button>
        <button
          onClick={() => setViewMode("side")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "side"
              ? "bg-violet-600 text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Side by Side
        </button>
      </div>

      {/* Image comparison */}
      {viewMode === "slider" && originalUrl ? (
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl border border-border cursor-ew-resize select-none"
        >
          {/* Result (bottom layer) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Result"
            className="w-full block"
            draggable={false}
          />
          {/* Original (top layer, clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Original"
              className="block"
              style={{ width: containerRef.current?.offsetWidth || "100%" }}
              draggable={false}
            />
          </div>
          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
              <ChevronLeft className="h-3 w-3 text-gray-500" />
              <ChevronRight className="h-3 w-3 text-gray-500" />
            </div>
          </div>
          {/* Labels */}
          <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            Before
          </span>
          <span className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            After
          </span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {originalUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Before</p>
              <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="w-full object-contain" />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">After</p>
            <div className="overflow-hidden rounded-xl border border-violet-200 bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="Result" className="w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Download button */}
      <div className="flex justify-center">
        <a
          href={resultUrl}
          download={downloadFilename}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 font-medium text-white hover:bg-violet-700 transition-colors shadow-md"
        >
          <Download className="h-4 w-4" />
          Download Result
        </a>
      </div>
    </div>
  );
}
