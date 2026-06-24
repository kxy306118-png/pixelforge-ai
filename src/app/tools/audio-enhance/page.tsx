"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function AudioEnhancePage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [enhanceType, setEnhanceType] = useState("full");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const handleEnhance = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setAudioUrl("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", enhanceType);
      const res = await fetch("/api/audio-enhance", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Enhancement failed"); }
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message || "Enhancement failed");
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { value: "noise", labelKey: "ae.noise" },
    { value: "voice", labelKey: "ae.voice_enhance" },
    { value: "loudness", labelKey: "ae.loudness" },
    { value: "full", labelKey: "ae.full" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("ae.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("ae.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("ae.upload_label")}</label>
            <FileUpload onFileSelect={(f) => { setFile(f); setAudioUrl(""); setError(""); }} accept="audio/*" maxSizeMB={100} selectedFile={file} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("ae.type_label")}</label>
            <div className="flex flex-wrap gap-2">
              {types.map((tp) => (
                <button key={tp.value} onClick={() => setEnhanceType(tp.value)} className={`btn-option ${enhanceType === tp.value ? "active" : ""}`}>{t(tp.labelKey)}</button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleEnhance} disabled={!file || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("ae.enhancing") : <>{t("ae.enhance")}</>}
            </button>
            {!file && <p className="mt-2 text-xs text-[#8888a0]">{t("ae.no_file_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("ae.enhancing")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {audioUrl && (
            <div className="card text-center">
              <audio controls src={audioUrl} className="mx-auto w-full max-w-lg" />
              <a href={audioUrl} download="enhanced.mp3" className="btn-primary mt-4 inline-flex text-sm">{t("result.download")}</a>
            </div>
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
