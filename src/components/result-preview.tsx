"use client";

import { Download } from "lucide-react";

interface ResultPreviewProps {
  originalUrl: string | null;
  resultUrl: string | null;
  originalSize?: number;
  resultSize?: number;
  downloadFilename?: string;
}

export function ResultPreview({
  originalUrl,
  resultUrl,
  originalSize,
  resultSize,
  downloadFilename = "result.png",
}: ResultPreviewProps) {
  if (!resultUrl) return null;

  const reduction =
    originalSize && resultSize
      ? ((1 - resultSize / originalSize) * 100).toFixed(1)
      : null;

  return (
    <div className="w-full space-y-4">
      {/* Stats bar */}
      {(originalSize || resultSize) && (
        <div className="flex flex-wrap gap-4 rounded-xl bg-muted/50 p-4 text-sm">
          {originalSize && (
            <div>
              <span className="text-muted-foreground">Original:</span>{" "}
              <span className="font-medium">{(originalSize / 1024).toFixed(1)} KB</span>
            </div>
          )}
          {resultSize && (
            <div>
              <span className="text-muted-foreground">Result:</span>{" "}
              <span className="font-medium">{(resultSize / 1024).toFixed(1)} KB</span>
            </div>
          )}
          {reduction && (
            <div>
              <span className="text-muted-foreground">Saved:</span>{" "}
              <span className="font-medium text-green-600">{reduction}%</span>
            </div>
          )}
        </div>
      )}

      {/* Image comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        {originalUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Before</p>
            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full object-contain" />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">After</p>
          <div className="overflow-hidden rounded-xl border border-violet-200 bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Result" className="w-full object-contain" />
          </div>
        </div>
      </div>

      {/* Download button */}
      <a
        href={resultUrl}
        download={downloadFilename}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-700 transition-colors"
      >
        <Download className="h-4 w-4" />
        Download Result
      </a>
    </div>
  );
}
