"use client";
import { useState } from "react";
import { PenLine } from "lucide-react";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { AdSidebar } from "@/components/ads";
import { useI18n } from "@/lib/i18n";

export default function AiWriterPage() {
  const { t } = useI18n();
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("marketing");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/ai-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, type, tone }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Writing failed"); }
      const data = await res.json();
      setResult(data.text || "No result returned");
    } catch (e: any) {
      setError(e.message || "Writing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black"><span className="gradient-text">{t("writer.title")}</span></h1>
        <p className="mt-3 text-[#8888a0]">{t("writer.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("writer.topic_label")}</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., A new AI-powered photo editing app for mobile..."
              className="input-base resize-y min-h-[120px]"
            />
          </div>

          {/* Type + Tone */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("writer.type")}</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-base">
                <option value="marketing">Marketing Copy</option>
                <option value="product">Product Description</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="blog">Blog Post</option>
                <option value="ad">Ad Copy</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[#e8e8f0] mb-2">{t("writer.tone")}</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-base">
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="playful">Playful</option>
                <option value="luxury">Luxury</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Generate */}
          <div className="text-center">
            <button onClick={handleGenerate} disabled={!topic.trim() || loading} className="btn-primary text-base px-8 py-3">
              {loading ? t("writer.writing") : <><PenLine className="h-5 w-5" /> {t("writer.generate")}</>}
            </button>
            {!topic.trim() && <p className="mt-2 text-xs text-[#8888a0]">{t("writer.no_topic_tip")}</p>}
          </div>

          {/* Result */}
          {loading && <ProcessingIndicator message={t("writer.writing")} />}
          {error && <div className="text-center text-red-400">{error}</div>}
          {result && (
            <div className="card">
              <div className="whitespace-pre-wrap text-[#e8e8f0] text-sm leading-relaxed">{result}</div>
            </div>
          )}
        </div>
        <AdSidebar />
      </div>
    </div>
  );
}
