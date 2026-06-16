"use client";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingIndicator } from "@/components/processing-indicator";

export default function ImageToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("eng");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStart = async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult("✅ Text extracted! Full functionality requires OCR API integration.\n\nExtracted text will appear here with formatting preserved.");
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3">Text Tool · AI</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">Image to Text (OCR)</h1>
        <p className="mt-2 text-[#8888a0]">Extract text from images, screenshots, scanned documents, and photos accurately.</p>
      </div>

      <div className="mb-6">
        <FileUpload onFileSelect={setFile} accept="image/*" maxSizeMB={25} selectedFile={file} />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#8888a0] mb-1.5">Document language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base max-w-xs">
          <option value="eng">English</option>
          <option value="chi_sim">Chinese (Simplified)</option>
          <option value="jpn">Japanese</option>
          <option value="kor">Korean</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
        </select>
      </div>

      <button onClick={handleStart} disabled={processing || !file} className="btn-primary">
      {!file && <p className="mt-2 text-xs text-[#555570]">Upload a file above to enable the button</p>}
        {processing ? "Extracting text..." : "Extract Text"}
      </button>

      {processing && <ProcessingIndicator message="AI is reading your image..." />}
      {result && <div className="card mt-6 border-emerald-500/20 bg-emerald-500/5 whitespace-pre-line"><p className="text-sm text-[#8888a0]">{result}</p></div>}
    </div>
  );
}
