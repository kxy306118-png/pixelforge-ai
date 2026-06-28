export const siteConfig = {
  name: "PixelForge AI",
  description: "All-in-one AI-powered creative toolkit — image, video, audio & text tools for everyone.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pixelforgeai.club",
  ogImage: "/og-image.png",
};

export type ToolCategory = "image" | "video" | "audio" | "text";

/** Minimum plan tier required: 0=free, 1=starter, 2=pro */
export type PlanTier = 0 | 1 | 2;

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: ToolCategory;
  ai: boolean;
  costPerRun: number;   // actual USD cost to us
  credits: number;       // credits charged to user (0 = free tool)
  minTier: PlanTier;     // minimum plan tier required
}

export const tools: Tool[] = [
  // === Image Tools (1 credit) ===
  { id: "remove-bg", name: "AI Background Removal", description: "Remove image backgrounds instantly with AI. One click, perfect cutout.", icon: "Eraser", href: "/tools/remove-bg", category: "image", ai: true, costPerRun: 0.001, credits: 1, minTier: 0 },
  { id: "upscale", name: "AI Image Upscale", description: "Upscale images up to 4x with AI. No quality loss.", icon: "Maximize", href: "/tools/upscale", category: "image", ai: true, costPerRun: 0.005, credits: 1, minTier: 0 },
  { id: "ai-image-gen", name: "AI Image Generator", description: "Generate stunning images from text descriptions using Flux AI.", icon: "Wand2", href: "/tools/ai-image-gen", category: "image", ai: true, costPerRun: 0.005, credits: 1, minTier: 1 },
  // === Free Image Tools (0 credits) ===
  { id: "compress", name: "Image Compress", description: "Reduce file size without visible quality loss. Smart compression.", icon: "FileDown", href: "/tools/compress", category: "image", ai: false, costPerRun: 0, credits: 0, minTier: 0 },
  { id: "convert", name: "Format Converter", description: "Convert between PNG, JPG, WebP, AVIF instantly.", icon: "RefreshCw", href: "/tools/convert", category: "image", ai: false, costPerRun: 0, credits: 0, minTier: 0 },
  { id: "resize", name: "Image Resize", description: "Resize images to any dimension with presets for social media.", icon: "Move", href: "/tools/resize", category: "image", ai: false, costPerRun: 0, credits: 0, minTier: 0 },
  { id: "enhance", name: "AI Photo Enhance", description: "Enhance photo quality, fix blur, and improve details.", icon: "Sparkles", href: "/tools/enhance", category: "image", ai: false, costPerRun: 0, credits: 0, minTier: 0 },
  // === Video Tools (5 credits, Pro only) ===
  { id: "text-to-video", name: "Text to Video", description: "Generate short videos from text prompts using AI.", icon: "Video", href: "/tools/text-to-video", category: "video", ai: true, costPerRun: 0.15, credits: 5, minTier: 2 },
  { id: "image-to-video", name: "Image to Video", description: "Animate a static image into a short video clip.", icon: "Film", href: "/tools/image-to-video", category: "video", ai: true, costPerRun: 0.09, credits: 5, minTier: 2 },
  { id: "video-subtitle", name: "Auto Subtitles", description: "Automatically generate subtitles for your videos.", icon: "Subtitles", href: "/tools/video-subtitle", category: "video", ai: true, costPerRun: 0.003, credits: 2, minTier: 1 },
  // === Audio Tools (2 credits) ===
  { id: "speech-to-text", name: "Speech to Text", description: "Transcribe audio and video files to text with Whisper AI.", icon: "Mic", href: "/tools/speech-to-text", category: "audio", ai: true, costPerRun: 0.003, credits: 2, minTier: 0 },
  { id: "text-to-speech", name: "Text to Speech", description: "Convert text to natural-sounding speech in multiple languages.", icon: "Volume2", href: "/tools/text-to-speech", category: "audio", ai: true, costPerRun: 0.005, credits: 2, minTier: 0 },
  { id: "audio-enhance", name: "Audio Enhance", description: "Remove background noise and enhance audio quality.", icon: "Headphones", href: "/tools/audio-enhance", category: "audio", ai: true, costPerRun: 0.01, credits: 2, minTier: 0 },
  // === Text Tools (1 credit) ===
  { id: "image-to-text", name: "Image to Text (OCR)", description: "Extract text from images and screenshots accurately.", icon: "ScanText", href: "/tools/image-to-text", category: "text", ai: true, costPerRun: 0.003, credits: 1, minTier: 0 },
  { id: "ai-writer", name: "AI Copywriter", description: "Generate marketing copy, captions, and product descriptions.", icon: "PenTool", href: "/tools/ai-writer", category: "text", ai: true, costPerRun: 0.001, credits: 1, minTier: 0 },
];

/** Quick lookup: toolId → credits cost */
export const TOOL_CREDITS: Record<string, number> = Object.fromEntries(
  tools.map((t) => [t.id, t.credits])
);

/** Quick lookup: toolId → minimum plan tier */
export const TOOL_MIN_TIER: Record<string, PlanTier> = Object.fromEntries(
  tools.map((t) => [t.id, t.minTier])
);

export const categoryInfo: Record<ToolCategory, { label: string; icon: string; color: string }> = {
  image: { label: "Image Tools", icon: "ImageIcon", color: "violet" },
  video: { label: "Video Tools", icon: "Video", color: "blue" },
  audio: { label: "Audio Tools", icon: "Volume2", color: "emerald" },
  text: { label: "Text Tools", icon: "Type", color: "amber" },
};

export const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Help" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  aiCredits: number;
  tier: PlanTier;
  popular?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    aiCredits: 10,
    tier: 0,
    features: [
      "10 AI credits (lifetime)",
      "Image & Text tools included",
      "Audio tools included",
      "Basic tools free & unlimited",
      "Max 10MB per file",
      "Standard speed",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    period: "/mo",
    aiCredits: 100,
    tier: 1,
    popular: true,
    features: [
      "100 AI credits / month",
      "All Image, Audio & Text tools",
      "AI Image Generator included",
      "Auto Subtitles included",
      "Basic tools free & unlimited",
      "Max 25MB per file",
      "Priority speed · No watermark",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "/mo",
    aiCredits: 300,
    tier: 2,
    features: [
      "300 AI credits / month",
      "Everything in Starter, plus:",
      "Video Generation (Text-to-Video)",
      "Image-to-Video animation",
      "Max 50MB per file",
      "Priority queue · Batch processing",
      "Priority email support",
    ],
  },
];
