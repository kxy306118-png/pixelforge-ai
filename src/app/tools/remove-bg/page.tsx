"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function RemoveBgPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalUrl: string; resultUrl: string; originalSize: string; resultSize: string } | null>(null);
  const [error, setError] = useState("");

  const fmt = (b: number) => (b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(2)} MB`);

  const processImage = useCallback(async (f: File) => {
    setFile(f);
    setProcessing(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/remove-bg", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || t("removebg.fail")); }
      const blob = await res.blob();
      setResult({
        originalUrl: URL.createObjectURL(f),
        resultUrl: URL.createObjectURL(blob),
        originalSize: fmt(f.size),
        resultSize: fmt(blob.size),
      });
    } catch (e: any) {
      setError(e.message || t("removebg.fail"));
    } finally {
      setProcessing(false);
    }
  }, [t]);

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("removebg.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("removebg.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {!file && !result && <ImageUpload onImageSelect={processImage} />}
          {processing && <ProcessingIndicator message={t("removebg.processing")} />}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={reset} className="btn-primary">{t("removebg.reset")}</button>
            </div>
          )}
          {result && (
            <ResultPreview
              originalUrl={result.originalUrl}
              resultUrl={result.resultUrl}
              originalSize={result.originalSize}
              resultSize={result.resultSize}
              fileName="no-background.png"
              onReset={reset}
            />
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
