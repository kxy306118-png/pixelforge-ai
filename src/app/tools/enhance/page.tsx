"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
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

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      // Reusing upscale endpoint for enhance (face_enhance enabled)
      const upscaleRes = await fetch("/api/upscale", {
        method: "POST",
        body: formData,
      });

      if (!upscaleRes.ok) {
        const data = await upscaleRes.json();
        throw new Error(data.error || "Failed to enhance image");
      }

      const blob = await upscaleRes.blob();
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
        <h1 className="mt-4 text-3xl font-bold">AI Photo Enhancer</h1>
        <p className="mt-2 text-muted-foreground">
          Restore and enhance old, blurry, or damaged photos with AI-powered face restoration.
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
              downloadFilename="enhanced.png"
            />
            <button
              onClick={handleReset}
              className="text-sm text-violet-600 hover:text-violet-700 underline"
            >
              Enhance another photo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
