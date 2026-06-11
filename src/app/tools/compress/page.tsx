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
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [resultSize, setResultSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);

  const handleImageSelected = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalSize(file.size);
      setResultUrl(null);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("quality", quality.toString());

        const res = await fetch("/api/compress", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to compress image");
        }

        const blob = await res.blob();
        setResultSize(blob.size);
        setResultUrl(URL.createObjectURL(blob));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    },
    [quality]
  );

  const handleReset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setOriginalSize(0);
    setResultSize(0);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
          <FileDown className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Compress Image</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Reduce image file size by up to 90% without visible quality loss. Fast, free, and private.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Quality slider */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">Quality:</span>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            disabled={isProcessing}
            className="w-48 accent-violet-600"
          />
          <span className="min-w-[3rem] text-sm font-medium">{quality}%</span>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Recommended: 75-85% for photos, 60-70% for thumbnails
        </p>

        {!resultUrl && !isProcessing && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
        )}

        <ProcessingIndicator isProcessing={isProcessing} message="Compressing your image..." />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Compression failed</p>
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
              originalSize={originalSize}
              resultSize={resultSize}
              downloadFilename="compressed.webp"
            />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-violet-600 hover:text-violet-700 underline"
              >
                Compress another image
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-16 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground">How to Compress Images</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Upload your image (PNG, JPG, or WebP)</li>
            <li>Adjust the quality slider to balance size and quality</li>
            <li>Your image is compressed to WebP format for maximum efficiency</li>
            <li>See the size savings and download the compressed image</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-4">
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Why does my image become WebP?</summary>
              <p className="mt-2">WebP provides the best compression ratio while maintaining quality. It&apos;s supported by all modern browsers and is the recommended format for the web.</p>
            </details>
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Is there a file size limit?</summary>
              <p className="mt-2">The maximum upload size is 10MB. For larger files, try our Pro plan which supports up to 50MB.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
