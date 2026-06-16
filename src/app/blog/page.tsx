import Link from "next/link";

const posts = [
  { slug: "how-ai-background-removal-works", title: "How AI Background Removal Works: A Deep Dive", excerpt: "Ever wondered how AI can instantly separate subjects from backgrounds? We break down the technology behind modern background removal.", date: "2025-06-10", tag: "Technology", read: "5 min" },
  { slug: "10-ways-to-use-ai-image-tools-for-ecommerce", title: "10 Ways AI Image Tools Boost Your E-Commerce Sales", excerpt: "Professional product photos can increase conversion rates by up to 40%. Discover how online sellers use AI tools to create stunning product listings.", date: "2025-06-08", tag: "Business", read: "7 min" },
  { slug: "ai-video-generation-future-of-content", title: "AI Video Generation: A Beginner's Complete Guide", excerpt: "Text-to-video AI is revolutionizing content creation. Learn how to write effective prompts and produce professional-quality videos in minutes.", date: "2025-06-05", tag: "Tutorial", read: "8 min" },
  { slug: "speech-to-text-revolutionize-transcription", title: "Speech-to-Text Tools Compared: Accuracy, Speed & Price", excerpt: "We tested 8 popular speech-to-text services. See how Whisper, Google, and others compare on accuracy, speed, and cost.", date: "2025-06-02", tag: "Comparison", read: "6 min" },
  { slug: "complete-guide-to-image-formats", title: "Why We Built PixelForge: One Toolkit for Everything", excerpt: "We were tired of juggling 10 different tools. PixelForge was born from the idea that one affordable platform could replace them all.", date: "2025-05-28", tag: "Behind the Scenes", read: "4 min" },
  { slug: "ai-audio-enhancement-noise-removal", title: "5 Myths About AI Image Upscaling — Debunked", excerpt: "We bust the most common misconceptions about AI-powered image enhancement and show you what's actually possible today.", date: "2025-05-25", tag: "Technology", read: "5 min" },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">Blog</span>
        <h1 className="text-3xl font-black text-[#e8e8f0]">PixelForge <span className="gradient-text">Blog</span></h1>
        <p className="mt-3 text-[#8888a0]">Tips, tutorials, and insights for creators</p>
      </div>
      <div className="card mb-8 bg-gradient-to-br from-violet-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">{posts[0].tag}</span>
          <span className="text-xs text-[#8888a0]">{posts[0].date} · {posts[0].read} read</span>
        </div>
        <h2 className="text-xl font-black text-[#e8e8f0] mb-2">{posts[0].title}</h2>
        <p className="text-sm text-[#8888a0] leading-relaxed mb-4">{posts[0].excerpt}</p>
        <Link href={`/blog/${posts[0].slug}`} className="text-sm text-violet-400 font-medium hover:text-violet-300">Read full article →</Link>
      </div>
      <div className="space-y-4">
        {posts.slice(1).map((post) => (
          <div key={post.slug} className="card hover:border-violet-500/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">{post.tag}</span>
              <span className="text-xs text-[#8888a0]">{post.date} · {post.read} read</span>
            </div>
            <h3 className="text-base font-bold text-[#e8e8f0] mb-2">{post.title}</h3>
            <p className="text-sm text-[#8888a0] leading-relaxed">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-sm text-violet-400 font-medium hover:text-violet-300 mt-2 inline-block">Read more →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
