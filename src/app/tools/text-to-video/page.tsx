"use client";
import { useState } from "react";
import { ProcessingIndicator } from "@/components/processing-indicator";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

export default function TextToVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5");
  const [style, setStyle] = useState("cinematic");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!prompt.trim()) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 3000));
    setResult("✅ Video generation is a premium feature. Upgrade to a paid plan to unlock AI video creation!");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">Video Tool · AI</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
            <Lock className="h-3 w-3" /> Premium
          </span>
        </div>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Text to Video</h1>
        <p className="mt-2 text-[#8888a0]">Generate short videos from text descriptions using AI. Powered by Tencent Hunyuan Video.</p>
      </div>

      <div className="card mb-6 border-violet-500/20 bg-violet-500/5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#e8e8f0]">This is a premium tool</p>
            <p className="text-xs text-[#8888a0] mt-1">Type a prompt below to preview the interface. To actually generate videos, upgrade to a paid plan.</p>
            <Link href="/pricing" className="inline-block mt-2 text-xs font-bold text-violet-400 hover:text-violet-300">View plans →</Link>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Describe the video you want</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} className="input-base" placeholder="A golden retriever running on a sandy beach at sunset, cinematic camera tracking shot, warm lighting, 4K quality..." />
        <p className="mt-1 text-xs text-[#555570]">Be specific: describe the scene, camera movement, lighting, and style. Under 80 words works best.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input-base">
            <option value="3">3 seconds</option>
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-base">
            <option value="cinematic">Cinematic</option>
            <option value="anime">Anime</option>
            <option value="realistic">Realistic</option>
            <option value="watercolor">Watercolor</option>
            <option value="3d">3D Render</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !prompt.trim()} className="btn-primary">
        {processing ? "Generating (30-60s)..." : <><Sparkles className="h-4 w-4" /> Generate Video</>}
      </button>
      {!prompt.trim() && <p className="mt-2 text-xs text-[#555570]">Enter a description above to enable the button</p>}

      {processing && <ProcessingIndicator message="AI is creating your video (this may take 30-60 seconds)..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5"><p className="text-sm text-[#8888a0]">{result}</p></div>}

      <div className="mt-8 card">
        <h3 className="font-bold text-[#e8e8f0] mb-2">💡 Tips for better videos</h3>
        <ul className="text-sm text-[#8888a0] space-y-1">
          <li>• Be specific about the scene, camera angle, and lighting</li>
          <li>• Include motion descriptions: "slow zoom", "tracking shot", "pan left"</li>
          <li>• Start with short clips (3-5 seconds) to test your prompts</li>
          <li>• Same prompt gives different results each time — generate multiple variants</li>
        </ul>
      </div>

      <p className="mt-4 text-center text-xs text-[#555570]">
        Need more video tools? Try <Link href="/tools/image-to-video" className="text-violet-400 hover:text-violet-300">Image to Video</Link> or <Link href="/tools/video-subtitle" className="text-violet-400 hover:text-violet-300">Auto Subtitles</Link>
      </p>
    </div>
  );
}
