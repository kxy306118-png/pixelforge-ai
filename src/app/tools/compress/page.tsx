"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function CompressPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
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
      fd.append("quality", String(quality));
      const res = await fetch("/api/compress", { method: "POST", body: fd });
      if (!res.ok) {
        let msg = t("compress.fail");
        try { const j = await res.json(); if (j.error) msg = j.error; } catch {}
        throw new Error(msg);
      }
      const blob = await res.blob();
      if (blob.size === 0) throw new Error("Empty response from server");
      setResult({
        originalUrl: URL.createObjectURL(f),
        resultUrl: URL.createObjectURL(blob),
        originalSize: fmt(f.size),
        resultSize: fmt(blob.size),
      });
    } catch (e: any) {
      setError(e.message || t("compress.fail"));
    } finally {
      setProcessing(false);
    }
  }, [quality, t]);

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("compress.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("compress.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {!result && (
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-[#8888a0] font-semibold">{t("compress.quality_label")}</span>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onInput={(e) => setQuality(Number((e.target as HTMLInputElement).value))}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-48"
                id="compress-quality-slider"
              />
              <span id="compress-quality-value" className="text-sm font-bold text-violet-400 w-12 text-right">{quality}%</span>
            </div>
          )}

          {!file && !result && <ImageUpload onImageSelect={processImage} />}
          {processing && <ProcessingIndicator message={t("compress.processing")} />}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={reset} className="btn-primary">{t("compress.reset")}</button>
            </div>
          )}
          {result && (
            <ResultPreview
              originalUrl={result.originalUrl}
              resultUrl={result.resultUrl}
              originalSize={result.originalSize}
              resultSize={result.resultSize}
              fileName="compressed.webp"
              onReset={reset}
            />
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
