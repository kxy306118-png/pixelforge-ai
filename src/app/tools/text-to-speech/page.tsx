"use client";
import { useState } from "react";
import Link from "next/link";
import { Volume2 } from "lucide-react";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function TextToSpeechPage() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!text.trim()) return;
    if (text.length > 5000) return;
    setLoading(true);
    setError("");
    setAudioUrl("");
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "TTS failed"); }
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message || "TTS failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("tts.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("tts.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("tts.enter_text")}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              maxLength={5000}
              className="input-base resize-y min-h-[140px]"
            />
            <p className="mt-1 text-xs text-[#8888a0]">{t("tts.char_count").replace("{count}", String(text.length))}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("tts.voice")}</label>
              <select value={voice} onChange={(e) => setVoice(e.target.value)} className="input-base">
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="fable">Fable</option>
                <option value="onyx">Onyx</option>
                <option value="nova">Nova</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("tts.speed")}</label>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="input-base">
                <option value={0.5}>0.5×</option>
                <option value={0.75}>0.75×</option>
                <option value={1}>1×</option>
                <option value={1.25}>1.25×</option>
                <option value={1.5}>1.5×</option>
                <option value={2}>2×</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleGenerate} disabled={!text.trim() || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("tts.generating") : <><Volume2 className="h-5 w-5" /> {t("tts.generate")}</>}
            </button>
            {!text.trim() && <p className="mt-2 text-xs text-[#8888a0]">{t("tts.no_text_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("tts.generating")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {audioUrl && (
            <div className="card text-center">
              <audio controls src={audioUrl} className="mx-auto w-full max-w-lg" />
              <a href={audioUrl} download="speech.mp3" className="btn-primary mt-4 inline-flex text-sm">{t("result.download")}</a>
            </div>
          )}

          <div className="text-center text-sm text-[#8888a0]">
            {t("tts.also_try")} <Link href="/tools/speech-to-text" className="text-violet-400 hover:underline">{t("tts.reverse_link")}</Link> ({t("tts.reverse_desc")})
          </div>
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
