"use client";
import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ResultPreview } from "@/components/result-preview";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";

const presets = [
  { label: "自定义", w: "", h: "" },
  { label: "微信头像", w: "640", h: "640" },
  { label: "手机壁纸", w: "1080", h: "1920" },
  { label: "电脑壁纸", w: "1920", h: "1080" },
  { label: "头像 1:1", w: "800", h: "800" },
];

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalUrl: string; resultUrl: string } | null>(null);
  const [error, setError] = useState("");

  const applyPreset = (w: string, h: string) => { setWidth(w); setHeight(h); };

  const processImage = useCallback(async (f: File) => {
    if (!width || !height) { setError("请输入宽度和高度"); return; }
    setFile(f);
    setProcessing(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", f);
      fd.append("width", width);
      fd.append("height", height);
      const res = await fetch("/api/resize", { method: "POST", body: fd });
      if (!res.ok) throw new Error("缩放失败");
      const blob = await res.blob();
      setResult({ originalUrl: URL.createObjectURL(f), resultUrl: URL.createObjectURL(blob) });
    } catch (e: any) {
      setError(e.message || "缩放失败，请重试");
    } finally {
      setProcessing(false);
    }
  }, [width, height]);

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">图片缩放</span></h1>
        <p className="mt-3 text-[#8888a0]">调整图片尺寸，支持预设和自定义像素</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {!result && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-[#8888a0] font-semibold mr-1">预设：</span>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className={width === p.w && height === p.h ? "btn-option active" : "btn-option"}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <input
                  type="number"
                  placeholder="宽度"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-28 rounded-xl border border-[#1e1e30] bg-[#12121e] px-4 py-2.5 text-sm text-[#e8e8f0] text-center focus:border-violet-500 focus:outline-none"
                />
                <span className="text-[#55556a] font-bold">×</span>
                <input
                  type="number"
                  placeholder="高度"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-28 rounded-xl border border-[#1e1e30] bg-[#12121e] px-4 py-2.5 text-sm text-[#e8e8f0] text-center focus:border-violet-500 focus:outline-none"
                />
                <span className="text-xs text-[#55556a]">px</span>
              </div>
            </>
          )}

          {!file && !result && <ImageUpload onImageSelect={processImage} />}
          {processing && <ProcessingIndicator message="正在缩放图片..." />}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={reset} className="btn-primary">重新上传</button>
            </div>
          )}
          {result && (
            <ResultPreview originalUrl={result.originalUrl} resultUrl={result.resultUrl} fileName="resized.png" onReset={reset} />
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
