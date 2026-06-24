"use client";
import { useI18n } from "@/lib/i18n";

export function ProcessingIndicator({ message }: { message: string }) {
  const { t } = useI18n();
  return (
    <div className="card text-center py-12">
      <div className="inline-flex items-center gap-2 text-violet-400 font-bold mb-3">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {message}
      </div>
      <p className="text-sm text-[#8888a0]">{t("processing.usually")}</p>
    </div>
  );
}
