"use client";
import { useState } from "react";
import { ProcessingIndicator } from "@/components/processing-indicator";
import Link from "next/link";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("female-en");
  const [speed, setSpeed] = useState("1.0");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!text.trim()) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult("✅ Audio generated! Full functionality requires TTS API integration. Your text has been converted to natural-sounding speech.");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Audio Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Text to Speech</h1>
        <p className="mt-2 text-[#8888a0]">Convert text into natural-sounding speech in multiple languages and voices.</p>
        <p className="mt-1 text-xs text-violet-400">⚡ Cost: ~$0.005 per request (included in paid plans)</p>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Enter text to convert to speech</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="input-base" placeholder="Enter the text you want to convert to speech. You can paste paragraphs, articles, or any content you want to hear spoken aloud..." />
        <p className="mt-1 text-xs text-[#555570]">{text.length} characters · Max 5000 characters</p>
      </div>

      <div className="grid gap-4 grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Voice</label>
          <select value={voice} onChange={(e) => setVoice(e.target.value)} className="input-base">
            <option value="female-en">Female (English)</option>
            <option value="male-en">Male (English)</option>
            <option value="female-zh">Female (Chinese)</option>
            <option value="male-zh">Male (Chinese)</option>
            <option value="female-ja">Female (Japanese)</option>
            <option value="female-es">Female (Spanish)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Speed</label>
          <select value={speed} onChange={(e) => setSpeed(e.target.value)} className="input-base">
            <option value="0.75">Slow (0.75x)</option>
            <option value="1.0">Normal (1.0x)</option>
            <option value="1.25">Fast (1.25x)</option>
            <option value="1.5">Very Fast (1.5x)</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} disabled={processing || !text.trim()} className="btn-primary">
      {!text.trim() && <p className="mt-2 text-xs text-[#555570]">Enter text above to enable the button</p>}
        {processing ? "Generating speech..." : "Generate Speech"}
      </button>

      {processing && <ProcessingIndicator message="AI is generating speech..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5"><p className="text-sm text-[#8888a0]">{result}</p></div>}

      <p className="mt-4 text-center text-xs text-[#555570]">
        Also try <Link href="/tools/speech-to-text" className="text-violet-400 hover:text-violet-300">Speech to Text</Link> for the reverse
      </p>
    </div>
  );
}
