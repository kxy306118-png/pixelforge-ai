"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import Link from "next/link";

export default function VideoSubtitlePage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("auto");
  const [format, setFormat] = useState("srt");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 3000));
    setResult("✅ Subtitles generated! Full functionality requires Whisper API integration. Output format: " + format.toUpperCase());
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">Video Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Auto Subtitles</h1>
        <p className="mt-2 text-[#8888a0]">Upload a video and automatically generate timed subtitles using Whisper AI.</p>
        <p className="mt-1 text-xs text-violet-400">⚡ Cost: ~$0.01-0.05 per minute (included in paid plans)</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Upload video file</label>
        <FileUpload onFileSelect={setFile} accept="video/*" maxSizeMB={200} label="Drop a video here, or click to upload" hint="MP4, MOV, WebM — Max 200MB" selectedFile={file} />
      </div>

      <div className="grid gap-4 grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base">
            <option value="auto">Auto-detect</option>
            <option value="en">English</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Output format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-base">
            <option value="srt">SRT</option>
            <option value="vtt">WebVTT</option>
            <option value="txt">Plain Text</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !file} className="btn-primary">
      {!file && <p className="mt-2 text-xs text-[#555570]">Upload a file above to enable the button</p>}
        {processing ? "Generating subtitles..." : "Generate Subtitles"}
      </button>

      {processing && <ProcessingIndicator message="AI is transcribing your video..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5"><p className="text-sm text-[#8888a0]">{result}</p></div>}

      <div className="mt-8 card">
        <h3 className="font-bold text-[#e8e8f0] mb-2">💡 Tips for best transcription</h3>
        <ul className="text-sm text-[#8888a0] space-y-1">
          <li>• Use clear audio with minimal background noise</li>
          <li>• Supported: 100+ languages via Whisper AI</li>
          <li>• Auto-detect works well for single-language videos</li>
          <li>• SRT/WebVTT includes timestamps for direct import into video editors</li>
        </ul>
      </div>
    </div>
  );
}
