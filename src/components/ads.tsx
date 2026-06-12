"use client";

import { useEffect } from "react";

// ===== Google AdSense Component =====
// Replace ca-pub-XXXXXXXXXXXXXXXX with your actual AdSense publisher ID

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdBanner({ slot, format = "auto", responsive = true, className = "", style }: AdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (dev mode or ad blocker)
    }
  }, []);

  return (
    <div className={`ad-container ad-container-banner my-4 ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      {/* Fallback placeholder when no ads loaded */}
      <div className="ad-placeholder text-xs text-muted-foreground/50 text-center p-2">
        Advertisement
      </div>
    </div>
  );
}

export function AdSidebar({ slot, className = "" }: { slot: string; className?: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <div className={`ad-container ad-container-sidebar ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "250px" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
      <div className="ad-placeholder text-xs text-muted-foreground/50 text-center p-2">
        Advertisement
      </div>
    </div>
  );
}

export function AdNative({ slot, className = "" }: { slot: string; className?: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <div className={`ad-container ad-container-native ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
      />
      <div className="ad-placeholder text-xs text-muted-foreground/50 text-center p-2">
        Sponsored
      </div>
    </div>
  );
}

// In-feed ad that looks like a tool card
export function AdInFeed({ className = "" }: { className?: string }) {
  return (
    <div className={`ad-container rounded-2xl border border-dashed border-border/60 p-6 ${className}`}
         style={{ minHeight: "140px" }}>
      <div className="text-center text-muted-foreground/40">
        <p className="text-xs font-medium uppercase tracking-wider">Advertisement</p>
        <p className="mt-1 text-[10px]">Your ad here — <a href="/contact" className="underline hover:text-muted-foreground">Learn more</a></p>
      </div>
    </div>
  );
}
