"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { Sparkles } from "lucide-react";

export default function EnhancePage() {
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
      formData.append("scale", "2");

      const res = await fetch("/api/upscale", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to enhance image");
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
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">AI Photo Enhancer</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Restore and enhance old, blurry, or damaged photos with AI-powered face restoration.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {!resultUrl && !isProcessing && (
          <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
        )}

        <ProcessingIndicator isProcessing={isProcessing} message="Enhancing your photo with AI..." />

        {isProcessing && originalUrl && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalUrl} alt="Processing" className="max-h-48 rounded-lg opacity-50" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Enhancement failed</p>
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
              downloadFilename="enhanced.png"
            />
            <div className="text-center">
              <button onClick={handleReset} className="text-sm text-violet-600 hover:text-violet-700 underline">
                Enhance another photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
