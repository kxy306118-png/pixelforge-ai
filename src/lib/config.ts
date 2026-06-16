export const siteConfig = {
  name: "PixelForge AI",
  description: "All-in-one AI-powered creative toolkit — image, video, audio & text tools for everyone.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pixelforge.ai",
  ogImage: "/og-image.png",
};

export type ToolCategory = "image" | "video" | "audio" | "text";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: ToolCategory;
  ai: boolean;
  costPerRun: number;
}

export const tools: Tool[] = [
  // === Image Tools ===
  { id: "remove-bg", name: "AI Background Removal", description: "Remove image backgrounds instantly with AI. One click, perfect cutout.", icon: "Eraser", href: "/tools/remove-bg", category: "image", ai: true, costPerRun: 0.0003 },
  { id: "upscale", name: "AI Image Upscale", description: "Upscale images up to 4x with AI. No quality loss.", icon: "Maximize", href: "/tools/upscale", category: "image", ai: true, costPerRun: 0.002 },
  { id: "enhance", name: "AI Photo Enhance", description: "Enhance photo quality, fix blur, and improve details.", icon: "Sparkles", href: "/tools/enhance", category: "image", ai: true, costPerRun: 0.004 },
  { id: "ai-image-gen", name: "AI Image Generator", description: "Generate stunning images from text descriptions using Flux AI.", icon: "Wand2", href: "/tools/ai-image-gen", category: "image", ai: true, costPerRun: 0.015 },
  { id: "compress", name: "Image Compress", description: "Reduce file size without visible quality loss. Smart compression.", icon: "FileDown", href: "/tools/compress", category: "image", ai: false, costPerRun: 0 },
  { id: "convert", name: "Format Converter", description: "Convert between PNG, JPG, WebP, AVIF instantly.", icon: "RefreshCw", href: "/tools/convert", category: "image", ai: false, costPerRun: 0 },
  { id: "resize", name: "Image Resize", description: "Resize images to any dimension with presets for social media.", icon: "Move", href: "/tools/resize", category: "image", ai: false, costPerRun: 0 },
  // === Video Tools ===
  { id: "text-to-video", name: "Text to Video", description: "Generate short videos from text prompts using AI.", icon: "Video", href: "/tools/text-to-video", category: "video", ai: true, costPerRun: 0.10 },
  { id: "image-to-video", name: "Image to Video", description: "Animate a static image into a short video clip.", icon: "Film", href: "/tools/image-to-video", category: "video", ai: true, costPerRun: 0.09 },
  { id: "video-subtitle", name: "Auto Subtitles", description: "Automatically generate subtitles for your videos.", icon: "Subtitles", href: "/tools/video-subtitle", category: "video", ai: true, costPerRun: 0.003 },
  // === Audio Tools ===
  { id: "speech-to-text", name: "Speech to Text", description: "Transcribe audio and video files to text with Whisper AI.", icon: "Mic", href: "/tools/speech-to-text", category: "audio", ai: true, costPerRun: 0.003 },
  { id: "text-to-speech", name: "Text to Speech", description: "Convert text to natural-sounding speech in multiple languages.", icon: "Volume2", href: "/tools/text-to-speech", category: "audio", ai: true, costPerRun: 0.005 },
  { id: "audio-enhance", name: "Audio Enhance", description: "Remove background noise and enhance audio quality.", icon: "Headphones", href: "/tools/audio-enhance", category: "audio", ai: true, costPerRun: 0.01 },
  // === Text Tools ===
  { id: "image-to-text", name: "Image to Text (OCR)", description: "Extract text from images and screenshots accurately.", icon: "ScanText", href: "/tools/image-to-text", category: "text", ai: true, costPerRun: 0.003 },
  { id: "ai-writer", name: "AI Copywriter", description: "Generate marketing copy, captions, and product descriptions.", icon: "PenTool", href: "/tools/ai-writer", category: "text", ai: true, costPerRun: 0.002 },
];

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
  popular?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    aiCredits: 5, // lifetime total
    features: ["5 AI tasks total", "Basic tools (compress/convert/resize) unlimited", "Max 10MB per file", "Standard speed"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$4.99",
    period: "/mo",
    aiCredits: 50,
    features: ["50 AI tasks / month", "All tools included", "Max 25MB per file", "Priority speed", "No watermark", "Ad-free"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "/mo",
    aiCredits: 150,
    popular: true,
    features: ["150 AI tasks / month", "All tools included", "Max 50MB per file", "Priority queue", "Batch processing", "No watermark", "Ad-free", "Email support"],
  },
];
