"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum ${maxSizeMB}MB.`);
        return;
      }
      if (!accept.split(",").includes(file.type)) {
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

  const clearPreview = useCallback(() => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="w-full">
      {!preview ? (
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
            Drop your image here, or{" "}
            <span className="text-violet-600 underline">browse</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PNG, JPG, WebP up to {maxSizeMB}MB
          </p>
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
          {isProcessing && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-violet-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
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
