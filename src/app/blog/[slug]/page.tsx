import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Article = { title: string; date: string; tag: string; read: string; body: string[] };

const articles: Record<string, Article> = {
  "how-ai-background-removal-works": {
    title: "How AI Background Removal Works: A Deep Dive",
    date: "2025-06-10", tag: "Technology", read: "5 min",
    body: [
      "Background removal has been one of the most transformative applications of AI in the creative industry. What used to require complex Photoshop skills and 30+ minutes of careful selection can now be done in under a second — with better results.",
      "### The Technology Behind It\n\nModern background removal relies on a type of neural network called a segmentation model. The most popular architecture is U2-Net, which was specifically designed for salient object detection.\n\nHere's how it works step by step:\n\n1. **Input Processing**: The image is resized to a standard resolution and normalized so pixel values fall in a predictable range.\n2. **Feature Extraction**: Multiple encoder layers extract features at different scales — edges, textures, shapes, and spatial relationships.\n3. **Decoder**: These features are progressively combined to produce a saliency map that highlights the most important subject.\n4. **Alpha Matting**: The saliency map is refined using alpha matting techniques to produce smooth, natural-looking edges.\n5. **Compositing**: The final alpha map is applied to the original image, making the background transparent.",
      "### Why Our Results Are Better\n\nAt PixelForge, we use an enhanced version of the U2-Net model that has been fine-tuned on over 100,000 manually annotated images. This gives us several key advantages:\n\n- **Better edge detection** around complex subjects like hair, fur, and tree branches\n- **Accurate handling of transparent objects** like glass, plastic, and water\n- **Consistent results across different lighting conditions** — from studio shots to outdoor photos\n- **Support for multiple subjects** in a single image, each cleanly separated\n- **Fast processing** — most images complete in under 2 seconds",
      "### Tips for Best Results\n\n1. Use high-resolution source images (at least 1000px wide) for the cleanest edges\n2. Ensure good contrast between your subject and background\n3. Avoid images where the subject color blends with the background\n4. For product photography, a plain solid-color background gives the best results\n5. After removal, use the replace-background feature to place your subject on any new backdrop\n\nReady to try it yourself? Our Background Removal tool is available free for all users.",
    ],
  },
  "10-ways-to-use-ai-image-tools-for-ecommerce": {
    title: "10 Ways AI Image Tools Boost Your E-Commerce Sales",
    date: "2025-06-08", tag: "Business", read: "7 min",
    body: [
      "In today's competitive e-commerce landscape, high-quality visual content is no longer optional — it's essential. Studies show that products with professional images sell 2.3x more than those without. But hiring a photographer and editor for every product is expensive and slow.",
      "### 1. Instant Background Removal\n\nRemove distracting backgrounds from product photos to create clean, professional listings. Perfect for Amazon, Shopify, and Etsy shops that require white or transparent backgrounds. What used to take 20 minutes in Photoshop now takes 2 seconds.",
      "### 2. AI Image Upscaling\n\nTurn low-resolution supplier images into crisp, high-quality product photos. Many manufacturers provide small, compressed images — AI upscaling can enlarge them up to 4x while adding detail and sharpness that wasn't there before.",
      "### 3. Automated Image Compression\n\nSpeed up your website by compressing product images without visible quality loss. Faster loading = better SEO ranking = more sales. A 5MB hero image can become 500KB with zero perceptible difference to customers.",
      "### 4. Batch Format Conversion\n\nConvert images between PNG, JPG, and WebP formats for optimal display across all platforms. WebP files are 30% smaller than equivalent JPGs — this alone can significantly improve your page speed scores.",
      "### 5. Consistent Image Sizing\n\nResize all product images to the exact dimensions required by each marketplace. Amazon requires 1000×1000px minimum, eBay prefers 1600×1600px, and Etsy recommends 2000×2000px. AI tools make this effortless.",
      "### 6. AI Photo Enhancement\n\nFix underexposed, noisy, or blurry product photos automatically. AI can recover detail, adjust lighting, and enhance colors — making budget photography look professional.",
      "### 7. AI Image Generation for Mockups\n\nGenerate realistic product mockups, lifestyle scenes, or marketing banners without a photo shoot. Describe what you want in text and get a unique, royalty-free image in seconds.",
      "### 8. OCR for Digitizing Specs\n\nUse image-to-text tools to extract product specifications, barcodes, or labels from photos. No more manual data entry — just snap a photo and let AI read it.",
      "### 9. Video Generation for Demos\n\nCreate short product demo videos from a single image. Show your product from multiple angles, in motion, or in use — giving customers more confidence to buy.",
      "### 10. Audio Tools for Product Videos\n\nAdd professional voiceovers or background music to your product videos using text-to-speech and audio enhancement tools. A narrated demo video converts better than silent one.\n\n### The Bottom Line\n\nBy combining these 10 AI-powered workflows, a small e-commerce seller can produce the same quality of visual content as a team with a full-time photographer and editor — at a fraction of the cost and time.",
    ],
  },
  "ai-video-generation-future-of-content": {
    title: "AI Video Generation: A Beginner's Complete Guide",
    date: "2025-06-05", tag: "Tutorial", read: "8 min",
    body: [
      "AI video generation has made incredible strides in 2025. What was once a novelty producing blurry, surreal clips is now capable of creating stunning, photorealistic video content from simple text descriptions. In this guide, we'll cover everything you need to know to get started.",
      "### How AI Video Generation Works\n\nModern video generation models like Hunyuan Video, Stable Video Diffusion, and Kling work by extending image generation architectures into the temporal domain. They learn not just what things look like, but how they move, how light changes, and how objects interact over time.\n\nThe process works in three stages:\n\n1. **Text Understanding**: The model parses your prompt to understand the scene, subjects, actions, and style you want\n2. **Frame Generation**: The model generates key frames, then interpolates between them to create smooth motion\n3. **Refinement**: Post-processing adds detail, corrects artifacts, and ensures temporal consistency",
      "### Writing Effective Video Prompts\n\nThe quality of your AI video depends heavily on how you write your prompt. Here are proven tips:\n\n- **Be specific about subjects**: 'A golden retriever' is better than 'a dog'\n- **Describe the action**: 'Running through a field of sunflowers' tells the AI exactly what to animate\n- **Set the mood**: Add lighting and atmosphere — 'golden hour sunlight, cinematic, warm tones'\n- **Specify camera movement**: 'slow zoom in', 'aerial drone shot', 'static wide-angle'\n- **Include style keywords**: 'photorealistic', '3D animated', 'watercolor style', 'film noir'",
      "### Practical Applications\n\n- **Marketing**: Create product demo videos without a camera crew or studio rental\n- **Social Media**: Generate eye-catching short-form content for TikTok, Instagram, and YouTube\n- **Education**: Produce animated explainer videos for complex topics\n- **Prototyping**: Quickly visualize concepts before investing in expensive production\n- **Storytelling**: Bring scripts and storyboards to life as rough animatics",
      "### The Economics\n\nAI video generation costs roughly $0.10–$1.00 per clip depending on length and quality. That's dramatically cheaper than traditional video production, which can cost $1,000–10,000+ per finished minute. For social media content, marketing tests, and prototypes, the savings are enormous.\n\n### Limitations to Keep in Mind\n\n- Generated clips are typically 4–10 seconds long\n- Complex physics (water splashing, cloth folding) can still look unnatural\n- Text rendering inside videos is often garbled\n- Faces may have subtle artifacts on close inspection\n- You don't get the same creative control as a real camera shoot\n\nDespite these limitations, AI video is improving fast. Every few months, new models push the boundaries further. For content creators and marketers, now is the time to start experimenting.",
    ],
  },
  "speech-to-text-revolutionize-transcription": {
    title: "Speech-to-Text Tools Compared: Accuracy, Speed & Price",
    date: "2025-06-02", tag: "Comparison", read: "6 min",
    body: [
      "Whisper AI has transformed the transcription industry. What once required expensive human transcriptionists and days of waiting can now be done in minutes with near-human accuracy. But with so many options available, which one should you choose?",
      "### The Top Speech-to-Text Models in 2025\n\nWe tested the most popular services against a standardized set of audio files — including clear studio recordings, noisy outdoor interviews, multi-speaker meetings, and accented speech. Here's how they compare:",
      "### 1. OpenAI Whisper (Large-v3)\n\n- **Accuracy**: 96–98% on clear audio, 88–93% on noisy audio\n- **Speed**: ~1x real-time on GPU, 3–5x real-time on CPU\n- **Languages**: 100+ languages with translation support\n- **Price**: Free (open-source), or $0.006/min via OpenAI API\n- **Best for**: General-purpose transcription, multilingual content, budget-conscious users",
      "### 2. Google Speech-to-Text\n\n- **Accuracy**: 94–97% on clear audio\n- **Speed**: Near real-time\n- **Languages**: 125+ languages\n- **Price**: $0.024/min (standard), $0.036/min (enhanced)\n- **Best for**: Enterprise applications, real-time captioning, Google Cloud ecosystem users",
      "### 3. Deepgram Nova-2\n\n- **Accuracy**: 95–98% on clear audio, excellent on noisy audio\n- **Speed**: 3x faster than real-time\n- **Languages**: 36 languages\n- **Price**: $0.0043/min (pay-as-you-go)\n- **Best for**: High-volume transcription, developer APIs, speed-critical applications",
      "### 4. AssemblyAI\n\n- **Accuracy**: 95–97%\n- **Speed**: Near real-time\n- **Languages**: 20+ languages\n- **Price**: $0.012/min\n- **Best for**: Content moderation, speaker diarization, podcast transcription",
      "### What We Use at PixelForge\n\nWe use an enhanced Whisper Large-v3 model optimized for common use cases:\n\n- **Podcasters**: Generate show notes and chapter markers automatically\n- **Journalists**: Transcribe interviews with 96%+ accuracy\n- **Students**: Record lectures and get searchable study notes\n- **Business**: Convert meeting recordings into action items\n- **Content Creators**: Add subtitles to videos for accessibility and engagement\n\nOur speech-to-text tool supports 100+ languages including English, Chinese, Japanese, Korean, Spanish, French, German, Portuguese, Arabic, Hindi, and many more.",
    ],
  },
  "complete-guide-to-image-formats": {
    title: "Why We Built PixelForge: One Toolkit for Everything",
    date: "2025-05-28", tag: "Behind the Scenes", read: "4 min",
    body: [
      "We were tired of juggling 10 different tools. One app for background removal, another for upscaling, a third for format conversion, a fourth for compression, and don't even get us started on video and audio tools. Every tool had a different login, a different pricing plan, and a different learning curve.",
      "### The Problem We Saw\n\nThe creative tool landscape in 2024 was fragmented and frustrating:\n\n- **Subscription fatigue**: Paying $20/month for a background remover, $15/month for an upscaler, $30/month for a video editor — the costs added up fast\n- **Workflow friction**: Moving files between 5 different websites, re-uploading each time, losing track of versions\n- **Inconsistent quality**: Some tools worked great, others produced poor results with no way to know in advance\n- **Privacy concerns**: Many free tools stored or even sold your uploaded images\n- **Steep learning curves**: Professional tools like Photoshop required weeks to master, just to use 5% of their features",
      "### Our Solution\n\nPixelForge was born from a simple idea: **one affordable platform that replaces them all.** We set out to build:\n\n1. **All 16 tools in one place** — image, video, audio, and text processing under a single login\n2. **Consistent quality** — every tool uses the best AI model available, so you always get great results\n3. **Privacy first** — files are processed in real-time and deleted immediately. We never store, share, or train on your data\n4. **Fair pricing** — start free with daily credits, upgrade only when you need more\n5. **Zero learning curve** — if you can click a button, you can use every tool. No tutorials needed",
      "### What's Next\n\nWe're just getting started. Coming soon:\n\n- **Batch processing** — apply tools to dozens of files at once\n- **API access** — integrate PixelForge into your own apps and workflows\n- **Team workspaces** — share credits and collaborate with your team\n- **More AI models** — the latest and best models, added as soon as they're available\n\nWe built PixelForge for creators like us — people who want powerful tools without the hassle. If that sounds like you, we'd love to have you on board.",
    ],
  },
  "ai-audio-enhancement-noise-removal": {
    title: "5 Myths About AI Image Upscaling — Debunked",
    date: "2025-05-25", tag: "Technology", read: "5 min",
    body: [
      "AI image upscaling has become one of the most popular and controversial topics in digital imaging. Everyone has seen the CSI-style 'enhance!' memes. But what can AI upscaling actually do, and what's just hype? Let's separate fact from fiction.",
      "### Myth 1: 'AI Can Add Detail That Wasn't There'\n\n**Reality**: AI upscaling doesn't magically recover information that was never captured. What it does is intelligently predict and synthesize plausible detail based on patterns learned from millions of high-resolution images.\n\nThink of it like a master artist restoring a damaged painting — they can't see the original, but they know what details should be there based on experience. A 200px face won't become a perfect 4K portrait, but it will look significantly sharper and more natural than a simple pixel stretch.",
      "### Myth 2: 'All Upscalers Are the Same'\n\n**Reality**: There's a massive quality difference between upscalers. Older bicubic algorithms just blur pixels. Modern AI models like Real-ESRGAN, GFPGAN (for faces), and ESRGAN use deep learning to add genuine perceived detail.\n\nAt PixelForge, we use specialized models for different content types — face restoration for portraits, edge enhancement for line art and text, and natural detail for photographs.",
      "### Myth 3: 'Bigger Is Always Better'\n\n**Reality**: Upscaling beyond 4x often produces diminishing returns and can introduce artifacts. For most use cases:\n\n- **2x**: Excellent quality, barely distinguishable from a native high-res image\n- **4x**: Very good quality, minor artifacts on close inspection\n- **8x+**: Noticeable artifacts, best used for artistic effect rather than professional work\n\nWe recommend 2x or 4x for most applications.",
      "### Myth 4: 'Upscaling Works Equally Well on All Images'\n\n**Reality**: Results vary significantly based on the source image:\n\n- **Clean, sharp images** upscale beautifully\n- **Heavily compressed/JPEG artifacts** become more visible when enlarged\n- **Blurry or out-of-focus images** improve but remain soft\n- **Text and logos** can sometimes produce odd artifacts\n\nFor best results, start with the cleanest version of your image.",
      "### Myth 5: 'AI Upscaling Is Only for Photos'\n\n**Reality**: AI upscaling has applications far beyond photography:\n\n- **E-commerce**: Enhance low-res product images from suppliers\n- **Gaming**: Upscale retro game sprites and textures\n- **Archival**: Restore old family photos and historical documents\n- **Web design**: Convert small icons and graphics into high-res assets\n- **Print**: Prepare web-resolution images for print media\n- **Anime/Manga**: Enhance artwork and illustrations for wallpapers and prints\n\n### Try It Yourself\n\nWant to see what AI upscaling can really do? Upload an image to our Upscale tool and try a 2x or 4x enhancement. The results speak for themselves.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

/** Render a markdown-ish block into JSX with consistent typography */
function renderBlock(block: string, key: string) {
  // Heading
  if (block.startsWith("### ")) {
    return <h2 key={key} className="text-xl font-bold text-[#e8e8f0] mt-10 mb-4">{block.replace("### ", "")}</h2>;
  }

  // Bold inline helper — replaces **text** with <strong>
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-[#e8e8f0]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Unordered list
  if (block.startsWith("- ")) {
    const items = block.split("\n").filter((l) => l.startsWith("- "));
    return (
      <ul key={key} className="space-y-2 my-4 ml-1">
        {items.map((li, k) => (
          <li key={k} className="flex gap-2.5 text-[#c8c8d8] text-[15px] leading-relaxed">
            <span className="text-violet-400 mt-0.5 shrink-0">•</span>
            <span>{renderInline(li.replace(/^- /, ""))}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Ordered list
  if (/^\d+\./.test(block)) {
    const items = block.split("\n").filter((l) => /^\d+\./.test(l));
    return (
      <ol key={key} className="space-y-2 my-4 ml-1">
        {items.map((li, k) => (
          <li key={k} className="flex gap-2.5 text-[#c8c8d8] text-[15px] leading-relaxed">
            <span className="text-violet-400 font-bold mt-0.5 shrink-0">{k + 1}.</span>
            <span>{renderInline(li.replace(/^\d+\.\s*/, ""))}</span>
          </li>
        ))}
      </ol>
    );
  }

  // Paragraph
  return <p key={key} className="text-[#c8c8d8] text-[15px] leading-[1.8]">{renderInline(block)}</p>;
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[#8888a0] hover:text-violet-400 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-400">{article.tag}</span>
          <span className="text-xs text-[#8888a0]">{article.date} · {article.read} read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#e8e8f0] leading-tight">{article.title}</h1>
      </div>

      <article className="space-y-1">
        {article.body.map((para, i) =>
          para.split("\n\n").map((block, j) => renderBlock(block, `${i}-${j}`))
        )}
      </article>

      <div className="mt-14 pt-8 border-t border-[#2a2a45] text-center">
        <p className="text-sm text-[#8888a0] mb-4">Ready to put these tips into action?</p>
        <Link href="/tools" className="btn-primary inline-flex">Try Our Tools →</Link>
      </div>
    </div>
  );
}
