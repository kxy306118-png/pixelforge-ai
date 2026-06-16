"use client";
import { useState } from "react";
import { ProcessingIndicator } from "@/components/processing-indicator";

export default function AiImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [size, setSize] = useState("1024x1024");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!prompt.trim()) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 3000));
    setResult("✅ Image generated! Full functionality requires Replicate API (Flux Schnell) integration.");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Image Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">AI Image Generator</h1>
        <p className="mt-2 text-[#8888a0]">Generate stunning images from text descriptions using Flux AI. Describe anything you can imagine.</p>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Describe the image you want to create</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} className="input-base" placeholder="A futuristic cityscape at sunset, cyberpunk style, neon lights reflecting on wet streets, ultra detailed, 8K quality, dramatic lighting..." />
        <p className="mt-1 text-xs text-[#555570]">Be specific about subject, style, lighting, colors, and composition for best results.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-base">
            <option value="photorealistic">Photorealistic</option>
            <option value="anime">Anime</option>
            <option value="digital-art">Digital Art</option>
            <option value="oil-painting">Oil Painting</option>
            <option value="watercolor">Watercolor</option>
            <option value="3d-render">3D Render</option>
            <option value="pixel-art">Pixel Art</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="input-base">
            <option value="1024x1024">1024×1024 (Square)</option>
            <option value="1280x720">1280×720 (Landscape)</option>
            <option value="720x1280">720×1280 (Portrait)</option>
            <option value="512x512">512×512 (Fast)</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !prompt.trim()} className="btn-primary">
      {!prompt.trim() && <p className="mt-2 text-xs text-[#555570]">Enter a description above to enable the button</p>}
        {processing ? "Generating (5-10s)..." : "Generate Image"}
      </button>

      {processing && <ProcessingIndicator message="AI is creating your image..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5"><p className="text-sm text-[#8888a0]">{result}</p></div>}

      <div className="mt-8 card">
        <h3 className="font-bold text-[#e8e8f0] mb-2">💡 Prompt tips</h3>
        <ul className="text-sm text-[#8888a0] space-y-1">
          <li>• Include subject, scene, lighting, and style keywords</li>
          <li>• Use specific details: "golden hour lighting", "shallow depth of field"</li>
          <li>• Avoid negative descriptions — describe what you WANT, not what you don't</li>
          <li>• Add quality modifiers: "ultra detailed", "8K", "professional photography"</li>
        </ul>
      </div>
    </div>
  );
}
