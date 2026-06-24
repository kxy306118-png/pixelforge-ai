"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function ImageToTextPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("language", language);
      const res = await fetch("/api/image-to-text", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "OCR failed"); }
      const data = await res.json();
      setResult(data.text || "No text found");
    } catch (e: any) {
      setError(e.message || "OCR failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("itt.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("itt.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          <div>
            <ImageUpload onImageSelect={(f) => { setFile(f); setResult(""); setError(""); }} />
          </div>

          <div className="flex items-center justify-center gap-4">
            <label className="text-sm font-semibold text-[#e8e8f0]">{t("itt.lang_label")}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base w-48">
              <option value="auto">Auto-detect</option>
              <option value="en">English</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div className="text-center">
            <button onClick={handleExtract} disabled={!file || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("itt.extracting") : <>{t("itt.extract")}</>}
            </button>
            {!file && <p className="mt-2 text-xs text-[#8888a0]">{t("itt.no_file_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("itt.extracting")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {result && (
            <div className="card">
              <pre className="whitespace-pre-wrap text-[#e8e8f0] text-sm leading-relaxed font-sans">{result}</pre>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)} className="btn-secondary text-sm">Copy</button>
              </div>
            </div>
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
