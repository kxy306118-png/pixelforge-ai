"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, Loader2, Link as LinkIcon, Clipboard } from "lucide-react";

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
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  // Clipboard paste support (Ctrl+V)
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            return;
          }
        }
      }
      setError("No image found in clipboard. Copy an image first, then paste.");
    },
    [handleFile]
  );

  // URL upload
  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    setError(null);
    try {
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error("Could not fetch image from URL");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) {
        throw new Error("URL does not point to an image file");
      }
      const blob = await res.blob();
      if (blob.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Image too large. Maximum ${maxSizeMB}MB.`);
      }
      const file = new File([blob], "image.png", { type: blob.type || "image/png" });
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected(file);
      setShowUrlInput(false);
      setUrlInput("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load image from URL");
    } finally {
      setUrlLoading(false);
    }
  }, [urlInput, maxSizeMB, onImageSelected]);

  const clearPreview = useCallback(() => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="w-full" onPaste={handlePaste} tabIndex={0}>
      {!preview ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
              dragActive
                ? "border-violet-500 bg-violet-50"
                : "border-border hover:border-violet-300 hover:bg-muted/50"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Upload className="h-8 w-8" />
            </div>
            <p className="mt-4 text-base font-medium">
              Drop your image here, or <span className="text-violet-600 underline">browse</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              PNG, JPG, WebP up to {maxSizeMB}MB
            </p>
          </div>

          {/* Alternative upload methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-violet-300 transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Paste image URL
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.execCommand("paste");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-violet-300 transition-colors"
            >
              <Clipboard className="h-3.5 w-3.5" />
              Ctrl+V to paste
            </button>
          </div>

          {/* URL input */}
          {showUrlInput && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                placeholder="https://example.com/image.png"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={urlLoading || !urlInput.trim()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                {urlLoading ? "Loading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-2xl border border-border bg-muted/30 p-4">
          <button
            onClick={clearPreview}
            disabled={isProcessing}
            className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 shadow-sm hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-80 rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
