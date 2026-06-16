export function ProcessingIndicator({ message = "AI is processing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative h-16 w-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
      </div>
      <p className="text-base font-semibold text-[#e8e8f0]">{message}</p>
      <p className="mt-1 text-sm text-[#8888a0]">This usually takes 3-30 seconds</p>
    </div>
  );
}
