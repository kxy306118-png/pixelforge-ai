"use client";
import { useState } from "react";
import Link from "next/link";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function SpeechToTextPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("auto");
  const [task, setTask] = useState("transcribe");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleTranscribe = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("language", language);
      fd.append("task", task);
      const res = await fetch("/api/speech-to-text", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Transcription failed"); }
      const data = await res.json();
      setResult(data.text || "No text returned");
    } catch (e: any) {
      setError(e.message || "Transcription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("stt.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("stt.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("stt.upload_label")}</label>
            <FileUpload onFileSelect={(f) => { setFile(f); setResult(""); setError(""); }} accept="audio/*,video/*" maxSizeMB={500} selectedFile={file} />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("stt.language")}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base">
                <option value="auto">Auto-detect</option>
                <option value="en">English</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("stt.task")}</label>
              <select value={task} onChange={(e) => setTask(e.target.value)} className="input-base">
                <option value="transcribe">Transcribe</option>
                <option value="translate">Translate to English</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleTranscribe} disabled={!file || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("stt.transcribing") : <>{t("stt.transcribing").split("...")[0]}</>}
            </button>
            {!file && <p className="mt-2 text-xs text-[#8888a0]">{t("stt.no_file_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("stt.transcribing")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {result && (
            <div className="card">
              <pre className="whitespace-pre-wrap text-[#e8e8f0] text-sm leading-relaxed font-sans">{result}</pre>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)} className="btn-secondary text-sm">Copy</button>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-bold text-[#e8e8f0] mb-2">{t("stt.tips_title")}</h3>
            <div className="space-y-1 text-sm text-[#8888a0]">
              <p>{t("stt.tip1")}</p>
              <p>{t("stt.tip2")}</p>
              <p>{t("stt.tip3")}</p>
              <p>{t("stt.tip4")}</p>
            </div>
          </div>

          <div className="text-center text-sm text-[#8888a0]">
            {t("stt.also_try")} <Link href="/tools/text-to-speech" className="text-violet-400 hover:underline">{t("stt.reverse_link")}</Link> ({t("stt.reverse_desc")})
          </div>
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
