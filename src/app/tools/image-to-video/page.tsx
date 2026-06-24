"use client";
import { useState } from "react";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function ImageToVideoPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [motion, setMotion] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleAnimate = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setVideoUrl("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      if (motion.trim()) fd.append("motion", motion);
      const res = await fetch("/api/image-to-video", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Animation failed"); }
      const data = await res.json();
      if (data.url) { setVideoUrl(data.url); } else { throw new Error("No video returned"); }
    } catch (e: any) {
      setError(e.message || "Animation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("itv.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("itv.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("itv.upload_label")}</label>
            <ImageUpload onImageSelect={(f) => { setFile(f); setVideoUrl(""); setError(""); }} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("itv.motion_label")}</label>
            <textarea value={motion} onChange={(e) => setMotion(e.target.value)} placeholder={t("itv.motion_ph")} className="input-base resize-y min-h-[100px]" />
          </div>

          <div className="text-center">
            <button onClick={handleAnimate} disabled={!file || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("itv.animating") : <>{t("itv.animate")}</>}
            </button>
            {!file && <p className="mt-2 text-xs text-[#8888a0]">{t("itv.no_file_tip")}</p>}
          </div>

          {loading && <ProcessingIndicator message={t("itv.animating")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {videoUrl && (
            <div className="card text-center">
              <video controls src={videoUrl} className="mx-auto max-w-full rounded-xl" />
              <a href={videoUrl} download="animation.mp4" className="btn-primary mt-4 inline-flex text-sm">{t("result.download")}</a>
            </div>
          )}

          <div className="text-center text-sm text-[#8888a0]">
            {t("itv.also_try")} <Link href="/tools/text-to-video" className="text-violet-400 hover:underline">{t("itv.from_scratch")}</Link>
          </div>
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
