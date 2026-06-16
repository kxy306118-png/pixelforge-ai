"use client";

import { useState, useCallback, useRef, type DragEvent } from "react";
import { Upload, Link, Clipboard } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  selectedFile?: File | null;
}

export function FileUpload({ onFileSelect, accept = "image/*", maxSizeMB = 10, label, hint, selectedFile }: FileUploadProps) {
  const [drag, setDrag] = useState(false);
  const [urlInput, setUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File size cannot exceed ${maxSizeMB}MB`);
        return;
      }
      setError("");
      onFileSelect(f);
    },
    [maxSizeMB, onFileSelect]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const file = items[i].getAsFile();
        if (file) { handleFile(file); return; }
      }
    },
    [handleFile]
  );

  const fetchUrl = async () => {
    if (!url) return;
    try {
      setError("");
      const res = await fetch(url);
      const blob = await res.blob();
      handleFile(new File([blob], "file", { type: blob.type }));
      setUrl("");
      setUrlInput(false);
    } catch {
      setError("Failed to fetch file. Please check the URL.");
    }
  };

  const defaultLabel = accept.includes("video") ? "Drop a video here, or click to upload"
    : accept.includes("audio") ? "Drop an audio file here, or click to upload"
    : "Drop an image here, or click to upload";

  const defaultHint = accept.includes("video") ? `MP4, MOV, WebM — Max ${maxSizeMB}MB`
    : accept.includes("audio") ? `MP3, WAV, M4A, FLAC — Max ${maxSizeMB}MB`
    : `PNG, JPG, WebP — Max ${maxSizeMB}MB — Or Ctrl+V to paste`;

  return (
    <div onPaste={onPaste}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`upload-zone ${drag ? "drag-over" : ""}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Upload className="mx-auto h-10 w-10 text-violet-400 mb-3" />
        {selectedFile ? (
          <>
            <p className="text-base font-bold text-emerald-400">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-[#8888a0]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB — Click to change</p>
          </>
        ) : (
          <>
            <p className="text-base font-bold text-[#e8e8f0]">{label || defaultLabel}</p>
            <p className="mt-2 text-sm text-[#8888a0]">{hint || defaultHint}</p>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); setUrlInput(!urlInput); }}
          className="btn-secondary text-sm flex-1 justify-center"
        >
          <Link className="h-4 w-4" /> Paste URL
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
          className="btn-secondary text-sm flex-1 justify-center"
        >
          <Clipboard className="h-4 w-4" /> Browse Files
        </button>
      </div>

      {urlInput && (
        <div className="mt-3 flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste file URL..."
            className="flex-1 input-base text-sm"
            onKeyDown={(e) => e.key === "Enter" && fetchUrl()}
          />
          <button onClick={fetchUrl} className="btn-primary text-sm px-4">Fetch</button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}
