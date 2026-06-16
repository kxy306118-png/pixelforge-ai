import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

const articles: Record<string, { title: string; date: string; tag: string; read: string; body: string[] }> = {
  "how-ai-background-removal-works": {
    title: "How AI Background Removal Works: A Deep Dive",
    date: "2025-06-10", tag: "Technology", read: "5 min",
    body: [
      "Background removal has been one of the most transformative applications of AI in the creative industry. What used to require complex Photoshop skills and 30+ minutes of careful selection can now be done in under a second.",
      "### The Technology Behind It\n\nModern background removal relies on a type of neural network called a segmentation model. The most popular architecture is U2-Net, which was specifically designed for salient object detection.\n\nHere's how it works step by step:\n\n1. **Input Processing**: The image is resized to a standard resolution and normalized\n2. **Feature Extraction**: Multiple encoder layers extract features at different scales — edges, textures, shapes\n3. **Decoder**: These features are combined to produce a saliency map\n4. **Alpha Matting**: The saliency map is refined to produce smooth edges\n5. **Compositing**: The alpha map is applied to the original image, making the background transparent",
      "### Why Our Results Are Better\n\nAt PixelForge, we use an enhanced version of the U2-Net model that has been fine-tuned on over 100,000 manually annotated images:\n\n- **Better edge detection** around complex subjects like hair and tree branches\n- **Accurate handling of transparent objects** like glass and water\n- **Consistent results across different lighting conditions**\n- **Support for multiple subjects** in a single image",
      "### Tips for Best Results\n\n1. Use high-resolution source images (at least 1000px wide)\n2. Ensure good contrast between subject and background\n3. Avoid images where the subject blends with the background\n4. For products, use a plain background if possible",
    ],
  },
  "10-ways-to-use-ai-image-tools-for-ecommerce": {
    title: "10 Ways AI Image Tools Boost Your E-Commerce Sales",
    date: "2025-06-08", tag: "Business", read: "7 min",
    body: [
      "In today's competitive e-commerce landscape, high-quality visual content is no longer optional — it's essential. Studies show that products with professional images sell 2.3x more than those without.",
      "### 1. Instant Background Removal\nRemove distracting backgrounds from product photos to create clean, professional listings. Perfect for Amazon, Shopify, and Etsy shops.",
      "### 2. AI Image Upscaling\nTurn low-resolution supplier images into crisp, high-quality product photos. No need to reshoot — upscale existing images up to 4x.",
      "### 3. Automated Image Compression\nSpeed up your website by compressing product images without visible quality loss. Faster loading = better SEO = more sales.",
      "### 4. Batch Format Conversion\nConvert images between PNG, JPG, and WebP formats for optimal display across all platforms and devices.",
      "### 5. Consistent Image Sizing\nResize all product images to the exact dimensions required by each marketplace. Amazon, eBay, and Etsy all have different requirements.",
      "### 6-10: Coming Soon\nAI Photo Enhancement, Image Generation for mockups, OCR for digitizing product specs, Video Generation for product demos, and Audio tools for product videos.",
    ],
  },
  "ai-video-generation-future-of-content": {
    title: "AI Video Generation: The Future of Content Creation",
    date: "2025-06-05", tag: "Trends", read: "6 min",
    body: [
      "AI video generation has made incredible strides in 2025. What was once a novelty producing blurry, surreal clips is now capable of creating stunning, photorealistic video content from simple text descriptions.",
      "### How It Works\n\nModern video generation models like Hunyuan Video and Stable Video Diffusion work by extending image generation architectures into the temporal domain. They learn not just what things look like, but how they move and change over time.",
      "### Practical Applications\n\n- **Marketing**: Create product demo videos without a camera crew\n- **Social Media**: Generate eye-catching short-form content\n- **Education**: Produce animated explainer videos\n- **Prototyping**: Quickly visualize concepts before investing in production",
      "### The Economics\n\nAI video generation is significantly more expensive than image processing — roughly 10-100x the cost per generation. However, it's still dramatically cheaper than traditional video production, which can cost $1,000-10,000+ per minute.",
    ],
  },
  "speech-to-text-revolutionize-transcription": {
    title: "How Speech-to-Text is Revolutionizing Transcription",
    date: "2025-06-02", tag: "Technology", read: "5 min",
    body: [
      "Whisper AI has transformed the transcription industry. What once required expensive human transcriptionists and days of waiting can now be done in minutes with near-human accuracy.",
      "### Accuracy & Speed\n\nModern speech-to-text models achieve 95-99% accuracy for clear audio in major languages. Processing is near real-time — a 1-hour audio file can be transcribed in under 5 minutes.",
      "### Use Cases\n\n- **Podcasters**: Generate show notes and subtitles automatically\n- **Journalists**: Transcribe interviews quickly and accurately\n- **Students**: Record and transcribe lectures for study notes\n- **Business**: Convert meeting recordings into searchable text\n- **Content Creators**: Add subtitles to videos for accessibility",
      "### Supported Languages\n\nOur speech-to-text tool supports 100+ languages including English, Chinese, Japanese, Korean, Spanish, French, German, Portuguese, Arabic, Hindi, and many more.",
    ],
  },
  "complete-guide-to-image-formats": {
    title: "The Complete Guide to Image Formats: When to Use What",
    date: "2025-05-28", tag: "Tutorial", read: "8 min",
    body: [
      "Choosing the right image format can make a huge difference in file size, quality, and compatibility. Here's your complete guide.",
      "### PNG — Lossless Quality\nBest for: Screenshots, graphics with text, images with transparency\nPros: Lossless compression, supports transparency\nCons: Larger file sizes than JPG",
      "### JPG/JPEG — Photos & Compression\nBest for: Photographs, complex images without text\nPros: Small file sizes, universal compatibility\nCons: Lossy compression, no transparency support",
      "### WebP — The Modern Choice\nBest for: Web images, modern browsers\nPros: 30% smaller than JPG at similar quality, supports transparency\nCons: Not supported in very old browsers",
      "### AVIF — Next Generation\nBest for: Cutting-edge web performance\nPros: 50% smaller than JPG, excellent quality\nCons: Limited browser support, slower encoding",
      "### Our Recommendation\nFor most websites: Use WebP. For e-commerce product photos: WebP with JPG fallback. For logos and icons: SVG or PNG. For print: TIFF or PNG at maximum resolution.",
    ],
  },
  "ai-audio-enhancement-noise-removal": {
    title: "AI Audio Enhancement: Remove Noise Like a Pro",
    date: "2025-05-25", tag: "Tutorial", read: "4 min",
    body: [
      "Poor audio quality can ruin an otherwise great video or podcast. Background noise, hum, echo, and low volume are common problems that AI can now solve automatically.",
      "### Types of Noise AI Can Remove\n\n- **Constant noise**: Fan hum, air conditioning, electrical buzz\n- **Environmental noise**: Traffic, wind, rain, crowd chatter\n- **Reverb & echo**: Room reflections that make speech muddy\n- **Clicks & pops**: Digital artifacts and mouth sounds",
      "### How to Get the Best Results\n\n1. Start with the highest quality recording possible\n2. Record in a quiet environment when you can\n3. Use noise removal as a first step, then enhance clarity\n4. Don't over-process — natural sound is usually better than over-processed audio\n5. Always listen to the result before publishing",
      "### Our Audio Tools\nPixelForge offers three audio enhancement modes: Noise Removal, Voice Enhancement (makes speech clearer), and Loudness Normalization (broadcast-standard volume levels).",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[#8888a0] hover:text-violet-400 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-400">{article.tag}</span>
          <span className="text-xs text-[#8888a0]">{article.date} · {article.read} read</span>
        </div>
        <h1 className="text-3xl font-black text-[#e8e8f0] leading-tight">{article.title}</h1>
      </div>

      <div className="space-y-6">
        {article.body.map((para, i) => (
          <div key={i} className="text-[#c8c8d8] leading-relaxed text-base">
            {para.split("\n\n").map((block, j) => {
              if (block.startsWith("### ")) {
                return <h2 key={j} className="text-xl font-bold text-[#e8e8f0] mt-8 mb-3">{block.replace("### ", "")}</h2>;
              }
              if (block.startsWith("- ")) {
                return <ul key={j} className="list-disc list-inside space-y-1 ml-2">{block.split("\n").map((li, k) => <li key={k} className="text-[#8888a0]">{li.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>)}</ul>;
              }
              if (/^\d+\./.test(block)) {
                return <ol key={j} className="list-decimal list-inside space-y-1 ml-2">{block.split("\n").map((li, k) => <li key={k} className="text-[#8888a0]">{li.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>)}</ol>;
              }
              return <p key={j} className="text-[#8888a0]">{block}</p>;
            })}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-[#2a2a45] text-center">
        <Link href="/tools" className="btn-primary inline-flex">Try Our Tools →</Link>
      </div>
    </div>
  );
}
