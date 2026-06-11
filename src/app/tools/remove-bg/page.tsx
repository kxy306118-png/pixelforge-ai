"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { Eraser } from "lucide-react";

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
        <h1 className="mt-4 text-3xl font-bold">Remove Background</h1>
        <p className="mt-2 text-muted-foreground">
          Remove image backgrounds instantly with AI. Get clean, transparent PNGs in seconds.
        </p>
      </div>

      <div className="mt-8 space-y-6">
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
              downloadFilename="removed-bg.png"
            />
            <button
              onClick={handleReset}
              className="text-sm text-violet-600 hover:text-violet-700 underline"
            >
              Process another image
            </button>
          </>
        )}
      </div>

      {/* SEO Content */}
      <div className="mt-16 space-y-6 text-sm text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">How to Remove Image Background</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Upload your image (PNG, JPG, or WebP)</li>
          <li>Our AI automatically detects and removes the background</li>
          <li>Download your image with a transparent background as PNG</li>
        </ol>
        <h2 className="text-xl font-semibold text-foreground">Why Use Our Background Remover?</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>100% free — no signup or credit card required</li>
          <li>Powered by advanced AI for clean, accurate results</li>
          <li>Works with any image: products, portraits, logos, and more</li>
          <li>Download high-quality transparent PNG files</li>
        </ul>
      </div>
    </div>
  );
}
