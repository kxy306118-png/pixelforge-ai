"use client";
import { useState, useCallback, useRef, type DragEvent } from "react";
import { Upload, Link, Clipboard } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  selectedFile?: File | null;
}

export function ImageUpload({ onImageSelect, accept = "image/*", maxSizeMB = 10, selectedFile }: ImageUploadProps) {
  const { t } = useI18n();
  const [drag, setDrag] = useState(false);
  const [urlInput, setUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(t("upload.size_exceeded").replace("{max}", String(maxSizeMB)));
        return;
      }
      setError("");
      onImageSelect(f);
    },
    [maxSizeMB, onImageSelect, t]
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
      if (!res.ok) throw new Error("Fetch failed");
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) throw new Error("Not an image");
      handleFile(new File([blob], "image", { type: blob.type }));
      setUrl("");
      setUrlInput(false);
    } catch {
      setError(t("upload.fetch_fail"));
    }
  };

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
            <p className="mt-1 text-sm text-[#8888a0]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB — {t("upload.change")}</p>
          </>
        ) : (
          <>
            <p className="text-base font-bold text-[#e8e8f0]">{t("upload.drop_image")}</p>
            <p className="mt-2 text-sm text-[#8888a0]">{t("upload.hint").replace("{max}", String(maxSizeMB))}</p>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); setUrlInput(!urlInput); }}
          className="btn-secondary text-sm flex-1 justify-center"
        >
          <Link className="h-4 w-4" /> {t("upload.paste_url")}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
          className="btn-secondary text-sm flex-1 justify-center"
        >
          <Clipboard className="h-4 w-4" /> {t("upload.browse")}
        </button>
      </div>

      {urlInput && (
        <div className="mt-3 flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("upload.url_ph")}
            className="flex-1 input-base text-sm"
            onKeyDown={(e) => e.key === "Enter" && fetchUrl()}
          />
          <button onClick={fetchUrl} className="btn-primary text-sm px-4">{t("upload.fetch_url")}</button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}
