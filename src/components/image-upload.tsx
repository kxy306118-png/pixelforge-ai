"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, Link as LinkIcon, Clipboard } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  onImageSelected,
  isProcessing,
  accept = "image/png,image/jpeg,image/webp",
  maxSizeMB = 10,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum ${maxSizeMB}MB.`);
        return;
      }
      if (!accept.split(",").some((t) => file.type.startsWith(t.split("/")[0]))) {
        setError("Unsupported file format.");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected(file);
    },
    [accept, maxSizeMB, onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) handleFile(e.target.files[0]);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) { handleFile(file); return; }
        }
      }
      setError("No image found in clipboard.");
    },
    [handleFile]
  );

  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true); setError(null);
    try {
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error("Could not fetch image");
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) throw new Error("URL is not an image");
      const blob = await res.blob();
      if (blob.size > maxSizeMB * 1024 * 1024) throw new Error(`Too large. Max ${maxSizeMB}MB.`);
      const file = new File([blob], "image.png", { type: blob.type || "image/png" });
      setPreview(URL.createObjectURL(file));
      onImageSelected(file);
      setShowUrlInput(false); setUrlInput("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load image");
    } finally { setUrlLoading(false); }
  }, [urlInput, maxSizeMB, onImageSelected]);

  const clearPreview = useCallback(() => {
    setPreview(null); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="w-full" onPaste={handlePaste} tabIndex={0}>
      {!preview ? (
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 transition-all duration-300 ${
              dragActive
                ? "border-violet-500 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                : "border-white/[0.06] hover:border-violet-500/40 hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Upload className="h-8 w-8" />
            </div>
            <p className="mt-4 text-base font-semibold text-zinc-200">
              Drop your image here, or <span className="text-violet-400 underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1.5 text-sm text-zinc-500">
              PNG, JPG, WebP — up to {maxSizeMB}MB
            </p>
          </div>

          {/* Alt methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs font-medium text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 transition-all">
              <LinkIcon className="h-3.5 w-3.5" /> Paste URL
            </button>
            <button onClick={(e) => { e.stopPropagation(); document.execCommand("paste"); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs font-medium text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 transition-all">
              <Clipboard className="h-3.5 w-3.5" /> Ctrl+V Paste
            </button>
          </div>

          {/* URL input */}
          {showUrlInput && (
            <div className="flex gap-2 animate-fade-in">
              <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                placeholder="https://example.com/image.png"
                className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20" />
              <button onClick={handleUrlSubmit} disabled={urlLoading || !urlInput.trim()}
                className="neon-btn px-5 py-2.5 text-sm disabled:opacity-40">
                <span>{urlLoading ? "..." : "Load"}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <button onClick={clearPreview} disabled={isProcessing}
            className="absolute right-3 top-3 z-10 rounded-lg bg-black/60 p-2 text-zinc-400 hover:text-white hover:bg-black/80 transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-center">
            <img src={preview} alt="Preview" className="max-h-80 rounded-lg object-contain" />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  );
}
