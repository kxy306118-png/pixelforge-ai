"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function VideoSubtitlePage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("auto");
  const [outputFormat, setOutputFormat] = useState("srt");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const fd = new FormData();
      fd.append("video", file);
      fd.append("language", language);
      fd.append("format", outputFormat);
      const res = await fetch("/api/video-subtitle", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Subtitle generation failed"); }
      const data = await res.json();
      setResult(data.subtitles || "No subtitles generated");
    } catch (e: any) {
      setError(e.message || "Subtitle generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("vs.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("vs.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("vs.upload_label")}</label>
            <FileUpload onFileSelect={(f) => { setFile(f); setResult(""); setError(""); }} accept="video/*" maxSizeMB={500} selectedFile={file} />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("vs.language")}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base">
                <option value="auto">Auto-detect</option>
                <option value="en">English</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("vs.output_format")}</label>
              <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="input-base">
                <option value="srt">SRT</option>
                <option value="vtt">VTT</option>
                <option value="txt">TXT</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleGenerate} disabled={!file || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("vs.generating") : <>{t("vs.generate")}</>}
            </button>
            {!file && <p className="mt-2 text-xs text-[#8888a0]">{t("vs.no_file_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("vs.generating")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {result && (
            <div className="card">
              <pre className="whitespace-pre-wrap text-[#e8e8f0] text-sm leading-relaxed font-sans max-h-[400px] overflow-y-auto">{result}</pre>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)} className="btn-secondary text-sm">Copy</button>
                <button onClick={() => { const blob = new Blob([result], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `subtitles.${outputFormat}`; a.click(); URL.revokeObjectURL(url); }} className="btn-primary text-sm">{t("result.download")}</button>
              </div>
            </div>
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
