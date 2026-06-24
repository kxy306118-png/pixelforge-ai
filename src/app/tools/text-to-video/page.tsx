"use client";
import { useState } from "react";
import Link from "next/link";
import { Video } from "lucide-react";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function TextToVideoPage() {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setVideoUrl("");
    try {
      const res = await fetch("/api/text-to-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, duration, style }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Video generation failed"); }
      const data = await res.json();
      if (data.url) { setVideoUrl(data.url); } else { throw new Error("No video returned"); }
    } catch (e: any) {
      setError(e.message || "Video generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("ttv.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("ttv.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {/* Premium notice */}
          <div className="card border-violet-500/30 bg-violet-500/5 text-center">
            <span className="inline-block rounded-full bg-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">{t("ttv.premium")}</span>
            <p className="text-sm text-[#e8e8f0]">{t("ttv.premium_notice")}</p>
            <p className="mt-1 text-xs text-[#8888a0]">{t("ttv.premium_desc")}</p>
            <Link href="/pricing" className="btn-primary mt-3 inline-flex text-sm">{t("ttv.view_plans")}</Link>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("ttv.prompt_label")}</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t("ttv.prompt_tip")} className="input-base resize-y min-h-[120px]" />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("ttv.duration")}</label>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="input-base">
                <option value={3}>3s</option>
                <option value={5}>5s</option>
                <option value={10}>10s</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("ttv.style")}</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-base">
                <option value="auto">Auto</option>
                <option value="realistic">Realistic</option>
                <option value="anime">Anime</option>
                <option value="3d">3D Render</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleGenerate} disabled={!prompt.trim() || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("ttv.generating") : <><Video className="h-5 w-5" /> {t("ttv.generate")}</>}
            </button>
            {!prompt.trim() && <p className="mt-2 text-xs text-[#8888a0]">{t("ttv.no_prompt_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("ttv.generating")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {videoUrl && (
            <div className="card text-center">
              <video controls src={videoUrl} className="mx-auto max-w-full rounded-xl" />
              <a href={videoUrl} download="video.mp4" className="btn-primary mt-4 inline-flex text-sm">{t("result.download")}</a>
            </div>
          )}

          <div className="text-center text-sm text-[#8888a0]">
            {t("ttv.need_more")} <Link href="/tools/image-to-video" className="text-violet-400 hover:underline">{t("ttv.image_to_video")}</Link> {t("ttv.or")} <Link href="/tools/video-subtitle" className="text-violet-400 hover:underline">{t("ttv.subtitles")}</Link>
          </div>
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
