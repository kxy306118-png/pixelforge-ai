"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
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
        <h1 className="mt-4 text-3xl font-bold">Convert Image Format</h1>
        <p className="mt-2 text-muted-foreground">
          Convert images between PNG, JPEG, WebP, and AVIF formats instantly.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Format selector */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">Convert to:</span>
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => setTargetFormat(f.value)}
              disabled={isProcessing}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                targetFormat === f.value
                  ? "bg-violet-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!resultUrl && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={isProcessing} />
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {resultUrl && (
          <>
            <ResultPreview
              originalUrl={originalUrl}
              resultUrl={resultUrl}
              downloadFilename={`converted.${targetFormat}`}
            />
            <button
              onClick={handleReset}
              className="text-sm text-violet-600 hover:text-violet-700 underline"
            >
              Convert another image
            </button>
          </>
        )}
      </div>

      <div className="mt-16 space-y-6 text-sm text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Supported Formats</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>PNG</strong> — Lossless, best for graphics and transparent images</li>
          <li><strong>JPEG</strong> — Best for photos, small file size</li>
          <li><strong>WebP</strong> — Modern format, great compression and quality</li>
          <li><strong>AVIF</strong> — Next-gen format, best compression ratio</li>
        </ul>
      </div>
    </div>
  );
}
