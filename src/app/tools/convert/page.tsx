"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";

const formats = [
  { label: "PNG", value: "png" },
  { label: "JPEG", value: "jpeg" },
  { label: "WebP", value: "webp" },
  { label: "AVIF", value: "avif" },
];

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("png");
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
      fd.append("format", format);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) throw new Error("转换失败");
      const blob = await res.blob();
      setResult({ originalUrl: URL.createObjectURL(f), resultUrl: URL.createObjectURL(blob) });
    } catch (e: any) {
      setError(e.message || "转换失败，请重试");
    } finally {
      setProcessing(false);
    }
  }, [format]);

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">格式转换</span></h1>
        <p className="mt-3 text-[#8888a0]">PNG、JPG、WebP、AVIF 格式互转，完全免费</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {!result && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-[#8888a0] font-semibold">目标格式：</span>
              {formats.map((f) => (
                <button key={f.value} onClick={() => setFormat(f.value)} className={format === f.value ? "btn-option active" : "btn-option"}>
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {!file && !result && <ImageUpload onImageSelect={processImage} />}
          {processing && <ProcessingIndicator message="正在转换格式..." />}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={reset} className="btn-primary">重新上传</button>
            </div>
          )}
          {result && (
            <ResultPreview originalUrl={result.originalUrl} resultUrl={result.resultUrl} fileName={`converted.${format}`} onReset={reset} />
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
