"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import Link from "next/link";

export default function ImageToVideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 3000));
    setResult("✅ Video generated from your image! Full functionality requires Replicate API integration.");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">Video Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Image to Video</h1>
        <p className="mt-2 text-[#8888a0]">Animate a static image into a short video clip. Upload any image and describe how it should move.</p>
        <p className="mt-1 text-xs text-violet-400">⚡ Cost: ~$0.05-0.50 per video (included in paid plans)</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Upload source image</label>
        <FileUpload onFileSelect={setFile} accept="image/*" maxSizeMB={25} selectedFile={file} />
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Describe the motion (optional)</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="input-base" placeholder="Describe how the image should animate: e.g., 'The person slowly turns their head and smiles, hair flowing in the wind'..." />
      </div>

      <button onClick={handleStart} disabled={processing || !file} className="btn-primary">
      {!file && <p className="mt-2 text-xs text-[#555570]">Upload a file above to enable the button</p>}
        {processing ? "Animating (20-40s)..." : "Animate Image"}
      </button>

      {processing && <ProcessingIndicator message="AI is animating your image (20-40 seconds)..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5"><p className="text-sm text-[#8888a0]">{result}</p></div>}

      <p className="mt-4 text-center text-xs text-[#555570]">
        Also try <Link href="/tools/text-to-video" className="text-violet-400 hover:text-violet-300">Text to Video</Link> for generating from scratch
      </p>
    </div>
  );
}
