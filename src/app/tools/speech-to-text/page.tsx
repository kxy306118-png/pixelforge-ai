"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";
import Link from "next/link";

export default function SpeechToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("auto");
  const [task, setTask] = useState("transcribe");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 3000));
    setResult("✅ Transcription complete! Full functionality requires Whisper API integration.\n\nSample output:\n[00:00] Hello, welcome to this demonstration.\n[00:05] The speech-to-text tool converts audio files into accurate text.\n[00:10] It supports over 100 languages and automatic detection.");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Audio Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Speech to Text</h1>
        <p className="mt-2 text-[#8888a0]">Transcribe audio and video files to text with high accuracy. Powered by Whisper AI.</p>
        <p className="mt-1 text-xs text-violet-400">⚡ Cost: ~$0.01-0.05 per minute (included in paid plans)</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Upload audio or video file</label>
        <FileUpload onFileSelect={setFile} accept="audio/*,video/*" maxSizeMB={200} label="Drop an audio/video file here, or click to upload" hint="MP3, WAV, M4A, FLAC, MP4 — Max 200MB" selectedFile={file} />
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
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Task</label>
          <select value={task} onChange={(e) => setTask(e.target.value)} className="input-base">
            <option value="transcribe">Transcribe (same language)</option>
            <option value="translate">Translate to English</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !file} className="btn-primary">
      {!file && <p className="mt-2 text-xs text-[#555570]">Upload a file above to enable the button</p>}
        {processing ? "Transcribing..." : "Start Transcription"}
      </button>

      {processing && <ProcessingIndicator message="AI is transcribing your audio..." />}
      {result && (
        <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5">
          <p className="text-sm text-[#8888a0] whitespace-pre-line">{result}</p>
        </div>
      )}

      <div className="mt-8 card">
        <h3 className="font-bold text-[#e8e8f0] mb-2">💡 Tips for best results</h3>
        <ul className="text-sm text-[#8888a0] space-y-1">
          <li>• Record at 16kHz or higher for best accuracy</li>
          <li>• Minimize background noise for clearer transcription</li>
          <li>• Supports 100+ languages with auto-detection</li>
          <li>• "Translate to English" converts any language to English text</li>
        </ul>
      </div>

      <p className="mt-4 text-center text-xs text-[#555570]">
        Also try <Link href="/tools/text-to-speech" className="text-violet-400 hover:text-violet-300">Text to Speech</Link> for the reverse
      </p>
    </div>
  );
}
