import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sections = [
  {
    title: "🚀 Getting Started",
    items: [
      { q: "What is PixelForge?", a: "PixelForge AI is an all-in-one creative toolkit that provides 16 AI-powered tools for image, video, audio, and text processing. Instead of subscribing to multiple services (remove.bg, TinyPNG, Runway, Otter.ai, etc.), you get everything in one platform starting at $4.99/month." },
      { q: "How do I create an account?", a: "Click the 'Sign Up' button in the top-right corner. Enter your name, email, and password. You'll get 3 free AI tasks per day to try all tools. No credit card required." },
      { q: "What's included in the free plan?", a: "The free plan gives you:\n• 3 AI tasks per day (background removal, upscaling, etc.)\n• Unlimited basic tools (compress, convert, resize)\n• Max 10MB per file\n• Standard processing speed\n\nBasic tools (compress, convert, resize) are always free and don't count against your AI credits." },
      { q: "How do I upgrade my plan?", a: "Go to the Pricing page and click 'Subscribe' on your desired plan. If you're logged in, you'll go directly to the payment page. If not logged in, you'll be prompted to sign up or log in first. We accept all major credit cards via LemonSqueezy." },
    ],
  },
  {
    title: "🖼️ Image Tools",
    items: [
      { q: "AI Background Removal", a: "Upload any image and our AI will instantly remove the background, leaving you with a clean transparent PNG. Works best with images that have clear subject separation.\n\nSupported formats: PNG, JPG, WebP\nMax file size: 25MB (Starter+), 10MB (Free)\nOutput: Transparent PNG\nTips: Use high-resolution images with good contrast between subject and background for best results." },
      { q: "AI Image Upscale", a: "Enlarge images up to 4x without losing quality. Our AI reconstructs details that would normally be lost during resizing.\n\nScale options: 2x, 4x\nInput: Any image format\nOutput: Enhanced PNG\nBest for: Product photos, print materials, restoring old photos\nTip: Start with the highest resolution source available for best results." },
      { q: "AI Photo Enhance", a: "Automatically improve photo quality — fix blur, enhance colors, sharpen details, and adjust lighting. Perfect for old photos, low-quality shots, or images taken in poor lighting.\n\nEnhancement modes: General enhancement, Face enhancement, Color correction\nTip: For portraits, the Face enhancement mode provides the best results." },
      { q: "AI Image Generator", a: "Create images from text descriptions using Flux AI. Simply describe what you want and the AI generates it.\n\nTips for good prompts:\n• Be specific: 'A golden retriever puppy sitting on a red blanket in a sunlit room'\n• Include style: 'oil painting style', 'photorealistic', 'anime'\n• Add details: 'soft lighting', 'shallow depth of field', '8K quality'\n• Available sizes: 512×512, 1024×1024, 1280×720, 720×1280" },
      { q: "Image Compress, Convert & Resize", a: "These basic tools are FREE and unlimited for all users:\n\n• Compress: Reduce file size 60-80% without visible quality loss\n• Convert: Transform between PNG, JPG, WebP, AVIF, BMP, TIFF\n• Resize: Change dimensions with presets for Instagram, Facebook, Twitter, LinkedIn, YouTube\n\nNo AI credits needed — use as much as you want!" },
    ],
  },
  {
    title: "🎬 Video Tools",
    items: [
      { q: "Text to Video", a: "Generate short video clips (3-10 seconds) from text descriptions. Powered by Tencent's Hunyuan Video model.\n\nTips:\n• Be specific about scene, camera movement, and lighting\n• Keep prompts under 80 words\n• Start with short clips (3-5s) to test\n• Same prompt gives different results each time\n\nNote: Video generation is more resource-intensive than image processing, so it requires a paid plan." },
      { q: "Image to Video", a: "Animate a static image into a short video clip. Upload any image and optionally describe how it should move.\n\nExample prompts:\n• 'The person slowly turns their head and smiles'\n• 'Camera slowly zooms in on the building'\n• 'Water ripples gently, leaves sway in the wind'\n\nBest with: Portraits, landscapes, product shots" },
      { q: "Auto Subtitles", a: "Upload a video and automatically generate timed subtitles using Whisper AI. Supports 100+ languages.\n\nFeatures:\n• Auto language detection or manual selection\n• Output formats: SRT, WebVTT, or plain text\n• Timestamps included for direct import into video editors\n• Works with MP4, MOV, WebM up to 200MB" },
    ],
  },
  {
    title: "🎵 Audio Tools",
    items: [
      { q: "Speech to Text", a: "Convert audio and video files to text with high accuracy using Whisper AI. Supports 100+ languages.\n\nFeatures:\n• Transcription (same language) or Translation (to English)\n• Auto language detection\n• Supports MP3, WAV, M4A, FLAC, OGG, and video files\n• Max 200MB per file\n\nTips: Use clear audio with minimal background noise for best accuracy." },
      { q: "Text to Speech", a: "Convert text to natural-sounding speech in multiple languages and voices.\n\nOptions:\n• Multiple voices (male/female) per language\n• Speed control: 0.75x to 1.5x\n• Languages: English, Chinese, Japanese, Spanish, French, German, and more\n• Max 5000 characters per request" },
      { q: "Audio Enhance", a: "Improve audio quality with AI-powered enhancement:\n\n• Noise Removal: Remove background hum, fan noise, traffic sounds\n• Voice Enhancement: Make speech clearer and more present\n• Loudness Normalize: Adjust volume to professional broadcast standards (-14 LUFS)\n• Full Enhancement: Apply all enhancements together\n\nBest for: Podcasts, recordings, interviews, voiceovers" },
    ],
  },
  {
    title: "📝 Text Tools",
    items: [
      { q: "Image to Text (OCR)", a: "Extract text from images, screenshots, scanned documents, and photos. Supports multiple languages.\n\nUse cases:\n• Digitize printed documents\n• Extract text from screenshots\n• Read product labels and packaging\n• Convert scanned PDFs to editable text\n\nSupported languages: English, Chinese, Japanese, Korean, Spanish, French, German, and 100+ more." },
      { q: "AI Copywriter", a: "Generate marketing copy, product descriptions, social media posts, and more.\n\nContent types:\n• Product Descriptions: Detailed e-commerce listings\n• Social Media Posts: Engaging captions for any platform\n• Ad Copy: High-converting advertising text\n• Email Newsletters: Professional email content\n• Blog Introductions: Attention-grabbing opening paragraphs\n• SEO Titles: Optimized title tags and meta descriptions\n\nTone options: Professional, Casual, Persuasive, Humorous, Luxury, Urgent" },
    ],
  },
  {
    title: "💳 Billing & Plans",
    items: [
      { q: "What are the plan options?", a: "Free ($0): 3 AI tasks/day, basic tools unlimited, 10MB limit\nStarter ($4.99/mo): 30 AI tasks/month, 25MB limit, no watermark, ad-free\nPro ($9.99/mo): 150 AI tasks/month, 50MB limit, batch processing, email support — MOST POPULAR\nUnlimited ($19.99/mo): Unlimited AI tasks, 200MB limit, API access, priority support\n\nSave 20% with annual billing!" },
      { q: "What counts as an AI task?", a: "AI tasks include: Background Removal, Image Upscale, Photo Enhance, Image Generation, Text-to-Video, Image-to-Video, Auto Subtitles, Speech-to-Text, Text-to-Speech, Audio Enhance, OCR, and AI Copywriter.\n\nBasic tools (Compress, Convert, Resize) are always free and unlimited — they never count as AI tasks." },
      { q: "Can I cancel anytime?", a: "Yes! You can cancel your subscription at any time. You'll keep access until the end of your current billing period. No cancellation fees. We also offer a 7-day money-back guarantee." },
      { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied within the first 7 days, contact support@pixelforge.ai for a full refund." },
    ],
  },
  {
    title: "🔒 Privacy & Security",
    items: [
      { q: "Is my data safe?", a: "Yes! All uploaded files are processed in real-time and deleted from our servers immediately after processing. We never store, share, sell, or train on your data. Your files stay yours." },
      { q: "What file formats are supported?", a: "Images: PNG, JPG, WebP, AVIF, BMP, TIFF\nVideo: MP4, MOV, WebM (up to 200MB)\nAudio: MP3, WAV, M4A, FLAC, OGG\nDocuments (via OCR): Any image format with text" },
    ],
  },
  {
    title: "🛟 Support & Contact",
    items: [
      { q: "How do I contact support?", a: "You can reach us through:\n• Contact form: pixelforge.ai/contact\n• Email: support@pixelforge.ai\n• Response time: Within 24 hours\n• Pro and Unlimited users get priority support" },
      { q: "How do I access the admin panel?", a: "The admin panel is at pixelforge.ai/admin. Only accounts with admin privileges can access it. To set up admin access:\n1. Register an account\n2. Use the database to set role='admin' for your user\n3. Log in and navigate to /admin\n\nThe admin panel shows: user statistics, revenue estimates, message inbox, plan distribution, and tool usage analytics." },
      { q: "Where do I see messages from the Contact form?", a: "All messages sent through the Contact form are stored in the database and visible in the Admin Panel under the 'Messages' tab. Each message shows the sender's name, email, subject, message content, date, and status (open/replied). Go to /admin → Messages tab." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="text-center mb-12">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">Help Center</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#e8e8f0]">How can we <span className="gradient-text">help you</span>?</h1>
        <p className="mt-3 text-[#8888a0]">Everything you need to know about using PixelForge AI tools</p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-black text-[#e8e8f0] mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <details key={item.q} className="card group cursor-pointer">
                  <summary className="flex items-center justify-between list-none font-bold text-[#e8e8f0] text-sm">
                    <span>{item.q}</span>
                    <ChevronRight className="h-4 w-4 text-[#555570] transition-transform group-open:rotate-90 shrink-0 ml-2" />
                  </summary>
                  <div className="mt-4 text-sm text-[#8888a0] leading-relaxed whitespace-pre-line border-t border-[#2a2a45] pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center card bg-gradient-to-br from-violet-500/5 to-transparent">
        <h3 className="text-lg font-bold text-[#e8e8f0] mb-2">Still need help?</h3>
        <p className="text-sm text-[#8888a0] mb-4">Can't find what you're looking for? We're here to help.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary">Contact Us</Link>
          <Link href="/pricing" className="btn-secondary">View Plans</Link>
        </div>
      </div>
    </div>
  );
}
