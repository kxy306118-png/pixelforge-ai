"use client";
import { useI18n } from "@/lib/i18n";

interface ResultPreviewProps {
  originalUrl: string;
  resultUrl: string;
  originalSize: string;
  resultSize: string;
  fileName: string;
  onReset: () => void;
}

export function ResultPreview({ originalUrl, resultUrl, originalSize, resultSize, fileName, onReset }: ResultPreviewProps) {
  const { t } = useI18n();
  const savings = ((1 - parseFloat(resultSize) / parseFloat(originalSize)) * 100).toFixed(1);
  const savingsPositive = parseFloat(savings) > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card text-center">
          <p className="text-xs font-semibold text-[#8888a0] mb-3 uppercase tracking-wider">{t("result.original")}</p>
          <img src={originalUrl} alt="Original" className="mx-auto max-h-64 rounded-xl border border-[#2a2a40]" />
          <p className="mt-2 text-sm text-[#8888a0]">{originalSize}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs font-semibold text-[#8888a0] mb-3 uppercase tracking-wider">{t("result.processed")}</p>
          <img src={resultUrl} alt="Processed" className="mx-auto max-h-64 rounded-xl border border-[#2a2a40]" />
          <p className="mt-2 text-sm text-[#8888a0]">{resultSize}</p>
          {savingsPositive && <p className="mt-1 text-xs font-bold text-emerald-400">-{savings}%</p>}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <a href={resultUrl} download={fileName} className="btn-primary">{t("result.download")}</a>
        <button onClick={onReset} className="btn-secondary">{t("result.process_another")}</button>
      </div>
    </div>
  );
}
