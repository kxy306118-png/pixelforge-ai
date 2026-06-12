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
      const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
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

  const handleReset = () => { setOriginalUrl(null); setResultUrl(null); setError(null); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        {/* Main Content */}
        <div>
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600">
              <Eraser className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Remove Background from Image
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Remove image backgrounds instantly with AI. Get clean, transparent PNGs in seconds.
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> 5 sec avg</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-green-500" /> Auto-deleted in 1hr</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-blue-500" /> No signup</span>
          </div>

          <div className="mt-6 sm:mt-8 space-y-6">
            {!resultUrl && !isProcessing && (
              <div className="animate-scale-in">
                <ImageUpload onImageSelected={handleImageSelected} isProcessing={false} />
              </div>
            )}

            <ProcessingIndicator isProcessing={isProcessing} message="Removing background with AI..." />

            {isProcessing && originalUrl && (
              <div className="flex justify-center animate-fade-in">
                <img src={originalUrl} alt="Processing" className="max-h-48 rounded-lg opacity-50" />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 text-sm text-red-700 animate-scale-in">
                <p className="font-semibold">Processing failed</p>
                <p className="mt-1 text-xs sm:text-sm">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-semibold text-red-600 underline hover:text-red-800">
                  Try again
                </button>
              </div>
            )}

            {resultUrl && (
              <div className="animate-fade-in-up space-y-4">
                <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} downloadFilename="removed-bg.png" />
                <div className="text-center">
                  <button onClick={handleReset} className="text-sm text-violet-600 hover:text-violet-700 underline font-medium">
                    Process another image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile ad */}
          <div className="mt-8 lg:hidden">
            <div className="ad-container ad-container-banner rounded-2xl">
              <p className="text-xs text-muted-foreground/40 py-6">Advertisement</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-10 sm:mt-14 space-y-4 text-sm text-muted-foreground">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
            {[
              { q: "Is this background remover really free?", a: "Yes! Remove backgrounds from up to 3 images per day for free, no account needed. Unlimited use with Pro." },
              { q: "What image formats are supported?", a: "PNG, JPEG, and WebP. Output is always a high-quality transparent PNG." },
              { q: "Are my images stored on your servers?", a: "No. All images are processed and automatically deleted within 1 hour. We never store or share them." },
              { q: "Can I use the results commercially?", a: "Yes, you retain full ownership and can use processed images for any purpose, including commercial projects." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border/60 p-4 hover:border-violet-200 transition-colors">
                <summary className="cursor-pointer font-medium text-foreground text-sm">{faq.q}</summary>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Sidebar ad */}
            <div className="ad-container ad-container-sidebar rounded-2xl">
              <p className="text-xs text-muted-foreground/40 py-20">Advertisement</p>
            </div>

            {/* Related tools */}
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold">Related Tools</h3>
              <div className="mt-3 space-y-2">
                {[
                  { name: "AI Upscale", href: "/tools/upscale" },
                  { name: "Image Enhance", href: "/tools/enhance" },
                  { name: "Convert Format", href: "/tools/convert" },
                ].map((t) => (
                  <a key={t.href} href={t.href} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    {t.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
