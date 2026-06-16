#!/bin/bash
# Generate all new tool pages

declare -A TOOLS
TOOLS[ai-image-gen]="AI Image Generator|Generate stunning images from text descriptions|image|Wand2|Enter a text prompt to generate an image|prompt|A futuristic cityscape at sunset, cyberpunk style, ultra detailed"
TOOLS[text-to-video]="Text to Video|Generate short videos from text prompts|video|Video|Enter a text prompt to generate a video|prompt|A golden retriever running on a beach at sunset"
TOOLS[image-to-video]="Image to Video|Animate a static image into a short video|video|Film|Upload an image to animate it into a video|none|none"
TOOLS[video-subtitle]="Auto Subtitles|Automatically generate subtitles for videos|video|Subtitles|Upload a video to generate subtitles|none|none"
TOOLS[speech-to-text]="Speech to Text|Transcribe audio files to text with AI|audio|Mic|Upload an audio file to transcribe|none|none"
TOOLS[text-to-speech]="Text to Speech|Convert text to natural speech|audio|Volume2|Enter text to convert to speech|text|Welcome to PixelForge AI, your all-in-one creative toolkit."
TOOLS[audio-enhance]="Audio Enhance|Remove noise and enhance audio quality|audio|Headphones|Upload audio to enhance quality|none|none"
TOOLS[image-to-text]="Image to Text (OCR)|Extract text from images|text|ScanText|Upload an image to extract text|none|none"
TOOLS[ai-writer]="AI Copywriter|Generate marketing copy and descriptions|text|PenTool|Enter a topic to generate copy|topic|A productivity app for remote teams"

for tool in "${!TOOLS[@]}"; do
  IFS='|' read -r name desc cat icon placeholder field default <<< "${TOOLS[$tool]}"
  cat > "$tool/page.tsx" << TOOLPAGE
"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";

export default function ${tool//-/}Page() {
  const [input, setInput] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("$default");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    setProcessing(true);
    // TODO: Connect to Replicate API for $tool
    await new Promise((r) => setTimeout(r, 3000));
    setResult("Demo result for $name");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-${cat === "video" ? "blue" : cat === "audio" ? "emerald" : cat === "text" ? "amber" : "violet"}-500/10 border border-${cat === "video" ? "blue" : cat === "audio" ? "emerald" : cat === "text" ? "amber" : "violet"}-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-${cat === "video" ? "blue" : cat === "audio" ? "emerald" : cat === "text" ? "amber" : "violet"}-400 mb-3">
          ${cat^} Tool
        </span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">$name</h1>
        <p className="mt-2 text-[#8888a0]">$desc</p>
      </div>

      {!input && !textInput.includes("$default") ? (
        <ImageUpload onImageSelect={(f) => setInput(URL.createObjectURL(f))} />
      ) : null}

      {$field != "none" ? (
        <div className="mt-4">
          <label className="block text-sm text-[#8888a0] mb-1.5">$placeholder</label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={3}
            className="input-base"
            placeholder="$placeholder"
          />
        </div>
      ) : null}

      <button
        onClick={handleStart}
        disabled={processing}
        className="btn-primary mt-6"
      >
        {processing ? "Processing..." : "Start Processing"}
      </button>

      {processing && <ProcessingIndicator message="AI is working its magic..." />}

      {result && (
        <div className="card mt-6">
          <h3 className="font-bold text-[#e8e8f0] mb-2">Result</h3>
          <p className="text-sm text-[#8888a0]">{result}</p>
          <p className="text-xs text-[#555570] mt-2 italic">Full functionality coming soon — connect Replicate API to enable.</p>
        </div>
      )}
    </div>
  );
}
TOOLPAGE
  echo "Created $tool/page.tsx"
done
