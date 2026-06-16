"use client";
import { useState } from "react";
import { ProcessingIndicator } from "@/components/processing-indicator";

export default function AiWriterPage() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("product-description");
  const [tone, setTone] = useState("professional");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!topic.trim()) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult(`✅ Copy generated! Full functionality requires LLM API integration.\n\n--- Sample Output ---\n\n${topic}\n\nProfessional marketing copy tailored to your specifications would appear here, ready to copy and use in your campaigns.`);
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3">Text Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">AI Copywriter</h1>
        <p className="mt-2 text-[#8888a0]">Generate marketing copy, product descriptions, social captions, and more with AI.</p>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">What do you want to write?</label>
        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={5} className="input-base" placeholder="Describe your product, service, or topic. For example: 'A wireless Bluetooth speaker with 20-hour battery life, waterproof, under $50. Target audience: young professionals who love outdoor activities.'" />
      </div>

      <div className="grid gap-4 grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Content type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-base">
            <option value="product-description">Product Description</option>
            <option value="social-post">Social Media Post</option>
            <option value="ad-copy">Ad Copy</option>
            <option value="email">Email Newsletter</option>
            <option value="blog-intro">Blog Introduction</option>
            <option value="seo-title">SEO Title & Meta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-base">
            <option value="professional">Professional</option>
            <option value="casual">Casual & Friendly</option>
            <option value="persuasive">Persuasive</option>
            <option value="humorous">Humorous</option>
            <option value="luxury">Luxury & Premium</option>
            <option value="urgent">Urgent / FOMO</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !topic.trim()} className="btn-primary">
      {!topic.trim() && <p className="mt-2 text-xs text-[#555570]">Enter a topic above to enable the button</p>}
        {processing ? "Writing..." : "Generate Copy"}
      </button>

      {processing && <ProcessingIndicator message="AI is crafting your copy..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5 whitespace-pre-line"><p className="text-sm text-[#8888a0]">{result}</p></div>}
    </div>
  );
}
