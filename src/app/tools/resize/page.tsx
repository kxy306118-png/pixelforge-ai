"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";
import { resizeImage } from "@/lib/client-image";

const PRESETS: Record<string, [number, number]> = {
  avatar: [512, 512],
  wechat: [640, 640],
  mobile: [1080, 1920],
  desktop: [1920, 1080],
  custom: [0, 0],
};

export default function ResizePage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState("custom");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalUrl: string; resultUrl: string; originalSize: string; resultSize: string } | null>(null);
  const [error, setError] = useState("");

  const fmt = (b: number) => (b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(2)} MB`);

  const handlePreset = (p: string) => {
    setPreset(p);
    if (PRESETS[p]) { setWidth(PRESETS[p][0]); setHeight(PRESETS[p][1]); }
  };

  const processImage = useCallback(async (f: File) => {
    if (!width || !height) { setError(t("resize.need_dims")); return; }
    setFile(f);
    setProcessing(true);
    setError("");
    setResult(null);
    try {
      const blob = await resizeImage(f, width, height, "cover");
      if (blob.size === 0) throw new Error("Failed to resize image");
      setResult({
        originalUrl: URL.createObjectURL(f),
        resultUrl: URL.createObjectURL(blob),
        originalSize: fmt(f.size),
        resultSize: fmt(blob.size),
      });
    } catch (e: any) {
      setError(e.message || t("resize.fail"));
    } finally {
      setProcessing(false);
    }
  }, [width, height, t]);

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("resize.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("resize.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {!result && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="text-sm text-[#8888a0] font-semibold">{t("resize.preset_label")}</span>
                {Object.keys(PRESETS).map((p) => (
                  <button key={p} onClick={() => handlePreset(p)} className={`btn-option ${preset === p ? "active" : ""}`}>
                    {t(`resize.preset_${p}`)}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <input type="number" value={width} onChange={(e) => { setWidth(Number(e.target.value)); setPreset("custom"); }} placeholder={t("resize.width_ph")} className="input-base w-28 text-center" />
                <span className="text-[#8888a0]">×</span>
                <input type="number" value={height} onChange={(e) => { setHeight(Number(e.target.value)); setPreset("custom"); }} placeholder={t("resize.height_ph")} className="input-base w-28 text-center" />
                <span className="text-sm text-[#8888a0]">{t("resize.px")}</span>
              </div>
            </div>
          )}
          {!file && !result && <ImageUpload onImageSelect={processImage} />}
          {processing && <ProcessingIndicator message={t("resize.processing")} />}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={reset} className="btn-primary">{t("resize.reset")}</button>
            </div>
          )}
          {result && (
            <ResultPreview
              originalUrl={result.originalUrl}
              resultUrl={result.resultUrl}
              originalSize={result.originalSize}
              resultSize={result.resultSize}
              fileName={`resized_${width}x${height}.png`}
              onReset={reset}
            />
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
