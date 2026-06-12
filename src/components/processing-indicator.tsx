"use client";

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  message?: string;
}

export function ProcessingIndicator({ isProcessing, message = "Processing..." }: ProcessingIndicatorProps) {
  if (!isProcessing) return null;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-center gap-3 py-6">
        {/* Spinning ring */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-200">{message}</p>
          <p className="text-xs text-zinc-500">This may take a few seconds</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto max-w-md h-1 rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 shimmer"
             style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}
