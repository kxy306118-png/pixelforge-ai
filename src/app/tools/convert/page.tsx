"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { RefreshCw } from "lucide-react";

const formats = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
];

export default function ConvertPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState("png");

  const handleImageSelected = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("format", targetFormat);

        const res = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to convert image");
        }

        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    },
    [targetFormat]
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
          <RefreshCw className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Convert Image Format</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Convert images between PNG, JPEG, WebP, and AVIF formats instantly. Free, no signup.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">Convert to:</span>
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => setTargetFormat(f.value)}
              disabled={isProcessing}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                targetFormat === f.value
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!resultUrl && !isProcessing && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
        )}

        <ProcessingIndicator isProcessing={isProcessing} message="Converting your image..." />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Conversion failed</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={handleReset}
              className="mt-2 text-xs font-medium text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {resultUrl && (
          <>
            <ResultPreview
              originalUrl={originalUrl}
              resultUrl={resultUrl}
              downloadFilename={`converted.${targetFormat}`}
            />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-violet-600 hover:text-violet-700 underline"
              >
                Convert another image
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-16 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Supported Formats</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li><strong>PNG</strong> — Lossless, best for graphics and transparent images</li>
            <li><strong>JPEG</strong> — Best for photos, small file size</li>
            <li><strong>WebP</strong> — Modern format, great compression and quality</li>
            <li><strong>AVIF</strong> — Next-gen format, best compression ratio</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-4">
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Will I lose quality converting to JPEG?</summary>
              <p className="mt-2">JPEG uses lossy compression, so there may be minor quality loss. For best results, convert to PNG (lossless) or WebP (near-lossless).</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
