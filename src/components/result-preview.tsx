"use client";

import { Download, RotateCcw, ArrowRightLeft } from "lucide-react";

interface ResultPreviewProps {
  originalUrl: string;
  resultUrl: string;
  resultBlob?: Blob;
  fileName?: string;
  onReset?: () => void;
  originalSize?: string;
  resultSize?: string;
}

export function ResultPreview({ originalUrl, resultUrl, resultBlob, fileName = "result", onReset, originalSize, resultSize }: ResultPreviewProps) {
  const download = () => {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Size comparison */}
      {originalSize && resultSize && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-[#8888a0]">原图: <span className="font-bold text-[#e8e8f0]">{originalSize}</span></span>
          <ArrowRightLeft className="h-4 w-4 text-violet-400" />
          <span className="text-[#8888a0]">处理后: <span className="font-bold text-emerald-400">{resultSize}</span></span>
        </div>
      )}

      {/* Images side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1e1e30] bg-[#12121e] p-3">
          <p className="text-xs font-semibold text-[#8888a0] mb-2">原图</p>
          <img src={originalUrl} alt="原图" className="w-full rounded-lg object-contain max-h-72" />
        </div>
        <div className="rounded-xl border border-violet-500/30 bg-[#12121e] p-3">
          <p className="text-xs font-semibold text-violet-400 mb-2">处理后</p>
          <img src={resultUrl} alt="处理后" className="w-full rounded-lg object-contain max-h-72" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={download} className="btn-primary text-base px-8 py-3">
          <Download className="h-4 w-4" /> 下载图片
        </button>
        {onReset && (
          <button onClick={onReset} className="btn-secondary text-sm px-6 py-3">
            <RotateCcw className="h-4 w-4" /> 处理另一张
          </button>
        )}
      </div>
    </div>
  );
}
