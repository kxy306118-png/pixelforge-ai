"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Move } from "lucide-react";

export default function ResizePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fit, setFit] = useState<"cover" | "contain" | "fill" | "inside" | "outside">("cover");

  const handleImageSelected = useCallback(
    async (file: File) => {
      if (!width && !height) {
        setError("Please enter at least a width or height before uploading");
        return;
      }

      setIsProcessing(true);
      setError(null);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);

      try {
        const formData = new FormData();
        formData.append("image", file);
        if (width) formData.append("width", width);
        if (height) formData.append("height", height);
        formData.append("fit", fit);

        const res = await fetch("/api/resize", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to resize image");
        }

        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    },
    [width, height, fit]
  );

  const handleReset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Move className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Resize Image</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Resize images to any dimension. Maintain aspect ratio or crop to exact sizes.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Quick presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Presets:</span>
          {[
            { label: "1080p", w: "1920", h: "1080" },
            { label: "720p", w: "1280", h: "720" },
            { label: "Square", w: "1024", h: "1024" },
            { label: "Thumbnail", w: "256", h: "256" },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => { setWidth(p.w); setHeight(p.h); }}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:border-violet-300 hover:text-violet-600 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-center gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g. 1920"
              className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 1080"
              className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Fit</label>
            <select
              value={fit}
              onChange={(e) => setFit(e.target.value as typeof fit)}
              className="rounded-lg border border-border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>
        </div>

        {!resultUrl && !isProcessing && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
        )}

        <ProcessingIndicator isProcessing={isProcessing} message="Resizing your image..." />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Resize failed</p>
            <p className="mt-1">{error}</p>
            <button onClick={handleReset} className="mt-2 text-xs font-medium text-red-600 underline">
              Try again
            </button>
          </div>
        )}

        {resultUrl && (
          <>
            <ResultPreview
              originalUrl={originalUrl}
              resultUrl={resultUrl}
              downloadFilename={`resized-${width || "auto"}x${height || "auto"}.webp`}
            />
            <div className="text-center">
              <button onClick={handleReset} className="text-sm text-violet-600 hover:text-violet-700 underline">
                Resize another image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
