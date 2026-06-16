"use client";

import { useState, useCallback, useRef, type DragEvent } from "react";
import { Upload, Link, Clipboard } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({ onImageSelect, accept = "image/*", maxSizeMB = 10 }: ImageUploadProps) {
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
      onImageSelect(f);
    },
    [maxSizeMB, onImageSelect]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f?.type.startsWith("image/")) handleFile(f);
    },
    [handleFile]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          handleFile(items[i].getAsFile()!);
          return;
        }
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
      if (!blob.type.startsWith("image/")) {
        setError("The URL does not point to a valid image");
        return;
      }
      handleFile(new File([blob], "image.jpg", { type: blob.type }));
      setUrl("");
      setUrlInput(false);
    } catch {
      setError("Failed to fetch image. Please check the URL.");
    }
  };

  return (
    <div onPaste={onPaste}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
          drag
            ? "border-violet-500 bg-violet-500/10"
            : "border-[#3a3a5c] bg-[#16162a] hover:border-violet-500/50 hover:bg-[#1a1a30]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Upload className="mx-auto h-10 w-10 text-violet-400 mb-3" />
        <p className="text-base font-bold text-[#e8e8f0]">Drop an image here, or click to upload</p>
        <p className="mt-2 text-sm text-[#8888a0]">PNG, JPG, WebP · Max {maxSizeMB}MB · Or Ctrl+V to paste</p>
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
          <Clipboard className="h-4 w-4" /> Browse
        </button>
      </div>

      {urlInput && (
        <div className="mt-3 flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste image URL..."
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
