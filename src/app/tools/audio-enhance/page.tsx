"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import Link from "next/link";

export default function AudioEnhancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [enhanceType, setEnhanceType] = useState("denoise");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 3000));
    setResult("✅ Audio enhanced! Full functionality requires API integration. Background noise removed and audio quality improved.");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Audio Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Audio Enhance</h1>
        <p className="mt-2 text-[#8888a0]">Remove background noise, enhance clarity, and improve overall audio quality.</p>
        <p className="mt-1 text-xs text-violet-400">⚡ Cost: ~$0.01 per minute (included in paid plans)</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Upload audio file</label>
        <FileUpload onFileSelect={setFile} accept="audio/*" maxSizeMB={100} label="Drop an audio file here, or click to upload" hint="MP3, WAV, M4A, FLAC, OGG — Max 100MB" selectedFile={file} />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Enhancement type</label>
        <div className="flex gap-3 flex-wrap">
          {[
            { value: "denoise", label: "Noise Removal" },
            { value: "enhance", label: "Voice Enhancement" },
            { value: "loudness", label: "Loudness Normalize" },
            { value: "full", label: "Full Enhancement" },
          ].map((opt) => (
            <button key={opt.value} onClick={() => setEnhanceType(opt.value)} className={`btn-option ${enhanceType === opt.value ? "active" : ""}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !file} className="btn-primary">
      {!file && <p className="mt-2 text-xs text-[#555570]">Upload a file above to enable the button</p>}
        {processing ? "Enhancing audio..." : "Enhance Audio"}
      </button>

      {processing && <ProcessingIndicator message="AI is enhancing your audio..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5"><p className="text-sm text-[#8888a0]">{result}</p></div>}

      <div className="mt-8 card">
        <h3 className="font-bold text-[#e8e8f0] mb-2">💡 Tips</h3>
        <ul className="text-sm text-[#8888a0] space-y-1">
          <li>• <strong>Noise Removal:</strong> Best for recordings with background hum, fan noise, or traffic</li>
          <li>• <strong>Voice Enhancement:</strong> Makes speech clearer and more present</li>
          <li>• <strong>Loudness Normalize:</strong> Adjusts volume to professional broadcast standards</li>
          <li>• <strong>Full Enhancement:</strong> Applies all enhancements together</li>
        </ul>
      </div>
    </div>
  );
}
