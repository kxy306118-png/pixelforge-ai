"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Maximize } from "lucide-react";

export default function UpscalePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(2);

  const handleImageSelected = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("scale", scale.toString());

        const res = await fetch("/api/upscale", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to upscale image");
        }

        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    },
    [scale]
  );

  const handleReset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Maximize className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">AI Image Upscaler</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Enhance and upscale images up to 4x with AI. Fix blurry and low-resolution photos automatically.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Scale selector */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">Scale:</span>
          {[2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              disabled={isProcessing}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                scale === s
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {!resultUrl && !isProcessing && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
        )}

        <ProcessingIndicator
          isProcessing={isProcessing}
          message={`Upscaling image to ${scale}x with AI...`}
        />

        {isProcessing && originalUrl && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalUrl} alt="Processing" className="max-h-48 rounded-lg opacity-50" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Processing failed</p>
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
              downloadFilename={`upscaled-${scale}x.png`}
            />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-violet-600 hover:text-violet-700 underline"
              >
                Process another image
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-16 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground">How to Upscale Images with AI</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Upload your low-resolution or blurry image</li>
            <li>Choose the upscale factor (2x, 3x, or 4x)</li>
            <li>AI enhances details, sharpens edges, and increases resolution</li>
            <li>Compare with the slider and download your high-resolution image</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-4">
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">What&apos;s the maximum upscale factor?</summary>
              <p className="mt-2">We support 2x, 3x, and 4x upscaling. Higher factors give more resolution but take longer to process.</p>
            </details>
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Does upscaling reduce quality?</summary>
              <p className="mt-2">No — our AI model (Real-ESRGAN) actually enhances quality by filling in missing details and sharpening edges.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
