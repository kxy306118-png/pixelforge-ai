"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Eraser, Clock, Shield, Zap } from "lucide-react";

export default function RemoveBgPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove background");
      }

      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Eraser className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Remove Background from Image</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Remove image backgrounds instantly with AI. Get clean, transparent PNGs in seconds. Free, no signup required.
        </p>
      </div>

      {/* Trust badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> 5 sec average</span>
        <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-500" /> Images deleted after 1hr</span>
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-500" /> No signup needed</span>
      </div>

      <div className="mt-8 space-y-6">
        {!resultUrl && !isProcessing && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
        )}

        <ProcessingIndicator
          isProcessing={isProcessing}
          message="Removing background with AI..."
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
              downloadFilename="removed-bg.png"
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

      {/* SEO + FAQ */}
      <div className="mt-16 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground">How to Remove Image Background</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Upload your image (PNG, JPG, or WebP) — drag & drop, paste URL, or Ctrl+V</li>
            <li>Our AI automatically detects the subject and removes the background</li>
            <li>Compare before/after with the slider, then download your transparent PNG</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Why Use Our Background Remover?</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li><strong>100% free</strong> — no signup, no credit card, no watermark</li>
            <li><strong>AI-powered</strong> for clean, accurate edge detection</li>
            <li><strong>Works with any image</strong> — products, portraits, logos, animals, and more</li>
            <li><strong>High quality</strong> transparent PNG output</li>
            <li><strong>Privacy first</strong> — all images auto-deleted within 1 hour</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-4">
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Is this background remover really free?</summary>
              <p className="mt-2">Yes! You can remove backgrounds from up to 3 images per day for free, no account needed. For unlimited use, check out our Pro plan.</p>
            </details>
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">What image formats are supported?</summary>
              <p className="mt-2">We support PNG, JPEG, and WebP input formats. The output is always a high-quality transparent PNG.</p>
            </details>
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Are my images stored on your servers?</summary>
              <p className="mt-2">No. All images are processed and automatically deleted within 1 hour. We never store or share your images.</p>
            </details>
            <details className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium text-foreground">Can I use the results commercially?</summary>
              <p className="mt-2">Yes, you retain full ownership of all processed images and can use them for any purpose, including commercial projects.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
