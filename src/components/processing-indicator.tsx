"use client";

import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  message?: string;
  progress?: number; // 0-100, undefined = indeterminate
}

export function ProcessingIndicator({
  isProcessing,
  message = "Processing your image...",
  progress,
}: ProcessingIndicatorProps) {
  if (!isProcessing) return null;

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
      <div className="flex items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
        <div>
          <p className="text-sm font-medium text-violet-900">{message}</p>
          <p className="mt-0.5 text-xs text-violet-600">
            This usually takes 5-15 seconds
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-violet-100">
        <div
          className="h-full rounded-full bg-violet-600 transition-all duration-500 ease-out"
          style={{
            width: progress !== undefined ? `${progress}%` : undefined,
            animation:
              progress === undefined
                ? "indeterminate 1.5s infinite ease-in-out"
                : "none",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes indeterminate {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 60%;
            margin-left: 20%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
