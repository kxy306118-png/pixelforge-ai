"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function AiImageGenPage() {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("auto");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setImageUrl("");
    try {
      const res = await fetch("/api/ai-image-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, size }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Generation failed"); }
      const data = await res.json();
      if (data.url) { setImageUrl(data.url); } else { throw new Error("No image returned"); }
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("imggen.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("imggen.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {/* Prompt */}
          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("imggen.prompt_label")}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("imggen.prompt_ph")}
              className="input-base resize-y min-h-[140px]"
            />
            <p className="mt-1 text-xs text-[#8888a0]">{t("imggen.prompt_tip")}</p>
          </div>

          {/* Style + Size */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("imggen.style")}</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-base">
                <option value="auto">Auto</option>
                <option value="realistic">Photorealistic</option>
                <option value="anime">Anime</option>
                <option value="illustration">Illustration</option>
                <option value="3d">3D Render</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("imggen.size")}</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="input-base">
                <option value="1024x1024">1024 × 1024</option>
                <option value="1024x768">1024 × 768</option>
                <option value="768x1024">768 × 1024</option>
                <option value="1536x1024">1536 × 1024 (HD)</option>
              </select>
            </div>
          </div>

          {/* Generate button */}
          <div className="text-center">
            <button onClick={handleGenerate} disabled={!prompt.trim() || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("imggen.generating") : <><Sparkles className="h-5 w-5" /> {t("imggen.generate")}</>}
            </button>
            {!prompt.trim() && <p className="mt-2 text-xs text-[#8888a0]">{t("imggen.no_prompt_tip")}</p>}
          </div>

          {/* Result */}
          {loading && <ProcessingIndicator message={t("imggen.generating")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {imageUrl && (
            <div className="text-center">
              <img src={imageUrl} alt="Generated" className="mx-auto max-w-full rounded-2xl border border-[#2a2a40]" />
              <a href={imageUrl} download className="btn-primary mt-4 inline-flex"><Sparkles className="h-4 w-4" /> {t("result.download")}</a>
            </div>
          )}

          {/* Tips */}
          <div className="card">
            <h3 className="font-bold text-[#e8e8f0] mb-2">{t("imggen.tips_title")}</h3>
            <div className="space-y-1 text-sm text-[#8888a0]">
              <p>{t("imggen.tip1")}</p>
              <p>{t("imggen.tip2")}</p>
              <p>{t("imggen.tip3")}</p>
              <p>{t("imggen.tip4")}</p>
            </div>
          </div>
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
