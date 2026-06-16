"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";

export default function EnhancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalUrl: string; resultUrl: string } | null>(null);
  const [error, setError] = useState("");

  const processImage = useCallback(async (f: File) => {
    setFile(f);
    setProcessing(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/upscale", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json().catch(() => ({ error: "处理失败，请稍后重试" }));
        throw new Error(d.error || "处理失败");
      }
      const blob = await res.blob();
      setResult({ originalUrl: URL.createObjectURL(f), resultUrl: URL.createObjectURL(blob) });
    } catch (e: any) {
      setError(e.message || "处理失败，请重试");
    } finally {
      setProcessing(false);
    }
  }, []);

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black">AI <span className="gradient-text">图片增强</span></h1>
        <p className="mt-3 text-[#8888a0]">AI 修复老照片、模糊照片，自动增强清晰度</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div>
          {!file && !result && <ImageUpload onImageSelect={processImage} />}
          {processing && <ProcessingIndicator message="AI 正在增强图片..." />}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={reset} className="btn-primary">重新上传</button>
            </div>
          )}
          {result && (
            <ResultPreview originalUrl={result.originalUrl} resultUrl={result.resultUrl} fileName="enhanced.png" onReset={reset} />
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
